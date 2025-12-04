export default async function getSkillsMock() {
  const res = await fetch('/db/skills.json');
  if (!res.ok) {
    throw new Error('Ошибка загрузки skills.json');
  }
  const data = await res.json();
  return data;
}
