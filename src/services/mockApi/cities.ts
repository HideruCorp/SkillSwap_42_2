export default async function getCitiesMock() {
  const res = await fetch('/db/cities.json');
  if (!res.ok) {
    throw new Error('Ошибка загрузки cities.json');
  }
  const data = await res.json();
  return data;
}
