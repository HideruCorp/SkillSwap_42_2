import type { Skill, SkillsResponse } from '@shared/types';

/**
 * Загружает все навыки из JSON файла
 * @returns Promise с массивом навыков
 */
export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const response = await fetch('/db/skills.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.status} ${response.statusText}`);
    }

    const data: SkillsResponse = await response.json();
    return data.skills;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading skills: ${error.message}`);
    }
    throw new Error('Unknown error occurred while loading skills');
  }
};

