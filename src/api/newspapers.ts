import { parseNewspaperRecords } from '../models/newspaper'

const API_KEY = import.meta.env.VITE_API_KEY ?? ''
const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export const apiUrl = () =>
  `${API_BASE}/records_newspapermap.php?include=lat,lng,n,u,l`

export async function fetchNewspaperRecords() {
  const headers = new Headers({ Accept: 'application/json' })
  if (API_KEY) headers.set('X-API-Key', API_KEY)

  const response = await fetch(apiUrl(), { headers })
  if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`)

  const json: unknown = await response.json()
  return parseNewspaperRecords(json)
}
