import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import StatusModal from '@widgets/modals/status-modal/StatusModal';
import userCircleIcon from '@shared/assets/img/user-circle-100.svg';
import notificationIcon from '@shared/assets/img/notification-100.svg';
import ModalGatekeeper from '@widgets/modals/modal-gatekeeper';
import { UserSkillCard } from '@shared/ui/user-skill-card';
import type { UserSkillCardProps } from '@shared/ui/user-skill-card/types';
import type { SkillTag } from '@shared/ui/skill-tag-list/type';
import skillsApi from '@entities/skill/api/skillsApi';
import usersApi from '@entities/user/api/usersApi';
import categoryApi from '@entities/category/api/categoriesApi';
import cityApi from '@entities/city/api/citiesApi';
import type { Skill, User, City } from '@shared/types';
import { calculateAge, getCategoryColorBySubcategoryId } from '@shared/helpers';
import { Skill as SkillWidget } from '@widgets/skill';
import SectionSimilarOffers from '@shared/ui/section-similar-offers';
import buildUserCards from '@entities/user/buildUserCards';
import type { UserCardProps } from '@shared/ui/user-card/types';
import Modal from '@features/modal/Modal';
import { selectAllSkills } from '@entities/skill/model/skillsSlice';
import { selectAllUsers } from '@entities/user';
import { selectCurrentUser, selectIsAuthenticated } from '@features/auth';
import { useRequestsApi } from '@features/requests';
import { selectOutgoingPendingRequests } from '@entities/request';
import { useSelector } from '@app/store';
import styles from './skill-page.module.scss';

