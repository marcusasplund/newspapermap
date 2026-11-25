import { createEffect, createSignal, onSettled } from 'solid-js'
import { DivIcon, LatLngBounds, LeafletMap, Marker, TileLayer } from 'leaflet'
import { MarkerClusterGroup } from 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { getMapLocation, setupPermalink } from '../utils/permalink'
import { languageLabel, newspaperHostname, newspaperKey, newspaperUrl, sourceLanguageCodes, translationUrl } from '../models/discovery'
import { languages } from '../config/languages'
import type { NewspaperRecord } from '../models/newspaper'

export type MapAction =
  | { kind: 'zoom'; delta: number }
  | { kind: 'world' }
  | { kind: 'locate' }
  | { kind: 'fit'; records: readonly NewspaperRecord[] }

interface MapViewProps {
  records: readonly NewspaperRecord[]
  language: string
  selected: NewspaperRecord | null
  focus: { record: NewspaperRecord } | null
  action: MapAction | null
  onSelect: (record: NewspaperRecord) => void
  onViewChange: (bounds: LatLngBounds) => void
  onReady: () => void
  onLocation: (state: 'idle' | 'loading' | 'error') => void
}

interface MapElement extends HTMLElement { leafletMap?: LeafletMap }

function link(label: string, href: string, className: string): HTMLAnchorElement {
  const element = document.createElement('a')
  element.textContent = label
  element.href = href
  element.target = '_blank'
  element.rel = 'noopener noreferrer'
  element.className = className
  return element
}

function popupContent(record: NewspaperRecord, language: string): HTMLElement {
  const content = document.createElement('article')
  content.className = 'newspaper-popup'
  const meta = document.createElement('p')
  meta.className = 'popup-language'
  meta.textContent = languageLabel(record.l)
  const title = document.createElement('h3')
  title.textContent = record.n
  const host = document.createElement('p')
  host.className = 'popup-domain'
  host.textContent = newspaperHostname(record)
  const actions = document.createElement('div')
  actions.className = 'popup-actions'
  const url = newspaperUrl(record)
  if (url) actions.append(link('Open newspaper', url, 'popup-primary'))
  const translation = translationUrl(record, language)
  if (translation && !sourceLanguageCodes(record).includes(language.toLowerCase())) {
    const label = languages.find(option => option.code === language)?.label ?? language
    actions.append(link(`Translate to ${label}`, translation, 'popup-translate'))
  }
  content.append(meta, title, host, actions)
  return content
}

const mapIcon = () => new DivIcon({
  iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -10],
  html: '<span class="map-icon"></span>', className: 'newspaper-marker'
})

export default function MapView(props: MapViewProps) {
  const [mapInstance, setMapInstance] = createSignal<LeafletMap | null>(null)
  const clusters = new MarkerClusterGroup({
    maxClusterRadius: 48,
    clusterLabel: cluster => `${cluster.getChildCount()} newspapers`
  })
  const markerIndex = new Map<string, Marker>()
  let element: MapElement | undefined
  let selectedMarker: Marker | undefined
  let activeMap: LeafletMap | undefined
  let activeSelectedKey: string | null = null

  onSettled(() => {
    let map: LeafletMap | undefined
    const frame = requestAnimationFrame(() => {
      if (!element) return
      map = new LeafletMap(element, { zoomControl: false })
      element.leafletMap = map
      activeMap = map
      const location = getMapLocation()
      map.setView(location.center, location.zoom)
      map.on('unload', setupPermalink(map))
      new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)
      const currentMap = map
      const reportView = () => props.onViewChange(currentMap.getBounds())
      map.on('moveend', reportView)
      map.on('locationfound', () => props.onLocation('idle'))
      map.on('locationerror', () => props.onLocation('error'))
      reportView()
      setMapInstance(map)
      props.onReady()
    })
    return () => {
      cancelAnimationFrame(frame)
      activeMap = undefined
      map?.remove()
      clusters.clearLayers()
      markerIndex.clear()
    }
  })

  createEffect(
    () => ({ map: mapInstance(), records: props.records, language: props.language }),
    ({ map, records, language }) => {
      if (!map) return
      clusters.clearLayers()
      markerIndex.clear()
      selectedMarker = undefined
      const layers = records.map(record => {
        const marker = new Marker([record.lat, record.lng], { icon: mapIcon(), title: record.n })
        marker.bindPopup(() => popupContent(record, language), {
          maxWidth: 300,
          autoPanPaddingTopLeft: window.innerWidth > 640 ? [414, 125] : [24, 270],
          autoPanPaddingBottomRight: [72, 72],
          className: 'atlas-popup'
        })
        marker.on('popupopen', () => props.onSelect(record))
        marker.on('add', () => {
          if (newspaperKey(record) === activeSelectedKey) marker.getElement()?.classList.add('is-selected')
        })
        markerIndex.set(newspaperKey(record), marker)
        return marker
      })
      clusters.addLayers(layers)
      if (!map.hasLayer(clusters)) map.addLayer(clusters)
    }
  )

  createEffect(
    () => ({ map: mapInstance(), selected: props.selected, records: props.records, language: props.language }),
    ({ selected }) => {
      selectedMarker?.getElement()?.classList.remove('is-selected')
      selectedMarker?.setZIndexOffset(0)
      activeSelectedKey = selected ? newspaperKey(selected) : null
      selectedMarker = activeSelectedKey ? markerIndex.get(activeSelectedKey) : undefined
      selectedMarker?.getElement()?.classList.add('is-selected')
      selectedMarker?.setZIndexOffset(1000)
    }
  )

  createEffect(
    () => ({ map: mapInstance(), focus: props.focus }),
    ({ map, focus }) => {
      if (!map || !focus) return
      const marker = markerIndex.get(newspaperKey(focus.record))
      if (!marker) return
      clusters.zoomToShowLayer(marker, () => {
        if (activeMap === map && clusters.hasLayer(marker)) marker.openPopup()
      })
    }
  )

  createEffect(
    () => ({ map: mapInstance(), action: props.action }),
    ({ map, action }) => {
      if (!map || !action) return
      switch (action.kind) {
        case 'zoom': map.setZoom(map.getZoom() + action.delta); break
        case 'world': map.setView([23, 0], 2); break
        case 'locate':
          props.onLocation('loading')
          map.locate({ setView: true, maxZoom: 11, timeout: 10000 })
          break
        case 'fit':
          if (!action.records.length) break
          map.fitBounds(new LatLngBounds(action.records.map(record => [record.lat, record.lng])), {
            maxZoom: 12,
            paddingTopLeft: window.innerWidth > 640 ? [414, 130] : [24, 280],
            paddingBottomRight: [74, 68]
          })
          break
      }
    }
  )

  return <section id="map" ref={el => { element = el }} aria-label="Interactive newspaper map" />
}
