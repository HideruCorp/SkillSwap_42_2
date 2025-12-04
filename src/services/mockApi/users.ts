export default async function getUsersMock() {
  const res = await fetch('/db/users.json');
  if (!res.ok) {
    throw new Error('Ошибка загрузки users.json');
  }
  const data = await res.json();
  return data;
}
