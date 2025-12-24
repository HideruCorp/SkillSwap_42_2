import { useDispatch } from '@app/store'
import { resetFilters, setTextSearch } from '@features/filters' // Добавили resetFilters
import { useActiveFilters } from '@features/filters/useActiveFilters'
import FilterBar from '@widgets/filter-bar'
import FiltersPanel from '@widgets/filters-panel'
import UsersSection from '@widgets/users-section/UsersSection'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './main-page.module.scss'

export function MainPage() {
  const { hasActiveFilters } = useActiveFilters()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const searchFromUrl = searchParams.get('search')

    if (searchFromUrl) {
      dispatch(setTextSearch(searchFromUrl))

      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('search')
      navigate({ search: newSearchParams.toString() }, { replace: true })
    }
  }, [location.search, dispatch, navigate])

  // Эффект для сброса фильтров при размонтировании компонента (уходе со страницы)
  useEffect(() => {
    return () => {
      // Сбрасываем все фильтры, кроме текстового поиска, если он есть
      dispatch(resetFilters())
    }
  }, [dispatch])

  return (
    <div className={styles.container}>
      <aside className={styles.filters}>
        <FiltersPanel />
      </aside>

      <section className={styles.content}>
        {hasActiveFilters
          ? (
              <>
                <div className={styles.controls}>
                  <FilterBar />
                </div>
                <UsersSection
                  title="Подходящие предложения"
                  mode="all"
                  infinite
                  previewLimit={21}
                  showCount
                  showSortButton
                />
              </>
            )
          : (
              <>
                <div className={styles.section}>
                  <UsersSection
                    title="Популярное"
                    mode="likes"
                    previewLimit={3}
                    infinite={false}
                    showAllButton
                  />
                </div>
                <div className={styles.section}>
                  <UsersSection
                    title="Новое"
                    mode="created"
                    previewLimit={3}
                    infinite={false}
                    showAllButton
                  />
                </div>
                <div className={styles.section}>
                  <UsersSection title="Рекомендуем" mode="recommended" infinite previewLimit={21} />
                </div>
              </>
            )}
      </section>
    </div>
  )
}

export default MainPage
