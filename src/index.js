/* global requestAnimationFrame */
import { h, app, text } from 'hyperapp'
import { Http } from 'hyperapp-fx'
import L from 'leaflet'
import {
  setupPermalink,
  getMapLocation,
  getStateFromStorage,
  storeStateInStorage
} from './utils'
import { MDCTopAppBar } from '@material/top-app-bar'
import { MDCDrawer } from '@material/drawer'
import * as places from 'places.js'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import '@material/top-app-bar/dist/mdc.top-app-bar.min.css'
import '@material/icon-button/dist/mdc.icon-button.min.css'
import '@material/drawer/dist/mdc.drawer.min.css'
import '@material/list/dist/mdc.list.min.css'
import './styles/app.scss'

let map

let drawer

const markers = L.markerClusterGroup({
  maxClusterRadius: 40 // default 80
})

const dict = {
  en: 'English',
  fr: 'Français, French',
  de: 'Deutsch, German',
  sv: 'Svenska, Swedish',
  es: 'Espanol, Spanish'
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

const translateCheck = (record, language) => {
  const languages = dict[language].split(',')
  const lang = languages[1] || languages[0]
  if (record.l.includes(lang)) {
    return ''
  } else {
    return translateLink(record, language)
  }
}
// Create popupcontent for marker
const Content = (record, language) => `<div>
<a
  target="_blank"
  rel="noopener noreferrer"
  href='${record.u}'>
    <h3>
      ${record.n}
    </h3>
</a>
${
  translateCheck(record, language)
}
<small>(${record.l})</small>
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
          marker.bindPopup(Content(record, language))
          // add marker to cluster
          markers.addLayer(marker)
        }
      }
    })
    // add cluster on map
    map.addLayer(markers)
  }
}

const setInitialMapView = (state) => {
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
      setInitialMapView()
      initMdc()
      initSearch()
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)
      dispatch(getRecords)
    })
  }

  return {
    stop: props => [stop, props],
    start: props => [start, props]
  }
})(L)

const initialState = getStateFromStorage() || {
  records: [],
  language: 'en',
  fetched: false
}

const initSearch = () => {
  places({
    appId: 'plJK3ZF3CP3E',
    apiKey: '564b7e9c5e43f60bd01c42949b1f7913',
    container: document.querySelector('#search')
  }).configure({
    hitsPerPage: 10,
    aroundLatLng: ''
  }).on('change', (e) => {
    const center = [
      e.suggestion.latlng.lat,
      e.suggestion.latlng.lng
    ]
    map.setView(center, 8)
    drawer.open = false
  })
}

const initMdc = () => {
  drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'))
  const topAppBar = MDCTopAppBar.attachTo(document.querySelector('.mdc-top-app-bar'))
  topAppBar.setScrollTarget(document.querySelector('.main-content'))
  topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open
  })
}

const changeLanguage = (state, e) => {
  const language = e.target.value
  drawer.open = false
  createMarkers(state.records, language)
  const newState = { ...state, ...{ records: state.records, language: language } }
  storeStateInStorage(newState)
  return newState
}

const addNewRecords = (state, response) => {
  const result = ensureArray(response.records)
  createMarkers(result, state.language)
  const newState = { ...state, ...{ records: result, fetched: true } }
  storeStateInStorage(newState)
  return newState
}

const addRecords = state => {
  createMarkers(state.records, state.language)
  return state
}

const fetchNewRecords = state => [
  state,
  Http({
    url: apiUrl(state),
    response: 'json',
    action: addNewRecords
  })
]

const apiUrl = (state) => {
  return 'https://pap.as/api/index.php/records/newspapermap?include=lat,lng,n,u,l'
}

const getRecords = state =>
  state.fetched
    ? addRecords
    : fetchNewRecords

const View = state => (
  h('div', {}, [
    h('header', {
      class: 'mdc-top-app-bar'
    }, [
      h('div', {
        class: 'mdc-top-app-bar__row'
      }, [
        h('section', {
          class: 'mdc-top-app-bar__section mdc-top-app-bar__section--align-start'
        }, [
          h('button', {
            class: 'material-icons mdc-top-app-bar__navigation-icon mdc-icon-button'
          },
          text('menu')
          ),
          h('span', {
            class: 'mdc-top-app-bar__title'
          },
          text('Newspaper Map')
          )
        ]),
        h('section', {
          class: 'mdc-top-app-bar__section mdc-top-app-bar__section--align-end'
        }, [
          h('button', {
            class: 'material-icons mdc-top-app-bar__navigation-icon mdc-icon-button',
            title: 'Refresh markers',
            onclick: fetchNewRecords
          },
          text('refresh')
          )
        ])
      ])
    ]),
    h('div', {
      class: 'app-drawer-layout mdc-top-app-bar--fixed-adjust'
    }, [
      h('aside', {
        style: { zIndex: 99999 },
        class: 'mdc-drawer mdc-drawer--dismissible mdc-top-app-bar--fixed-adjust'
      }, [
        h('div', {
          class: 'mdc-drawer__content'
        }, [
          h('nav', {
            class: 'mdc-list'
          }, [
            h('div', {
              class: 'list-item'
            }, [
              h('label', {
                for: 'language-list'
              },
              text('Translation setting')
              ),
              h('select', {
                onchange: changeLanguage,
                placeholder: 'Your language'
              },
              Object.keys(dict)
                .map(key => h('option', {
                  key: key,
                  value: key
                }, text(dict[key])))
              )
            ]),
            h('div', {
              class: 'list-item'
            }, [
              h('label', {
                for: 'language-list'
              },
              text('Search place')
              ),
              h('input', {
                id: 'search',
                type: 'text',
                placeholder: 'Find a place'
              })
            ])
          ])
        ])
      ]),
      h('main', {
        class: 'mdc-drawer-app-content main-content'
      }, [
        h('div', {
          id: 'map'
        })
      ])
    ])
  ])
)

const initMap = state => [
  state,
  Leaflet.start()
]

app({
  init: initMap(initialState),
  view: View,
  node: document.querySelector('#app')
})
