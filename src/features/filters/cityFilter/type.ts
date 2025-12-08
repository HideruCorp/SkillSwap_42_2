export interface ICity {
  id: number;
  name: string;
}

export interface CityFilterProps {
  selectedCities: string[];
  onSelectionChange: (cities: string[]) => void;
}
