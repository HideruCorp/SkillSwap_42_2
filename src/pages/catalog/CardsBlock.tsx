import { useEffect, useState, type JSX } from 'react';
import UserCard from '@shared/ui/user-card/UserCard';
import type { UserCardProps } from '@shared/ui/user-card/types';
import type { SkillTag } from '@shared/ui/skill-tag-list/type';
import Button from '@shared/ui/button/Button';
import usersApi from '@entities/user/api/usersApi';
import skillsApi from '@entities/skill/api/skillsApi';
import cityApi from '@entities/city/api/citiesApi';
import categoryApi from '@entities/category/api/categoriesApi';
import { useFavorites } from '@features/favorites/hooks/useFavorites';
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
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [rawUsers, rawSkills, rawCities, categoriesData] = await Promise.all([
          usersApi.getUsers(),
          skillsApi.getSkills(),
          cityApi.getCities(),
          categoryApi.getAll(),
        ]);

        const categories = categoriesData?.categories || [];
        const subcategories = categoriesData?.subcategories || [];

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
            id,
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

  const handleLikeClick = (userId: number) => {
    toggleFavorite(userId);
  };

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
            type="tertiary"
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
            const uniqueKey = `${startIndex}-${idx}-${userProps.name}`;
            const isLiked = isFavorite(userProps.id);

            return (
              <UserCard
                key={uniqueKey}
                {...userProps}
                onDetailsClick={() => {
                  // TODO: implement details navigation
                }}
                onLikeClick={handleLikeClick}
                isLiked={isLiked}
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