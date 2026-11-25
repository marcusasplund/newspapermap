export interface NewspaperRecord {
  lat: number
  lng: number
  n: string
  u: string
  l: string
}

function coordinate(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null
  if (typeof value === 'string' && value.trim() === '') return null
  const result = Number(value)
  return Number.isFinite(result) ? result : null
}

export function parseNewspaperRecord(value: unknown): NewspaperRecord | null {
  if (typeof value !== 'object' || value === null) return null
  if (!('lat' in value) || !('lng' in value) || !('n' in value) || !('u' in value)) return null
  if (typeof value.n !== 'string' || typeof value.u !== 'string') return null

  const lat = coordinate(value.lat)
  const lng = coordinate(value.lng)
  if (lat === null || lng === null || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null

  return {
    lat,
    lng,
    n: value.n,
    u: value.u,
    l: 'l' in value && typeof value.l === 'string' ? value.l : ''
  }
}

export function parseNewspaperRecords(payload: unknown): NewspaperRecord[] {
  const data = typeof payload === 'object' && payload !== null && 'data' in payload
    ? payload.data
    : payload
  const items: unknown[] = Array.isArray(data) ? data : [data]
  return items.flatMap(item => {
    const record = parseNewspaperRecord(item)
    return record ? [record] : []
  })
}
