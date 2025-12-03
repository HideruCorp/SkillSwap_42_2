export default async function getCitiesMock() {
  const res = await fetch('/db/city.json');
  if (!res.ok) {
    throw new Error('Ошибка загрузки city.json');
  }
  const data = await res.json();
  return data;
}
