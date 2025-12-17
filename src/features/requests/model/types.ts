import type { Request } from '@shared/types';

/** Данные для создания новой заявки (без id и createdAt) */
export interface CreateRequestPayload {
  requestedSkill: number;
  fromUser: number;
  toUser: number;
  status?: Request['status'];
}

/** Данные для принятия заявки */
export interface AcceptRequestPayload {
  requestId: number;
  givenSkillId: number; // навык того, кто принимает (отдает взамен)
  receivedSkillId: number; // навык отправителя заявки
}
