import type { LatLngExpression, LeafletMap } from 'leaflet'

interface HistoryState {
  center: { lat: number; lng: number }
  zoom: number
}

function isHistoryState(value: unknown): value is HistoryState {
  if (typeof value !== 'object' || value === null || !('center' in value) || !('zoom' in value)) return false
  const center = value.center
  return typeof value.zoom === 'number' && Number.isFinite(value.zoom) &&
    typeof center === 'object' && center !== null && 'lat' in center && 'lng' in center &&
    typeof center.lat === 'number' && Number.isFinite(center.lat) &&
    typeof center.lng === 'number' && Number.isFinite(center.lng)
}

const getMapLocation = (zoom = 5, center: LatLngExpression = [63, 17]) => {
  const [latitude, longitude, level] = window.location.hash.slice(1).split(',')
  if (latitude !== undefined && longitude !== undefined && level !== undefined) {
    const lat = Number(latitude)
    const lng = Number(longitude)
    const parsedZoom = Number.parseInt(level.replace(/z$/, ''), 10)
    if (Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(parsedZoom)) {
      center = { lat, lng }
      zoom = parsedZoom
    }
  }
  return { zoom, center }
}

const setupPermalink = (map: LeafletMap) => {
  let shouldUpdate = true
  const updatePermalink = () => {
    if (!shouldUpdate) {
      shouldUpdate = true
      return
    }
    const center = map.getCenter()
    const hash = '#' +
      Math.round(center.lat * 100000) / 100000 + ',' +
      Math.round(center.lng * 100000) / 100000 + ',' +
      map.getZoom() + 'z'
    const state: HistoryState = { zoom: map.getZoom(), center }
    window.history.pushState(state, 'map', hash)
  }

  map.on('moveend', updatePermalink)

  const restoreView = (event: PopStateEvent) => {
    const state: unknown = event.state
    if (!isHistoryState(state)) return
    map.setView(state.center, state.zoom)
    shouldUpdate = false
  }
  window.addEventListener('popstate', restoreView)

  return () => {
    map.off('moveend', updatePermalink)
    window.removeEventListener('popstate', restoreView)
  }
}

export { getMapLocation, setupPermalink }
