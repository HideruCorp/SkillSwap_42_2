import { useState, useEffect, useMemo } from 'react';
import { useSelector } from '@app/store';
import { selectUserById } from '@entities/user';
import { selectSkillById, selectSkillsByUserId } from '@entities/skill';
import { selectExchangeByRequestId } from '@entities/exchange';
import cityApi from '@entities/city/api/citiesApi';
import categoryApi from '@entities/category/api/categoriesApi';
import { useRequestsApi } from '@features/requests';
import type { Request, Category, Subcategory } from '@shared/types';
import { SkillTagUI } from '@shared/ui/skill-tag';
import { DropdownListUI, type OptionType } from '@shared/ui/dropdown-list';
import Button from '@shared/ui/button/Button';
import { formatRelativeDate } from '@shared/lib/date';
import { calculateAge } from '@shared/helpers/dateHelpers';
import { getCategoryColorBySubcategoryId } from '@shared/helpers/categoryHelpers';
import { getAgeSuffix } from '@shared/lib/utils';
import styles from './skill-request-card.module.scss';

interface SkillRequestCardProps {
  request: Request;
  currentUserId: number;
}

interface SkillDisplayData {
  title: string;
  color: string;
  categoryName: string;
  subcategoryName: string;
}

export default function SkillRequestCard({ request, currentUserId }: SkillRequestCardProps) {
  const { acceptRequest, rejectRequest, cancelRequest } = useRequestsApi();

  const requestedSkill = useSelector((state) => selectSkillById(state, request.requestedSkill));
  const isIncoming = requestedSkill?.userId === currentUserId;
  const isOutgoing = request.fromUser === currentUserId;

  const displayedUserId = isIncoming ? request.fromUser : requestedSkill?.userId;
  const displayedUser = useSelector((state) =>
    displayedUserId ? selectUserById(state, displayedUserId) : undefined
  );

  const displayedUserSkills = useSelector((state) =>
    selectSkillsByUserId(state, displayedUserId ?? 1)
  );

  // Get exchange data for accepted requests
  const exchange = useSelector((state) => selectExchangeByRequestId(state, request.id));
  const exchangedSkillId =
    request.status === 'accepted' && exchange
      ? exchange.skills.find((id) => id !== request.requestedSkill)
      : undefined;
  const exchangedSkill = useSelector((state) =>
    exchangedSkillId ? selectSkillById(state, exchangedSkillId) : undefined
  );

  const [cityName, setCityName] = useState<string>('');
  const [categoriesData, setCategoriesData] = useState<{
    categories: Category[];
    subcategories: Subcategory[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<OptionType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [citiesData, catData] = await Promise.all([
          cityApi.getCities(),
          categoryApi.getAll(),
        ]);

        setCategoriesData(catData);

        if (displayedUser?.cityId) {
          const city = citiesData.find((c) => c.id === displayedUser.cityId);
          if (city) setCityName(city.name);
        }
      } catch {
        // Error loading data
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [displayedUser?.cityId]);

  // Helper to get skill display data
  const getSkillDisplayData = useMemo(() => {
    return (subcategoryId: number, title: string): SkillDisplayData => {
      if (!categoriesData) {
        return { title, color: '#EEE7F7', categoryName: '', subcategoryName: '' };
      }

      const { categories, subcategories } = categoriesData;
      const subcategory = subcategories.find((sub) => sub.id === subcategoryId);
      const category = subcategory
        ? categories.find((cat) => cat.id === subcategory.categoryId)
        : undefined;
      const color = getCategoryColorBySubcategoryId(subcategoryId, categories, subcategories);

      return {
        title,
        color,
        categoryName: category?.name || '',
        subcategoryName: subcategory?.name || '',
      };
    };
  }, [categoriesData]);

  const requestedSkillData = useMemo(() => {
    if (!requestedSkill) return null;
    return getSkillDisplayData(requestedSkill.subcategoryId, requestedSkill.title);
  }, [requestedSkill, getSkillDisplayData]);

  const exchangedSkillData = useMemo(() => {
    if (!exchangedSkill) return null;
    return getSkillDisplayData(exchangedSkill.subcategoryId, exchangedSkill.title);
  }, [exchangedSkill, getSkillDisplayData]);

  const dropdownOptions = useMemo(() => {
    if (!isIncoming) return [];

    const senderInterests = displayedUser?.skillInterests || [];

    const sortedSkills = [...displayedUserSkills].sort((a, b) => {
      const aMatches = senderInterests.includes(a.subcategoryId);
      const bMatches = senderInterests.includes(b.subcategoryId);
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });

    return sortedSkills.map((skill) => ({
      title: skill.title,
      value: String(skill.id),
    }));
  }, [isIncoming, displayedUserSkills, displayedUser?.skillInterests]);

  const handleAccept = () => {
    if (selectedSkill.length === 0) return;

    const success = acceptRequest({
      requestId: request.id,
      givenSkillId: Number(selectedSkill[0].value),
      receivedSkillId: request.requestedSkill,
    });

    if (success) {
      setSelectedSkill([]);
    }
  };

  const handleReject = () => {
    rejectRequest(request.id);
  };

  const handleCancel = () => {
    cancelRequest(request.id);
  };

  const handleDropdownChange = (selected: OptionType[]) => {
    setSelectedSkill(selected);
  };

  if (isLoading || !displayedUser || !requestedSkill || !requestedSkillData) {
    return (
      <div className={styles.card} data-request-id={request.id}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  const userAge = calculateAge(displayedUser.dateOfBirth);
  const userLocation = `${cityName}${userAge ? `, ${userAge} ${getAgeSuffix(userAge)}` : ''}`;
  const relativeDate = formatRelativeDate(new Date(request.createdAt));

  return (
    <div className={styles.card} data-request-id={request.id}>
      <section className={styles.userSection}>
        <div className={styles.avatarBlock}>
          {displayedUser.avatarUrl ? (
            <img src={displayedUser.avatarUrl} alt={displayedUser.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {displayedUser.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{displayedUser.name}</h3>
            <p className={styles.userLocation}>{userLocation}</p>
          </div>
        </div>
        <p className={styles.dateBadge}>
          Дата создания: <span>{relativeDate}</span>
        </p>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.skillInfo}>
          <h4 className={styles.skillHeader}>Хочет изучить:</h4>
          <SkillTagUI
            className={styles.tag}
            bgColor={requestedSkillData.color}
            text={requestedSkillData.title}
          />
          <p className={styles.skillCategory}>
            {requestedSkillData.categoryName} / {requestedSkillData.subcategoryName}
          </p>
        </div>

        {request.status === 'accepted' && exchangedSkillData && (
          <div className={styles.exchangeSection}>
            <h4 className={styles.skillHeader}>В обмен на:</h4>
            <SkillTagUI
              className={styles.tag}
              bgColor={exchangedSkillData.color}
              text={exchangedSkillData.title}
            />
            <p className={styles.skillCategory}>
              {exchangedSkillData.categoryName} / {exchangedSkillData.subcategoryName}
            </p>
          </div>
        )}

        {request.status === 'pending' && isIncoming && (
          <div className={styles.exchangeSection}>
            <h4 className={styles.skillHeader}>В обмен на:</h4>
            <div className={styles.dropdownWrapper}>
              <DropdownListUI
                selected={selectedSkill}
                options={dropdownOptions}
                placeholder="Выберите навык"
                title=""
                type="list"
                onChange={handleDropdownChange}
              />
            </div>
          </div>
        )}

        <div className={styles.actions}>
          {request.status === 'pending' && isIncoming && (
            <>
              <Button
                className={styles.actionButton}
                title="Отклонить"
                type="secondary"
                onClick={handleReject}
              />
              <Button
                className={styles.actionButton}
                title="Принять"
                type="primary"
                onClick={handleAccept}
                disabled={selectedSkill.length === 0}
              />
            </>
          )}
          {request.status === 'pending' && isOutgoing && (
            <Button
              className={styles.actionButton}
              title="Отозвать заявку"
              type="secondary"
              onClick={handleCancel}
            />
          )}
          {request.status === 'accepted' && (
            <div className={`${styles.statusBadge} ${styles.statusAccepted}`}>Заявка принята</div>
          )}
          {request.status === 'rejected' && (
            <div className={`${styles.statusBadge} ${styles.statusRejected}`}>Заявка отклонена</div>
          )}
        </div>
      </section>
    </div>
  );
}
