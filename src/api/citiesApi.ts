import type { City, CitiesResponse } from '@shared/types';

/**
 * Загружает все города из JSON файла
 * @returns Promise с массивом городов
 */
export const fetchCities = async (): Promise<City[]> => {
  try {
    const response = await fetch('/db/city.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
    }

    const data: CitiesResponse = await response.json();
    return data.cities;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading cities: ${error.message}`);
    }
    throw new Error('Unknown error occurred while loading cities');
  }
};

