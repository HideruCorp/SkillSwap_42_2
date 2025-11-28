## Как поднять проект

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск dev-сервера

```bash
npm run dev
```

## Соглашение по неймингу

  | Тип | Стиль | Примеры |
  |-----|-------|---------|
  | **React компоненты** | `PascalCase` | `Button.tsx`, `UserProfile.tsx`, `SkillCard.tsx` |
  | **CSS файлы** | `kebab-case` | `button.css`, `user-profile.module.css` |
  | **Хуки** | `camelCase` | `useAuth.ts`, `useSkills.ts` |
  | **Утилиты/Хелперы** | `camelCase` | `formatDate.ts`, `apiClient.ts` |
  | **Типы/Интерфейсы** | `PascalCase` | `types.ts` (файл), `interface UserData`
  (внутри) |
  | **Константы** | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_ITEMS` |
  | **Директории (слайсы)** | `kebab-case` | `user-profile/`, `skill-management/` |        
  | **Storybook stories** | `PascalCase.stories` | `Button.stories.ts` |
