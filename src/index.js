/* global google, RSSParser */
import { h, app } from 'hyperapp'
import { languages } from './constants/languages'
import { translationKeys } from './constants/translationkeys'
import * as places from 'places.js'
import { GoogleCharts } from 'google-charts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import TinyGesture from 'tinygesture'
import { getStateFromStorage, storeStateInStorage } from './utils/local-storage'
import 'milligram/dist/milligram.css'
import './styles/app.scss'

dayjs.extend(relativeTime)

GoogleCharts.load('current', {
  packages: ['corechart']
})

let autocomplete

let map

let layer

let gesture

const tableId = `1j9UyXqpptoye5aBkQP7l5vMNql83kPrImLMhGgo`

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

let parser = new RSSParser({
  headers: {
    'X-requested-with': 'something different'
  }
})

// let updateLink = `https://docs.google.com/forms/d/e/1FAIpQLSeF1qlsi5u187HW0TfvtKD6mbwCs50SYVAfDFA3TYnoB40xnA/viewform?formkey=dF9Rd2lBMDI1RjdLODVaeWh5UXBMZVE6MQ`

const formatDate = (d) => {
  if (!d) {
    return ''
  }
  d = d.replace(/\./g, '-') // sometimes we have strange dot separators
  d = new Date(d)
  if (d !== 'Invalid Date') {
    return dayjs(d).fromNow()
  }
  return ''
}

const state = getStateFromStorage() || {
  suggestions: [],
  position: {
    lat: 37,
    lng: -5.6
  },
  zoom: 4,
  paper: '',
  url: '',
  city: '',
  country: '',
  rss: '',
  language: '',
  isClosed: true,
  posts: []
}

