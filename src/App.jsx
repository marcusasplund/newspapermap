import { createSignal, onMount } from 'solid-js'
import MapView from './components/MapView'
import { fetchNewspaperRecords } from './api/newspapers'
import { getStateFromStorage, storeStateInStorage, detectBrowserLanguage } from './utils'
import { languages } from './config/languages'

import AppBar from '@suid/material/AppBar'
import Toolbar from '@suid/material/Toolbar'
import Typography from '@suid/material/Typography'
import IconButton from '@suid/material/IconButton'
import Drawer from '@suid/material/Drawer'
import Box from '@suid/material/Box'
import FormControl from '@suid/material/FormControl'
import InputLabel from '@suid/material/InputLabel'
import Select from '@suid/material/Select'
import MenuItem from '@suid/material/MenuItem'
import Divider from '@suid/material/Divider'

import MenuIcon from '@suid/icons-material/Menu'
import RefreshIcon from '@suid/icons-material/Refresh'
import './styles/app.css'

export default function App () {
const stored = getStateFromStorage() || {}

const initialLanguage =
  stored.language ??
  detectBrowserLanguage(languages)

  const [language, setLanguage] = createSignal(initialLanguage)

  const [records, setRecords] = createSignal(stored.records ?? [])
  const [fetched, setFetched] = createSignal(stored.fetched ?? false)

  const [drawerOpen, setDrawerOpen] = createSignal(false)

  const persist = (next) => storeStateInStorage(next)

  const applyRecords = (nextRecords) => {
    setRecords(nextRecords)
    setFetched(true)

    persist({
      records: nextRecords,
      language: language(),
      fetched: true
    })
  }

  const refresh = async () => {
    try {
      const next = await fetchNewspaperRecords()
      applyRecords(next)
    } catch (e) {
      console.error(e)
    } finally {
      setDrawerOpen(false)
    }
  }

  const changeLang = (e) => {
    const next = e.target.value
    setLanguage(next)

    persist({
      records: records(),
      language: next,
      fetched: fetched()
    })

    setDrawerOpen(false)
  }

  onMount(() => {
    // samma logik som förr: om inte hämtat, hämta direkt
    if (!fetched()) void refresh()
  })

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={() => setDrawerOpen(v => !v)}>
            <MenuIcon />
          </IconButton>

          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            Newspaper Map
          </Typography>

          <IconButton color='inherit' title='Refresh markers' onClick={refresh}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen()} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 320, p: 2 }}>
          <Typography variant='subtitle1' sx={{ mb: 2 }}>
            Settings
          </Typography>

          <FormControl fullWidth>
            <InputLabel id='lang-label'>Translation setting</InputLabel>
            <Select
              labelId='lang-label'
              label='Translation setting'
              value={language()}
              onChange={changeLang}
            >
              {Object.keys(languages).map(k => (
                <MenuItem value={k}>
                  {languages[k].flag} {languages[k].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <MapView records={records} language={language} onSearchPicked={() => setDrawerOpen(false)} />
      </Box>
    </Box>
  )
}
