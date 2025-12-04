export default async function getCategoriesMock() {
  const res = await fetch('/db/category.json');
  if (!res.ok) {
    throw new Error('Ошибка загрузки категорий');
  }
  const data = await res.json();
  return data;
}
