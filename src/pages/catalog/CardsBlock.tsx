import { useEffect, useState, type JSX } from 'react';
import UserCard from '@shared/ui/user-card/UserCard';
import type { UserCardProps } from '@shared/ui/user-card/types';
import type { SkillTag } from '@shared/ui/skill-tag-list/type';
import Button from '@shared/ui/button/Button';
import getUsersMock from '../../services/mockApi/users';
import getSkillsMock from '../../services/mockApi/skills';
import getCitiesMock from '../../services/mockApi/cities';
import getCategoriesMock from '../../services/mockApi/categories';
import './CardsBlock.scss';
import { calculateAge, getCategoryColorBySubcategoryId } from '../../shared/helpers';

interface CardsBlockProps {
  title: string;
  startIndex?: number;
  showButton?: boolean;
}

type RawUser = {
  id: number | string;
  avatarUrl?: string | null;
  name?: string;
  about?: string;
  cityId?: number;
  dateOfBirth?: string;
  skillInterests?: number[];
};

type RawSkill = {
  id: number;
  subcategoryId?: number;
  userId: number;
  title: string;
};

type RawCity = { id: number; name: string };
type RawCategory = { id: number; name: string; color: string };
type RawSubcategory = { id: number; name: string; categoryId: number };
type RawCategoriesJson = {
  categories: RawCategory[];
  subcategories: RawSubcategory[];
};

export function CardsBlock({
  title,
  startIndex = 0,
  showButton = true,
}: CardsBlockProps): JSX.Element {
  const [cards, setCards] = useState<UserCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [usersRes, skillsRes, citiesRes, categoriesRes] = await Promise.all([
          getUsersMock(),
          getSkillsMock(),
          getCitiesMock(),
          getCategoriesMock(),
        ]);

        const rawUsers: RawUser[] = Array.isArray(usersRes) ? usersRes : (usersRes.users ?? []);
        const rawSkills: RawSkill[] = Array.isArray(skillsRes)
          ? skillsRes
          : (skillsRes.skills ?? []);
        const rawCities: RawCity[] = Array.isArray(citiesRes)
          ? citiesRes
          : (citiesRes.cities ?? []);
        const rawCategories: RawCategoriesJson = categoriesRes;

        const categories = rawCategories?.categories || [];
        const subcategories = rawCategories?.subcategories || [];

        // const getCategoryColorBySubcategoryId = (subcategoryId: number): string => {
        //   const subcategory = subcategories.find((sc) => sc.id === subcategoryId);
        //   if (!subcategory) return '#EEE7F7';
        //   const category = categories.find((c) => c.id === subcategory.categoryId);
        //   return category?.color || '#EEE7F7';
        // };

        const mapped: UserCardProps[] = rawUsers.map((u) => {
          const id = typeof u.id === 'number' ? u.id : Number(u.id);

          const userSkillsRaw = rawSkills.filter((s) => s.userId === id);
          const canTeach: SkillTag[] = userSkillsRaw.map((skill) => ({
            id: String(skill.id),
            text: skill.title,

            bgColor: getCategoryColorBySubcategoryId(
              skill.subcategoryId || 0,
              categories,
              subcategories
            ),
          }));

          const wantsToLearn: SkillTag[] =
            Array.isArray(u.skillInterests) && u.skillInterests.length > 0
              ? u.skillInterests
                  .map((sid) => {
                    const subcategory = subcategories.find((sc) => sc.id === sid);
                    if (!subcategory) return null;
                    return {
                      id: String(sid),
                      text: subcategory.name,
                      bgColor: getCategoryColorBySubcategoryId(sid, categories, subcategories),
                    };
                  })
                  .filter((tag): tag is SkillTag => tag !== null)
              : [];

          const age = u.dateOfBirth ? calculateAge(u.dateOfBirth) : 0;

          return {
            name: u.name ?? 'Без имени',
            city:
              (typeof u.cityId === 'number' && rawCities?.find((c) => c.id === u.cityId)?.name) ||
              'Город не указан',
            age,
            canTeach,
            wantsToLearn,
            avatarUrl: u.avatarUrl ?? null,
          };
        });

        if (!mounted) return;
        // Берем 3 карточки начиная с startIndex
        setCards(mapped.slice(startIndex, startIndex + 3));
      } catch (err) {
        // TODO: handle error properly
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [startIndex]);

  return (
    <div className="cards-block">
      <div className={`cards-block__header ${!showButton ? 'cards-block__header--no-button' : ''}`}>
        <h2 className="cards-block__title">{title}</h2>
        {showButton && (
          <Button
            title="смотреть все"
            onClick={() => {
              // TODO: implement navigation to full list
            }}
            type="default"
          />
        )}
      </div>
      {loading ? (
        <div className="cards-block__grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${startIndex}-${i}`}
              style={{ height: 448, background: '#f4f4f4', borderRadius: 12 }}
            />
          ))}
        </div>
      ) : (
        <div className="cards-block__grid">
          {cards.map((userProps, idx) => {
            // Используем комбинацию индекса и startIndex для уникальности ключа
            // так как у UserCardProps нет уникального id
            const uniqueKey = `${startIndex}-${idx}-${userProps.name}`;
            return (
              <UserCard
                key={uniqueKey}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...userProps}
                onDetailsClick={() => {
                  // TODO: implement details navigation
                }}
                onLikeClick={() => {
                  // TODO: implement like functionality
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

CardsBlock.defaultProps = {
  startIndex: 0,
  showButton: true,
};

export default CardsBlock;