function SkillPage() {
  const { id } = useParams<{ id: string }>();

  const [skill, setSkill] = useState<Skill | null>(null);
  const [userCardData, setUserCardData] = useState<UserSkillCardProps | null>(null);
  const [skillDescription, setSkillDescription] = useState<{
    skillName: string;
    category: string;
    subcategory: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<UserCardProps[]>([]);
  const [isSkillCreatedModalOpen, setIsSkillCreatedModalOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [isGatekeeperModalOpen, setIsGatekeeperModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const allSkills = useSelector(selectAllSkills);
  const allUsers = useSelector(selectAllUsers);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { createRequest } = useRequestsApi();
  const outgoingPendingRequests = useSelector((state) =>
    selectOutgoingPendingRequests(state, currentUser?.id ?? 1)
  );

  useEffect(() => {
    if (searchParams.get('registerSuccess')) {
      setIsSkillCreatedModalOpen(true);
    }
    let mounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [skillsData, categoriesData, citiesData] = await Promise.all([
          skillsApi.getSkills(),
          categoryApi.getAll(),
          cityApi.getCities(),
        ]);

        if (!mounted) return;

        const currentSkill = allSkills.find((s) => s.id === Number(id));
        if (!currentSkill) {
          setError('Навык не найден');
          return;
        }

        const creator = allUsers.find((s) => s.id === Number(currentSkill.userId));
        if (!creator) {
          setError('Пользователь не найден');
          return;
        }

        const { categories, subcategories } = categoriesData;
        const cities = citiesData;

        const userSkills = skillsData.filter((s) => s.userId === creator.id);
        const canTeach: SkillTag[] = userSkills.map((userSkill) => ({
          id: String(userSkill.id),
          text: userSkill.title,
          bgColor: getCategoryColorBySubcategoryId(
            userSkill.subcategoryId || 0,
            categories,
            subcategories
          ),
        }));

        const wantsToLearn: SkillTag[] = (creator.skillInterests || [])
          .map((sid) => {
            const subcategory = subcategories.find((sc) => sc.id === sid);
            if (!subcategory) return null;
            return {
              id: String(sid),
              text: subcategory.name,
              bgColor: getCategoryColorBySubcategoryId(sid, categories, subcategories),
            };
          })
          .filter((tag): tag is SkillTag => tag !== null);

        const city = cities.find((c: City) => c.id === creator.cityId);

        const subcategory = subcategories.find((sc) => sc.id === currentSkill.subcategoryId);
        const category = categories.find((c) => c.id === subcategory?.categoryId);

        setSkillDescription({
          skillName: currentSkill.title,
          category: category?.name || '',
          subcategory: subcategory?.name || '',
          description: currentSkill.description,
        });

        setUserCardData({
          name: creator.name ?? 'Без имени',
          city: city?.name || 'Город не указан',
          age: calculateAge(creator.dateOfBirth),
          about: creator.about ?? '',
          canTeach,
          wantsToLearn,
          avatarUrl: creator.avatarUrl ?? null,
        });

        setSkill(currentSkill);

        // --- Похожие предложения (используя уже полученные данные о навыках) ---
        const similarSkills = skillsData.filter(
          (s) => s.subcategoryId === currentSkill.subcategoryId && s.id !== currentSkill.id
        );

        // ограничение до 12 уникальных предложений
        const creatorIds = Array.from(new Set(similarSkills.map((s) => s.userId))).slice(0, 12);
        const creators = await Promise.all(creatorIds.map((uid) => usersApi.getUserById(uid)));
        const rawCreators = creators.filter((c): c is User => c !== null);

        if (mounted) {
          const mappedOffers = buildUserCards(rawCreators, skillsData, citiesData, categoriesData);
          setOffers(mappedOffers.slice(0, 12));
        }
      } catch (err) {
        if (mounted) {
          setError('Ошибка загрузки данных');
          console.error(err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const closeSkillCreatedModal = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('registerSuccess');
    setSearchParams(params);
    setIsSkillCreatedModalOpen(false);
  };

  const closeExchangeModal = () => setIsExchangeModalOpen(false);
  const closeGatekeeperModal = () => setIsGatekeeperModalOpen(false);

  if (isLoading) {
    return (
      <section className={styles.skill}>
        <p>Загрузка данных навыка...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.skill}>
        <h2>Ошибка</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!skill || !skillDescription) {
    return <p>Загрузка...</p>;
  }

  if (!skill || !userCardData || !skillDescription) {
    return (
      <section className={styles.skill}>
        <h2>Навык не найден</h2>
        <p>Запрашиваемый навык не существует.</p>
      </section>
    );
  }

  // Проверяем, является ли текущий пользователь владельцем навыка
  const isOwner = currentUser && skill ? currentUser.id === skill.userId : false;

  // Проверяем, отправлялась ли уже заявка на этот навык
  const requestSent =
    currentUser && skill
      ? outgoingPendingRequests.some((request) => request.requestedSkill === skill.id)
      : false;

  // handlers for similar offers section
  const handleLike = (userId: number) => {
    // TODO: интеграция с favorites
    console.log('Like user', userId);
  };

  const handleDetails = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  // Обработчик клика по кнопке "Предложить обмен"
  const handleOfferExchange = (skillId: number) => {
    if (isAuthenticated && currentUser && skill) {
      createRequest({
        requestedSkill: skillId,
        fromUser: currentUser.id,
        toUser: skill.userId,
      });
      setIsExchangeModalOpen(true);
    } else {
      setIsGatekeeperModalOpen(true);
    }
  };

  return (
    <>
      <UserSkillCard
        name={userCardData.name}
        city={userCardData.city}
        age={userCardData.age}
        about={userCardData.about}
        canTeach={userCardData.canTeach}
        wantsToLearn={userCardData.wantsToLearn}
        avatarUrl={userCardData.avatarUrl}
      />
      <SkillWidget
        skill={skill}
        skillDescription={skillDescription}
        isLiked={false}
        isOwner={isOwner} // Передаем флаг владельца
        requestSent={requestSent} // Передаем флаг отправленной заявки
        onLike={(skillId) => {
          // TODO: добавить/удалить из favorites в localStorage
          console.log('Like skill', skillId);
        }}
        onShare={(skillId) => {
          // TODO: реализовать share через Web Share API или clipboard
          console.log('Share skill', skillId);
        }}
        onMoreDetails={handleOfferExchange}
      />
      {/* Similar offers section */}
      <SectionSimilarOffers
        title="Похожие предложения"
        cards={offers}
        isLoading={isLoading}
        onLikeClick={handleLike}
        onDetailsClick={handleDetails}
      />
      {isSkillCreatedModalOpen && (
        <Modal onClose={closeSkillCreatedModal}>
          <StatusModal
            onClose={closeSkillCreatedModal}
            icon={userCircleIcon}
            title="Ваше предложение создано"
            text="Теперь вы можете предложить обмен"
            buttonText="Готово"
          />
        </Modal>
      )}
      {isExchangeModalOpen && (
        <Modal onClose={closeExchangeModal}>
          <StatusModal
            onClose={closeExchangeModal}
            icon={notificationIcon}
            title="Вы предложили обмен"
            text="Теперь дождитесь подтверждения. Вам придёт уведомление"
            buttonText="Готово"
          />
        </Modal>
      )}
      {isGatekeeperModalOpen && (
        <Modal onClose={closeGatekeeperModal}>
          <ModalGatekeeper onClose={closeGatekeeperModal} />
        </Modal>
      )}
    </>
  );
}

export default SkillPage;
