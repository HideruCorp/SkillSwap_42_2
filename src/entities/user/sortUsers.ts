import type { User } from '@shared/types';

export function sortUsersBy(users: User[], mode: 'likes' | 'created'): User[] {
  if (mode === 'likes') {
    return [...users].sort((a, b) => ((b as any).likes ?? 0) - ((a as any).likes ?? 0));
  }
  // 'created' -> registrationDate
  return [...users].sort(
    (a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
  );
}