const actions = {
  set: x => x,

  initSwipeSupport: (el) => (state, actions) => {
    gesture = new TinyGesture(el)
    gesture.on('swipeleft swipedown', event => {
      actions.set({
        isClosed: true
      })
    })
  },

  storeState: () => (state, actions) => {
    storeStateInStorage(state)
  },

  updateHash: () => (state, actions) => {
    let a = map.getCenter().lat().toPrecision(7)
    let b = map.getCenter().lng().toPrecision(7)
    let c = map.getZoom()
    window.location.hash = '@' + a + ',' + b + ',' + c + 'z'
  },

  getData: (a) => (state, actions) => {
    let fname = a.getDataTable().getValue(0, 0)
    let lat = a.getDataTable().getValue(0, 1)
    let lng = a.getDataTable().getValue(0, 2)
    map.setZoom(19)
    map.setCenter(new google.maps.LatLng(lat, lng))
    layer.setMap(null)
    actions.newLayer('Lat', "Name CONTAINS '" + fname + "'")
    actions.updateHash()
  },

  changeData: (a) => (state, actions) => {
    let q = encodeURIComponent('SELECT Name, Lat, Long FROM ' + tableId + " WHERE Name CONTAINS IGNORING CASE '" + a + "'")
    new google.visualization.Query('https://www.google.com/fusiontables/gvizdata?tq=' + q).send(actions.getData)
  },

  newLayer: (query) => (state, actions) => {
    if (layer) {
      layer.setMap(null)
    }
    layer = new google.maps.FusionTablesLayer({
      suppressInfoWindows: true,
      query: {
        select: 'Lat',
        from: tableId,
        where: query
      },
      options: {
        styleId: 2,
        templateId: 3
      },
      map: map
    })
    google.maps.event.addListener(layer, 'click', (e) => {
      console.log(e.row)
      actions.set({
        paper: e.row['namn'].value,
        url: e.row['description'].value,
        city: e.row['city'].value,
        country: e.row['country'].value,
        rss: e.row['rss'].value,
        language: e.row['language'].value,
        isClosed: false,
        posts: []
      })
      if (e.row['rss'].value) {
        parser.parseURL(CORS_PROXY + e.row['rss'].value, (err, feed) => {
          if (err) {
            console.error(err)
          } else {
            console.log(feed)
            if (feed.items) {
              actions.set({
                posts: feed.items
              })
            } else {
              actions.set({
                posts: []
              })
            }
          }
        })
      } else {
        actions.set({
          posts: []
        })
      }
    })
  },

  autoComplete: (value) => (state, actions) => {
    if (value.length < 3) {
      actions.set({
        suggestions: []
      })
      return
    }
    console.log(value)
    value = value.charAt(0).toUpperCase() + value.slice(1)
    // Retrieve the unique store names using GROUP BY workaround.
    let queryText = encodeURIComponent(
      "SELECT 'Name' " +
        'FROM ' + tableId + " WHERE 'namn' CONTAINS IGNORING CASE '" + value + "'")
    let query = new GoogleCharts.api.visualization.Query(
      'https://www.google.com/fusiontables/gvizdata?tq=' + queryText)
    console.log(query)
    query.send((response) => {
      let numRows = response.getDataTable().getNumberOfRows()

      // Create the list of results for display of autocomplete.
      let results = []
      for (let i = 0; i < numRows; i++) {
        results.push(response.getDataTable().getValue(i, 0))
      }
      actions.set({
        suggestions: results
      })
    })
  },

  goto: (url) => (state, actions) => {
    Object.assign(document.createElement('a'), { target: '_blank', href: url }).click()
  },

  renderMap: (el) => (state, actions) => {
    let url = window.location.hash
    let params
    let position = state.position
    let zoom = state.zoom
    console.log('jhsjhjhs')
    if (url !== '') {
      // Handle old type of url:s
      if (url.indexOf('slong') !== -1) {
        params = url.split('&')
        position = {
          lat: +params[0].split('=')[1],
          lng: +params[1].split('=')[1]
        }
        zoom = parseInt(params[2].split('=')[1], 10)
      } else {
        params = url.split('@')[1].split(',')
        position = {
          lat: +params[0],
          lng: +params[1]
        }
        zoom = +params[2].replace('z', '')
      }
    }
    map = new google.maps.Map(el, {
      center: new google.maps.LatLng(position.lat, position.lng),
      zoom: zoom
    })
    let style = [{
      featureType: 'water',
      stylers: [
        {
          hue: '#ECE8E3'
        }, {
          saturation: -100
        }, {
          lightness: 100
        }
      ]
    }, {
      featureType: 'landscape',
      stylers: [
        {
          hue: '#000'
        }, {
          saturation: -80
        }, {
          lightness: -15
        }
      ]
    }, {
      featureType: 'administrative',
      stylers: [
        {
          visibility: 'on'
        }
      ]
    }, {
      featureType: 'administrative.country',
      stylers: [
        {
          visibility: 'on'
        }, {
          lightness: 50
        }
      ]
    }, {
      featureType: 'poi',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }, {
      featureType: 'road',
      stylers: [
        {
          visibility: 'on'
        }, {
          lightness: 40
        }
      ]
    }, {
      featureType: 'transit',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }, {
      featureType: 'landscape.natural',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }, {
      featureType: 'landscape.man_made',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }
    ]
    let styledMapType = new google.maps.StyledMapType(style, {
      map: map,
      name: 'Styled Map'
    })
    map.mapTypes.set('map-style', styledMapType)
    map.setMapTypeId('map-style')
    actions.newLayer('')
    map.addListener('center_changed', () => {
      let center = map.getCenter()
      let zoom = map.getZoom()
      actions.set({
        position: {
          lat: center.lat(),
          lng: center.lng()
        },
        zoom: zoom
      })
      actions.updateHash()
    })
    map.addListener('zoom_changed', () => {
      let center = map.getCenter()
      let zoom = map.getZoom()
      actions.set({
        position: {
          lat: center.lat(),
          lng: center.lng()
        },
        zoom: zoom
      })
      actions.updateHash()
    })
  },

  resetAndRefresh: () => (state, actions) => {
    window.localStorage.removeItem('newspapermap')
    actions.goto('/')
  },

  changeLangKey: (value) => (state, actions) => {
    console.log(state.url)
    let url = `https://translate.google.com/translate?hl=${value}&sl=auto&tl=${value}&u=${state.url}`
    actions.goto(url)
  },

  attachSearch: (el) => (state, actions) => {
    autocomplete = places.default({
      container: el,
      type: 'city'
      // countries: ['se', 'fi', 'no', 'dk', 'is']
    })
    autocomplete.on('change', (e) => {
      console.log(e.suggestion)
      actions.set({
        place: e.suggestion.name,
        position: e.suggestion.latlng
      })
      map.panTo(new google.maps.LatLng(e.suggestion.latlng))
      map.setZoom(13)
    })
  },

  changeLanguage: (lang) => (state, actions) => {
    let query = `language CONTAINS '${lang}'`
    actions.newLayer(query)
  },

  getLocation: () => (state, actions) => {
    actions.set({
      fetchingLocation: true,
      isSearchView: false
    })
    navigator.geolocation.getCurrentPosition(actions.successLocation, actions.errorLocation, {
      timeout: 4000,
      enableHighAccuracy: true
    })
  }
}

