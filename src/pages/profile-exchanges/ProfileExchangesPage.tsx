import { useEffect } from 'react';
import { useSelector, useDispatch } from '@app/store';
import { selectCurrentUserId } from '@features/auth';
import {
  selectActiveExchangesByUserId,
  selectArchivedExchangesByUserId,
} from '@features/exchanges';
import { initializeExchanges, selectExchangesLoading } from '@entities/exchange';
import { ExchangeCard } from '@widgets/exchange-card';
import SectionHeaderUI from '@shared/ui/section-header/SectionHeaderUI';
import styles from './profile-exchanges-page.module.scss';

/**
 * ProfileExchangesPage - страница "Мои обмены" в профиле пользователя
 * Реализует вкладку "Мои обмены" в разделе профиля
 *
 * Роут: /profile/exchanges
 */

function ProfileExchangesPage() {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUserId);
  const isLoading = useSelector(selectExchangesLoading);

  // Get exchanges data using selectors
  const activeExchanges = useSelector((state) =>
    currentUserId ? selectActiveExchangesByUserId(state, currentUserId) : []
  );
  const archivedExchanges = useSelector((state) =>
    currentUserId ? selectArchivedExchangesByUserId(state, currentUserId) : []
  );

  useEffect(() => {
    dispatch(initializeExchanges());
  }, [dispatch]);

  if (!currentUserId) {
    return (
      <section className={styles.profileExchanges}>
        <SectionHeaderUI title="Мои обмены" />
        <div className={styles.loader}>Загрузка...</div>
      </section>
    );
  }

  // Helper function to render a section
  const renderSection = (
    title: string,
    exchanges: ReturnType<typeof selectActiveExchangesByUserId>,
    emptyMessage: string
  ) => {
    if (isLoading && exchanges.length === 0) {
      return (
        <div className={styles.section}>
          <SectionHeaderUI title={title} />
          <div className={styles.loader}>Загрузка...</div>
        </div>
      );
    }

    if (exchanges.length === 0) {
      return (
        <div className={styles.section}>
          <SectionHeaderUI title={title} />
          <p className={styles.emptyState}>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className={styles.section}>
        <SectionHeaderUI title={title} />
        <div className={styles.cardList}>
          {exchanges.map((exchange) => (
            <ExchangeCard key={exchange.id} exchange={exchange} currentUserId={currentUserId} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className={styles.profileExchanges}>
      {renderSection('Активные', activeExchanges, 'Нет активных обменов')}
      {renderSection('Архив', archivedExchanges, 'Архив пуст')}
    </section>
  );
}

export default ProfileExchangesPage;
