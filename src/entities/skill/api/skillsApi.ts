import type { Skill, SkillsResponse } from '@shared/types';
import memoizeRequest from '@shared/lib/api/memoizeRequest';

const fetchSkillsInternal = async (): Promise<Skill[]> => {
  const response = await fetch('/db/skills.json');
  if (!response.ok) throw new Error('Failed to fetch skills');
  const data: SkillsResponse = await response.json();
  return data.skills;
};

const skillsApi = {
  getSkills: memoizeRequest(fetchSkillsInternal),

  getSkillById: async (id: number): Promise<Skill | null> => {
    const skills = await skillsApi.getSkills();
    return skills.find((s: Skill) => s.id === id) || null;
  },
};

export default skillsApi;
