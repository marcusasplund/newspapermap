/* global requestAnimationFrame */
import { onMount, onCleanup, createEffect, createSignal } from 'solid-js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import { setupPermalink, getMapLocation } from '../utils'
import { languages } from '../config/languages'

const markers = L.markerClusterGroup({
  maxClusterRadius: 40
})

const translateLink = (record, language) => `
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://translate.google.com/translate?hl=${language}&sl=auto&tl=${language}&u=${record.u}">
    <h5>${languages[language]?.label || language}</h5>
  </a>
`

const translateCheck = (record, language) => {
  if (!record.l || record.l === language) return ''
  return translateLink(record, language)
}

const popupContent = (record, language) => `<div>
  <a target="_blank" rel="noopener noreferrer" href="${record.u}">
    <h3>${record.n}</h3>
  </a>
  ${translateCheck(record, language)}
  <small>(${record.l})</small>
</div>`

function clearAndRenderMarkers (mapInstance, records, language) {
  markers.clearLayers()
  if (!mapInstance || !records?.length) return

  records.forEach((record) => {
    if (!record) return
    const lat = record.lat
    const lng = record.lng

    if (isNaN(lat) || isNaN(lng) || !lat || !lng) {
      console.log('error in lat or lng:', record)
      return
    }

    const mapIcon = L.divIcon({
      iconSize: [20, 20],
      html: "<div class='map-icon'></div>",
      iconAnchor: [10, 10],
      popupAnchor: [0, 0],
      className: 'dummy'
    })

    const marker = L.marker([lat, lng], { icon: mapIcon, data: record })
    marker.bindPopup(popupContent(record, language))
    markers.addLayer(marker)
  })

  if (!mapInstance.hasLayer(markers)) {
    mapInstance.addLayer(markers)
  }
}

export default function MapView (props) {
  const [mapInstance, setMapInstance] = createSignal(null)

  onMount(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById('map')
      if (!el) return

      const m = L.map(el)
      el.leafletMap = m

      const link = getMapLocation()
      m.setView(link.center, link.zoom)
      setupPermalink(m)

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(m)

      // Signalen triggar createEffect nedan
      setMapInstance(m)
    })
  })

  // Reagerar på map-ready, records ELLER language-ändringar
  createEffect(() => {
    const m = mapInstance()
    if (!m) return
    const recs = props.records?.() ?? []
    const lang = props.language?.() ?? 'en'
    clearAndRenderMarkers(m, recs, lang)
  })

  onCleanup(() => {
    const m = mapInstance()
    if (m) {
      m.off()
      m.remove()
    }
  })

  return <div id='map' />
}
