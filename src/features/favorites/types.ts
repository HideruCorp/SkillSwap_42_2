// ⚠️ Этот файл больше не используется!
// Логика избранного перенесена в skillsSlice (likesReceived).
// Лайки теперь хранятся в массиве likesReceived у каждого Skill.
// Используйте типы из @entities/skill/model/types.ts

export interface Favorite {
  id: number;
  userId: number;
  targetUserId: number;
  createdAt: string;
}