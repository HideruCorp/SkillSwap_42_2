import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from '@app/store';
import { selectCurrentUserId } from '@features/auth';
import { selectIncomingPendingRequests, selectArchivedRequests } from '@features/requests';
import { selectOutgoingPendingRequests, selectRequestsLoading } from '@entities/request';
import { SkillRequestCard } from '@widgets/skill-request-card';
import SectionHeaderUI from '@shared/ui/section-header/SectionHeaderUI';
import type { Request as RequestType } from '@shared/types';
import styles from './profile-requests-page.module.scss';

/**
 * ProfileRequestsPage - страница "Заявки" в профиле пользователя
 * Реализует три секции: входящие заявки, исходящие заявки и архив
 *
 * Роут: /profile/requests
 * Поддерживает deep-linking: /profile/requests?requestId=123
 */

function ProfileRequestsPage() {
  const [searchParams] = useSearchParams();
  const currentUserId = useSelector(selectCurrentUserId);
  const isLoading = useSelector(selectRequestsLoading);

  // Get requests data using selectors
  const incomingPending = useSelector((state) =>
    currentUserId ? selectIncomingPendingRequests(state, currentUserId) : []
  );
  const outgoingPending = useSelector((state) =>
    currentUserId ? selectOutgoingPendingRequests(state, currentUserId) : []
  );
  const archived = useSelector((state) =>
    currentUserId ? selectArchivedRequests(state, currentUserId) : []
  );

  // Scroll to request from URL params
  useEffect(() => {
    if (isLoading) return;

    const requestId = searchParams.get('requestId');
    if (requestId) {
      const element = document.querySelector(`[data-request-id="${requestId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [searchParams, isLoading]);

  // Helper function to render a section
  const renderSection = (title: string, requests: RequestType[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className={styles.section}>
          <SectionHeaderUI title={title} />
          <div className={styles.cardList}>
            {requests.map((request) => (
              <SkillRequestCard
                key={request.id}
                request={request}
                currentUserId={currentUserId as number}
              />
            ))}
          </div>
        </div>
      );
    }

    if (requests.length === 0) {
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
          {requests.map((request) => (
            <SkillRequestCard
              key={request.id}
              request={request}
              currentUserId={currentUserId as number}
            />
          ))}
        </div>
      </div>
    );
  };

  if (!currentUserId) {
    return (
      <section className={styles.profileRequests}>
        <SectionHeaderUI title="Заявки" />
        <div className={styles.loader}>Загрузка...</div>
      </section>
    );
  }

  return (
    <section className={styles.profileRequests}>
      {renderSection('Входящие заявки', incomingPending, 'Нет входящих заявок')}
      {renderSection('Исходящие заявки', outgoingPending, 'Нет исходящих заявок')}
      {renderSection('Архив', archived, 'Архив пуст')}
    </section>
  );
}

export default ProfileRequestsPage;
