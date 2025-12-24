import type { Meta, StoryObj } from '@storybook/react'
import filtersReducer from '@features/filters'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import FilterBar from './FilterBar'

const meta: Meta<typeof FilterBar> = {
  title: 'Widgets/FilterBar',
  component: FilterBar,
} satisfies Meta<typeof FilterBar>

export default meta
type Story = StoryObj<typeof FilterBar>

// Helper для создания store с предзаполненным состоянием
function createMockStore(filters = {}) {
  return configureStore({
    reducer: {
      filters: filtersReducer,
    },
    preloadedState: {
      filters: {
        skillType: 'all',
        gender: 'all',
        cities: [],
        subcategories: [],
        textSearch: '',
        ...filters,
      },
    },
  })
}

// Story 1: Пустое состояние (не отображается)
export const Empty: Story = {
  render: () => {
    const store = createMockStore()
    return (
      <Provider store={store}>
        <div style={{ padding: '20px' }}>
          <FilterBar />
          <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
            FilterBar возвращает null когда нет активных фильтров
          </div>
        </div>
      </Provider>
    )
  },
}

// Story 2: Один фильтр (skillType)
export const WithSkillType: Story = {
  render: () => {
    const store = createMockStore({
      skillType: 'learn',
    })
    return (
      <Provider store={store}>
        <div style={{ padding: '20px' }}>
          <FilterBar />
        </div>
      </Provider>
    )
  },
}

// Story 3: Несколько фильтров
export const WithMultipleFilters: Story = {
  render: () => {
    const store = createMockStore({
      skillType: 'learn',
      gender: 'male',
      cities: ['Москва', 'Санкт-Петербург'],
      subcategories: [1, 5, 12],
      textSearch: 'React',
    })
    return (
      <Provider store={store}>
        <div style={{ padding: '20px' }}>
          <FilterBar />
        </div>
      </Provider>
    )
  },
}

// Story 4: Только города
export const WithCities: Story = {
  render: () => {
    const store = createMockStore({
      cities: ['Москва', 'Казань', 'Новосибирск'],
    })
    return (
      <Provider store={store}>
        <div style={{ padding: '20px' }}>
          <FilterBar />
        </div>
      </Provider>
    )
  },
}

// Story 5: Только текстовый поиск
export const WithTextSearch: Story = {
  render: () => {
    const store = createMockStore({
      textSearch: 'JavaScript',
    })
    return (
      <Provider store={store}>
        <div style={{ padding: '20px' }}>
          <FilterBar />
        </div>
      </Provider>
    )
  },
}

// Story 6: Только гендер
export const WithGender: Story = {
  render: () => {
    const store = createMockStore({
      gender: 'female',
    })
    return (
      <Provider store={store}>
        <div style={{ padding: '20px' }}>
          <FilterBar />
        </div>
      </Provider>
    )
  },
}

// Story 7: Все фильтры максимальные значения
export const WithAllFilters: Story = {
  render: () => {
    const store = createMockStore({
      skillType: 'teach',
      gender: 'male',
      cities: ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург'],
      subcategories: [1, 2, 3, 5, 8, 12, 15],
      textSearch: 'TypeScript React Redux',
    })
    return (
      <Provider store={store}>
        <div style={{ padding: '20px' }}>
          <FilterBar />
        </div>
      </Provider>
    )
  },
}
