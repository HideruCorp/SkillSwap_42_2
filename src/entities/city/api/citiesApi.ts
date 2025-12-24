import type { CitiesResponse, City } from '@shared/types'
import memoizeRequest from '@shared/lib/api/memoizeRequest'

async function fetchCitiesInternal(): Promise<City[]> {
  const response = await fetch('/db/city.json')
  if (!response.ok)
    throw new Error('Failed to fetch cities')
  const data: CitiesResponse = await response.json()
  return data.cities
}

const cityApi = {
  getCities: memoizeRequest(fetchCitiesInternal),
}

export default cityApi
