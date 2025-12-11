import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SkillGallery } from '@/widgets/skillGallery';
import { SkillDescriptionUI } from '@shared/ui/skill-description';
import { UserSkillCard } from '@shared/ui/user-skill-card';
import type { UserSkillCardProps } from '@shared/ui/user-skill-card/types';
import type { SkillTag } from '@shared/ui/skill-tag-list/type';
import { fetchSkills } from '@api/skillsApi';
import { fetchUserById } from '@api/usersApi';
import { fetchCategories } from '@api/categoriesApi';
import getCitiesMock from '@/services/mockApi/cities';
import type { Skill, User, City } from '@shared/types';
import { calculateAge, getCategoryColorBySubcategoryId } from '@shared/helpers';
import styles from './skill-page.module.scss';
import { Skill as SkillWidget } from '@/widgets/skill';

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

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [skillsData, categoriesData, citiesData] = await Promise.all([
          fetchSkills(),
          fetchCategories(),
          getCitiesMock(),
        ]);

        if (!mounted) return;

        const currentSkill = skillsData.find((s) => s.id === Number(id));
        if (!currentSkill) {
          setError('Навык не найден');
          return;
        }

        const creator = await fetchUserById(currentSkill.userId);
        if (!creator) {
          setError('Пользователь не найден');
          return;
        }

        const { categories, subcategories } = categoriesData;
        const cities = Array.isArray(citiesData) ? citiesData : citiesData.cities;

        const userSkills = skillsData.filter((s) => s.userId === creator.id);
        const canTeach: SkillTag[] = userSkills.map((skill) => ({
          id: String(skill.id),
          text: skill.title,
          bgColor: getCategoryColorBySubcategoryId(
            skill.subcategoryId || 0,
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
  }, [id]);
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

  return (
    <>
      <UserSkillCard {...userCardData} />
      <SkillWidget
        skill={skill}
        skillDescription={skillDescription}
        isLiked={false} // TODO: интеграция с localStorage favorites
        onLike={(skillId) => {
          // TODO: добавить/удалить из favorites в localStorage
          console.log('Like skill', skillId);
        }}
        onShare={(skillId) => {
          // TODO: реализовать share через Web Share API или clipboard
          console.log('Share skill', skillId);
        }}
        onMoreDetails={(skillId) => {
          // TODO: скролл к UserCard или открыть модальное окно
          console.log('More details for skill', skillId);
        }}
      />
    </>
  );
}

export default SkillPage;