const SetActive = (obj) => {
  if (obj.active) {
    obj.el.classList.add('is-closed')
  } else {
    obj.el.classList.remove('is-closed')
  }
}

const dangerouslySetInnerHTML = (el, res) => {
  el.innerHTML = res
}

const view = (state, actions) =>
  h('div', { onupdate: e => actions.storeState() }, [
    h('header', {}, [
      h('div', {
        class: 'row'
      }, [
        h('div', {
          class: 'column'
        }, [
          h('h1', {
            class: 'title',
            onclick: e => actions.resetAndRefresh()
          }, 'Newspaper Map')
        ]),
        h('div', {
          class: 'column hidden-mobile'
        }, [
          h('select', {
            onchange: ({ target }) => actions.changeLanguage(target.value)
          }, [
            h('option', {
              value: ''
            }, 'Filter language'),
            languages.map(l => h('option', { value: l }, l))
          ])
        ]),
        h('div', {
          class: 'column hidden-mobile'
        }, [
          h('input', {
            type: 'text',
            placeholder: 'Paper',
            list: 'suggestions',
            oninput: ({ target }) => actions.autoComplete(target.value),
            onchange: ({ target }) => actions.changeData(target.value) }, [
            h('datalist', {
              id: 'suggestions'
            }, [
              state.suggestions.map(s => h('option', { value: s }, s))
            ])
          ])
        ]),
        h('div', {
          class: 'column hidden-mobile'
        }, [
          h('input', {
            type: 'text',
            placeholder: 'Place',
            oncreate: el => actions.attachSearch(el)
          })
        ])
      ])
    ]),
    h('div', {
      id: 'map',
      oncreate: (el) => actions.renderMap(el)
    }),
    h('div', {
      id: 'sidebar',
      class: 'is-closed',
      onupdate: (el) => SetActive({ el: el, active: state.isClosed }),
      oncreate: el => actions.initSwipeSupport(el)
    }, [
      h('div', { class: 'sidebar-header' }, [
        h('button', {
          class: 'close',
          onclick: e => actions.set({ isClosed: true })
        }, `x`),
        h('p', {}, [
          h('a', {
            class: 'sidebar-title',
            href: state.url
          }, state.paper),
          h('br', {}),
          h('span', {}, `${state.city} ${state.country}`)
        ])
      ]),
      h('label', {}, [
        `Translate ${state.paper} from ${state.language}`,
        h('select', {
          onchange: ({ target }) => actions.changeLangKey(target.value)
        }, [
          translationKeys.map(s => h('option', { title: s.title, value: s.short }, s.lang))
        ])
      ]),
      h('div', {
        class: 'post-container'
      }, [
        state.posts.map(p => h('div', { class: 'rss-item', onclick: e => actions.goto(p.link) }, [
          h('p', {
            class: 'rss-title'
          }, p.title),
          h('div', {
            class: 'rss-description',
            oncreate: el => dangerouslySetInnerHTML(el, p.contentSnippet || p.description || p.content || ''),
            onupdate: el => dangerouslySetInnerHTML(el, p.contentSnippet || p.description || p.content || '')
          }),
          h('p', {
            class: 'rss-date'
          }, formatDate(p.pubDate || p.date || ''))
        ]))
      ])
    ])
  ])
app(state, actions, view, document.body)
