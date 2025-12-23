export type RawUser = {
  id: number | string;
  avatarUrl?: string | null;
  name?: string;
  about?: string;
  cityId?: number;
  dateOfBirth?: string;
  skillInterests?: number[];
};

export type RawSkill = {
  id: number;
  subcategoryId?: number;
  userId: number;
  title: string;
  likesReceived: number[]; // DEPRECATED: используется только для миграции в favorites
};

export type RawCity = { id: number; name: string };
export type RawCategory = { id: number; name: string; color: string };
export type RawSubcategory = { id: number; name: string; categoryId: number };
export type RawCategoriesJson = {
  categories: RawCategory[];
  subcategories: RawSubcategory[];
};
