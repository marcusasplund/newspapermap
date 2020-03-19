/* global requestAnimationFrame */
/** @jsx h */
import { h, app } from 'hyperapp'
import { Http } from 'hyperapp-fx'
import L from 'leaflet'
import { setupPermalink, getMapLocation } from './utils'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'milligram/dist/milligram.css'
import './styles/app.scss'

let map

const markers = L.markerClusterGroup({
  maxClusterRadius: 40 // default 80
})

const dict = {
  en: 'English',
  fr: 'Francais'
}

const translateLink = (record, language) => {
  return `<a
    target="_blank"
    rel="noopener noreferrer"
    href="https://translate.google.com/translate?hl=${language}&sl=auto&tl=${language}&u=${record.u}">
    <h5>
      ${dict[language]}
    </h5>
  </a>`
}
// Create popupcontent for marker
const content = (record, language) => `<div>
<a href='${record.u}'><h3>${record.n}</h3></a>
${
  language !== record.l
  ? translateLink(record, language)
  : ''
}
<small>( ${record.l} )</small>
</div>`

const ensureArray = (records) => Array.isArray(records) ? records : [records]

const createMarkers = (records, language) => {
  // remove old markers
  markers.clearLayers()
  // check if we have any records
  if (!records) {
    return false
  }
  // loop through array of records and create a marker for each point
  if (records.length > 0) {
    records.map(record => {
      if (record) {
        const lat = record.lat
        const lng = record.lng
        // här kollar jag om lat, lng är ok o loggar ev. felaktiga rader så att de kan korrigeras i databasen sen
        if (isNaN(lat) || isNaN(lng) || !lat || !lng) {
          console.log('error in lat or lng:', record)
        } else {
          const iconSize = [20, 20]
          const html = "<div class='map-icon'></div>"
          const iconAnchor = [10, 10]
          const popupAnchor = [0, 0]
          const mapIcon = L.divIcon({
            iconSize: iconSize,
            html: html,
            iconAnchor: iconAnchor,
            popupAnchor: popupAnchor,
            className: 'dummy' // hack to remove default square css
          })

          // Create marker for point
          const marker = L.marker([
            lat, lng
          ], { icon: mapIcon, data: record })
          // bind content to marker
          marker.bindPopup(content(record, language))
          // add marker to cluster
          markers.addLayer(marker)
        }
      }
    })
    // add cluster on map
    map.addLayer(markers)
  }
}

const SetInitialMapView = (state) => {
  const link = getMapLocation()
  map.setView(link.center, link.zoom)
  setupPermalink(map)
}

const Leaflet = (L => {
  const stop = (dispatch) => {
    const leafletMap = document.getElementById('map').leafletMap
    if (leafletMap) {
      leafletMap.off()
      leafletMap.remove()
    }
  }

  const start = (dispatch) => {
    requestAnimationFrame(() => {
      const element = document.getElementById('map')
      map = (element.leafletMap = L.map(element))
      SetInitialMapView()
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)
      dispatch(GetRecords)
    })
  }

  return {
    stop: props => [stop, props],
    start: props => [start, props]
  }
})(L)

const InitialState = {
  records: [],
  language: 'en'
}

// const ChangeLanguage = (state, e) => {
//   const language = e.target.value
//   createMarkers(state.records, language)
//   return { ...state, ...{ language: language } }
// }

const AddRecords = (state, response) => {
  const result = ensureArray(response.records)
  createMarkers(result, state.language)
  return { ...state, ...{ records: result } }
}

const ApiUrl = (state) => {
  return 'https://pap.as/api/index.php/records/newspapermap?include=lat,lng,n,u,l'
}

const GetRecords = state => [
  state,
  Http({
    url: ApiUrl(state),
    response: 'json',
    action: AddRecords
  })
]

// <select
// onChange={ChangeLanguage}
// >
// <option value='en'>English</option>
// <option value='fr'>French</option>
// </select>
// view
const View = state => (
  <main>
    <div id='map' />
  </main>
)

const InitMap = state => [
  state,
  Leaflet.start()
]

app({
  init: InitMap(InitialState),
  view: View,
  node: document.querySelector('#app')
})
