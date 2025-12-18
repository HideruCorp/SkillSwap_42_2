import { memo, useMemo } from 'react';
import { useSelector } from '@app/store';
import { selectUserById } from '@entities/user';
import { selectSkillById } from '@entities/skill';
import { calculateAge } from '@shared/lib/date';
import { getCategoryColorBySubcategoryId } from '@shared/lib/utils';
import type { Category, Subcategory, City } from '@shared/types';
import { LikeButton } from '@features/favorites';
import type { SkillCardProps } from './types';
import SkillCard from './SkillCard';

type Props = {
  skillId: number;
  categories: Category[];
  subcategories: Subcategory[];
  cities: City[];
};

const SkillCardContainer = memo(({ skillId, categories, subcategories, cities }: Props) => {
  const skill = useSelector((state) => selectSkillById(state, skillId));
  const user = useSelector((state) => (skill ? selectUserById(state, skill.userId) : undefined));

  const cardProps = useMemo(() => {
    if (!user || !skill) return null;

    const canTeach = {
      id: String(skill.id),
      text: skill.title,
      bgColor: getCategoryColorBySubcategoryId(skill.subcategoryId ?? 0, categories, subcategories),
    };

    const wantsToLearn =
      Array.isArray(user.skillInterests) && user.skillInterests.length > 0
        ? user.skillInterests
            .map((sid) => {
              const sub = subcategories.find((sc: { id: number }) => sc.id === sid);
              if (!sub) return null;
              return {
                id: String(sid),
                text: sub.name,
                bgColor: getCategoryColorBySubcategoryId(sid, categories, subcategories),
              };
            })
            .filter((t): t is { id: string; text: string; bgColor: string } => t !== null)
        : [];

    const getCityName = (cityId: number | undefined): string => {
      if (!cityId) return 'Город не указан';
      const found = cities.find((c) => c.id === cityId);
      return found?.name ?? 'Город не указан';
    };

    return {
      id: skill.id,
      userId: user.id,
      name: user.name ?? 'Без имени',
      city: getCityName(user.cityId),
      age: calculateAge(user.dateOfBirth ?? ''),
      canTeach,
      wantsToLearn,
      avatarUrl: user.avatarUrl ?? null,
    } as Omit<SkillCardProps, 'actionSlot'>;
  }, [user, skill, categories, subcategories, cities]);

  if (!cardProps) return null;

  return (
    <SkillCard
      id={cardProps.id}
      userId={cardProps.userId}
      name={cardProps.name}
      city={cardProps.city}
      age={cardProps.age}
      canTeach={cardProps.canTeach}
      wantsToLearn={cardProps.wantsToLearn}
      avatarUrl={cardProps.avatarUrl}
      actionSlot={<LikeButton skillId={skillId} />}
    />
  );
});

SkillCardContainer.displayName = 'SkillCardContainer';

export default SkillCardContainer;
