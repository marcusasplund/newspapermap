import { createEffect, createMemo, createSignal, For, onSettled, Show } from 'solid-js'
import type { LatLngBounds } from 'leaflet'
import MapView, { type MapAction } from './components/MapView'
import TranslationSelect from './components/TranslationSelect'
import { Button } from './components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet'
import { ArrowUpRight, ChevronDown, Close, FitMap, Globe, List, Locate, Minus, Plus, RefreshCw, Search, Settings } from './components/ui/icons'
import { fetchNewspaperRecords } from './api/newspapers'
import { getStateFromStorage, storeStateInStorage, detectBrowserLanguage } from './utils'
import { languages } from './config/languages'
import { languageFlag, languageLabel, newspaperHostname, newspaperKey, newspaperUrl, searchText, sourceLanguageCodes, translationUrl } from './models/discovery'
import type { NewspaperRecord } from './models/newspaper'
import './styles/app.css'

type DirectoryState = { kind: 'idle' } | { kind: 'loading' } | { kind: 'ready' } | { kind: 'error' }

const number = new Intl.NumberFormat('en')

export default function App() {
  const stored = getStateFromStorage()
  const [language, setLanguage] = createSignal(stored?.language ?? detectBrowserLanguage(languages))
  const [records, setRecords] = createSignal(stored?.records ?? [])
  const [fetched, setFetched] = createSignal(stored?.fetched ?? false)
  const [directory, setDirectory] = createSignal<DirectoryState>({ kind: 'idle' })
  const [settingsOpen, setSettingsOpen] = createSignal(false)
  const [query, setQuery] = createSignal('')
  const [appliedQuery, setAppliedQuery] = createSignal('')
  const [sourceLanguage, setSourceLanguage] = createSignal('all')
  const [scope, setScope] = createSignal<'view' | 'world'>('view')
  const [bounds, setBounds] = createSignal<LatLngBounds | null>(null)
  const [selection, setSelection] = createSignal<NewspaperRecord | null>(null)
  const [focus, setFocus] = createSignal<{ record: NewspaperRecord } | null>(null)
  const [mapAction, setMapAction] = createSignal<MapAction | null>(null)
  const [mapReady, setMapReady] = createSignal(false)
  const [expanded, setExpanded] = createSignal(false)
  const [limit, setLimit] = createSignal(40)
  const [location, setLocation] = createSignal<'idle' | 'loading' | 'error'>('idle')
  const [storageUnavailable, setStorageUnavailable] = createSignal(false)
  let searchInput: HTMLInputElement | undefined
  let queryTimer: ReturnType<typeof setTimeout> | undefined

  const loading = () => directory().kind === 'loading'
  const translationLabel = () => languages.find(option => option.code === language())?.label ?? language()
  const indexed = createMemo(() => records().map(record => ({
    record,
    text: searchText(`${record.n} ${newspaperHostname(record)}`),
    sourceCodes: sourceLanguageCodes(record)
  })).sort((a, b) => a.record.n.localeCompare(b.record.n, 'en', { sensitivity: 'base' })))

  const sourceLanguages = createMemo(() => {
    const counts = new Map<string, number>()
    for (const item of indexed()) {
      for (const code of item.sourceCodes) counts.set(code, (counts.get(code) ?? 0) + 1)
    }
    return Array.from(counts, ([code, count]) => ({ code, count, label: languageLabel(code) }))
      .sort((a, b) => a.label.localeCompare(b.label))
  })

  const filtered = createMemo(() => {
    const text = searchText(appliedQuery())
    const source = sourceLanguage()
    return indexed().filter(item =>
      (source === 'all' || item.sourceCodes.includes(source)) && (!text || item.text.includes(text))
    ).map(item => item.record)
  })

  const selected = createMemo(() => {
    const requested = selection()
    return requested ? filtered().find(record => newspaperKey(record) === newspaperKey(requested)) ?? null : null
  })

  const inView = createMemo(() => {
    const view = bounds()
    return view ? filtered().filter(record => view.contains([record.lat, record.lng])) : filtered()
  })
  const results = createMemo(() => scope() === 'view' ? inView() : filtered())
  const displayed = createMemo(() => {
    const items = results().slice(0, limit())
    const chosen = selected()
    if (chosen && results().some(record => newspaperKey(record) === newspaperKey(chosen)) &&
      !items.some(record => newspaperKey(record) === newspaperKey(chosen))) {
      return [chosen, ...items.slice(0, limit() - 1)]
    }
    return items
  })
  const hasFilters = () => Boolean(query().trim()) || sourceLanguage() !== 'all'
  const selectedKey = () => { const record = selected(); return record ? newspaperKey(record) : null }

  const persist = (nextRecords: NewspaperRecord[], nextLanguage: string, hasFetched: boolean) => {
    if (!storeStateInStorage({ records: nextRecords, language: nextLanguage, fetched: hasFetched })) {
      setStorageUnavailable(true)
    }
  }

  const refresh = async () => {
    if (loading()) return
    setDirectory({ kind: 'loading' })
    try {
      const next = await fetchNewspaperRecords()
      setRecords(next)
      setFetched(true)
      persist(next, language(), true)
      setDirectory({ kind: 'ready' })
    } catch {
      setDirectory({ kind: 'error' })
    }
  }

  const changeLanguage = (code: string) => {
    setLanguage(code)
    persist(records(), code, fetched())
  }

  const updateQuery = (value: string) => {
    setQuery(value)
    clearTimeout(queryTimer)
    queryTimer = setTimeout(() => {
      setAppliedQuery(value)
      setScope(value.trim() ? 'world' : 'view')
    }, 180)
  }

  const clearFilters = () => {
    clearTimeout(queryTimer)
    setQuery('')
    setAppliedQuery('')
    setSourceLanguage('all')
    setScope('view')
  }

  const chooseRecord = (record: NewspaperRecord) => {
    setSelection(record)
    setFocus({ record })
    setExpanded(false)
  }

  const submitSearch = (event: SubmitEvent) => {
    event.preventDefault()
    clearTimeout(queryTimer)
    setAppliedQuery(query())
    setScope('world')
    setExpanded(true)
  }

  createEffect(() => filtered(), () => { setLimit(40) })


  onSettled(() => {
    if (!fetched()) void refresh()
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput?.focus()
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => {
      window.removeEventListener('keydown', shortcut)
      clearTimeout(queryTimer)
    }
  })

  return (
    <Sheet open={settingsOpen()} onOpenChange={setSettingsOpen}>
      <div class="atlas-app">
        <a class="skip-link" href="#newspaper-search">Skip to newspaper search</a>
        <main class="map-workspace" aria-label="Newspaper map">
          <MapView
            records={filtered()} language={language()} selected={selected()} focus={focus()} action={mapAction()}
            onSelect={setSelection} onViewChange={setBounds} onReady={() => setMapReady(true)} onLocation={setLocation}
          />
        </main>

        <header class="app-header">
          <div class="brand-surface">
            <span class="brand-mark" aria-hidden="true">n</span>
            <h1>Newspaper Map</h1>
            <span class="brand-description">The world’s local news</span>
          </div>
          <div class="header-tools">
            <span class="directory-count"><span class="status-dot" />{fetched() ? `${number.format(records().length)} newspapers` : 'Loading directory…'}</span>
            <div class="translation-control">
              <span class="translation-caption">Translate websites to</span>
              <TranslationSelect id="header-translation" value={language()} onChange={changeLanguage} />
            </div>
            <SheetTrigger aria-label="Open settings" render={part => <Button {...part} variant="ghost" size="icon" class="icon-button" />}>
              <Settings />
            </SheetTrigger>
          </div>
        </header>

        <section class={`discovery-panel${expanded() ? ' is-expanded' : ''}`} aria-label="Find newspapers">
          <div class="discovery-search">
            <div class="panel-heading"><h2>Find a newspaper</h2><span class="desktop-only"><Globe /></span></div>
            <search><form onSubmit={submitSearch}>
              <div class="search-field">
                <Search />
                <input id="newspaper-search" ref={el => { searchInput = el }} type="search"
                  aria-label="Search newspapers" placeholder="Search by name or website"
                  autocomplete="off" spellcheck={false} value={query()}
                  onInput={event => updateQuery(event.currentTarget.value)}
                  onKeyDown={event => { if (event.key === 'Escape') updateQuery('') }} />
                <Show when={query()} fallback={<kbd class="desktop-only">⌘ K</kbd>}>
                  <button type="button" class="clear-search" aria-label="Clear search" onClick={() => { updateQuery(''); searchInput?.focus() }}><Close /></button>
                </Show>
              </div>
            </form></search>
            <div class="source-filter">
              <label id="source-language-label" for="newspaper-language">Newspaper language</label>
              <Select<string> value={sourceLanguage()} onValueChange={value => { if (typeof value === 'string') setSourceLanguage(value) }}
                itemToLabel={code => code === 'all' ? 'All languages' : languageLabel(code)}>
                <SelectTrigger id="newspaper-language" aria-labelledby="source-language-label" class="source-select"><SelectValue /></SelectTrigger>
                <SelectContent class="language-options">
                  <SelectItem value="all" label="All languages">All languages</SelectItem>
                  <For each={sourceLanguages()} keyed={false}>{option => (
                    <SelectItem value={option().code} label={option().label}>
                      {() => <><span aria-hidden="true">{languageFlag(option().code)}</span>{option().label}<span class="option-count">{number.format(option().count)}</span></>}
                    </SelectItem>
                  )}</For>
                </SelectContent>
              </Select>
            </div>
            <div class="search-scope">
              <span>{scope() === 'view' ? 'Exploring this map area' : `${number.format(filtered().length)} matches worldwide`}</span>
              <button type="button" class="text-button" onClick={() => setScope(scope() === 'view' ? 'world' : 'view')}>
                {scope() === 'view' ? 'Search worldwide' : 'Search this area'}<ArrowUpRight />
              </button>
            </div>
          </div>

            <Show when={directory().kind === 'error'}>
              <div class="directory-error" role="alert"><strong>Couldn’t load the latest newspapers.</strong><p>{records().length ? 'Your saved directory is still available.' : 'Check your connection and try again.'}</p><button type="button" class="text-button" onClick={refresh}>Try again<RefreshCw /></button></div>
            </Show>

          <div class="results-heading">
            <button type="button" class="mobile-results-toggle" aria-expanded={expanded() ? 'true' : 'false'} aria-controls="newspaper-results" onClick={() => setExpanded(value => !value)}>
              <List /><span>{loading() && !fetched() ? 'Loading newspapers…' : `${number.format(results().length)} newspapers ${scope() === 'view' ? 'on the map' : 'found'}`}</span><ChevronDown />
            </button>
            <span class="desktop-results-title">{scope() === 'view' ? 'Newspapers on the map' : 'Search results'}</span>
            <span class="desktop-results-count" aria-live="polite">{number.format(results().length)} {scope() === 'view' ? 'in view' : 'found'}</span>
          </div>

          <div id="newspaper-results" class="results-body">
            <Show when={loading() && !records().length}>
              <div class="loading-directory" role="status"><p>Loading the newspaper directory…</p><div class="skeleton-row" /><div class="skeleton-row" /><div class="skeleton-row" /></div>
            </Show>
            <Show when={!loading() || records().length > 0}>
              <Show when={results().length > 0} fallback={
                <div class="empty-results"><Search /><h3>{hasFilters() ? 'No newspapers match' : 'No newspapers in this view'}</h3><p>{hasFilters() ? 'Try a different name or newspaper language.' : 'Move the map or look through the worldwide directory.'}</p><button type="button" class="text-button" onClick={() => { if (hasFilters()) clearFilters(); else setScope('world') }}>{hasFilters() ? 'Clear filters' : 'Browse worldwide'}<ArrowUpRight /></button></div>
              }>
                <ul class="newspaper-list" aria-label="Newspaper results">
                  <For each={displayed()} keyed={false}>{(record, index) => (
                    <li class={`newspaper-result${selectedKey() === newspaperKey(record()) ? ' is-selected' : ''}`}>
                      <button type="button" class="result-main" aria-label={`Show ${record().n} on map`} aria-pressed={selectedKey() === newspaperKey(record()) ? 'true' : 'false'} onClick={() => chooseRecord(record())}>
                        <span class="result-number" aria-hidden="true">{index + 1}</span>
                        <span class="result-information"><span class="newspaper-name">{record().n}</span><span class="newspaper-meta">{languageLabel(record().l)}<span aria-hidden="true"> · </span>{newspaperHostname(record())}</span></span>
                        <span class="result-arrow"><ArrowUpRight /></span>
                      </button>
                      <Show when={selectedKey() === newspaperKey(record())}>
                        <div class="result-actions">
                          <Show when={newspaperUrl(record())}>{url => <a href={url()} target="_blank" rel="noopener noreferrer">Open newspaper<ArrowUpRight /></a>}</Show>
                          <Show when={translationUrl(record(), language())}>{url => <a href={url()} target="_blank" rel="noopener noreferrer">Translate to {translationLabel()}</a>}</Show>
                        </div>
                      </Show>
                    </li>
                  )}</For>
                </ul>
                <Show when={results().length > displayed().length}>
                  <button type="button" class="load-more" onClick={() => setLimit(value => value + 40)}>Show more newspapers<span>{number.format(displayed().length)} of {number.format(results().length)}</span></button>
                </Show>
              </Show>
            </Show>
          </div>

          <div class="panel-footer">
            <span>{loading() ? 'Updating directory…' : 'Select a newspaper to see it on the map.'}</span>
            <div class="panel-footer-actions">
              <button type="button" class="text-button" disabled={!filtered().length || !mapReady()} onClick={() => { setMapAction({ kind: 'fit', records: filtered() }); setExpanded(false) }}><FitMap />Show results on map</button>
              <Show when={hasFilters()}><button type="button" class="text-button reset-filters" onClick={clearFilters}>Clear filters</button></Show>
            </div>
          </div>
        </section>

        <fieldset class="map-controls" aria-label="Map controls">
          <div class="map-control-group">
            <Button variant="ghost" size="icon" aria-label="Zoom in" title="Zoom in" disabled={!mapReady()} onClick={() => setMapAction({ kind: 'zoom', delta: 1 })}><Plus /></Button>
            <Button variant="ghost" size="icon" aria-label="Zoom out" title="Zoom out" disabled={!mapReady()} onClick={() => setMapAction({ kind: 'zoom', delta: -1 })}><Minus /></Button>
          </div>
          <Button variant="ghost" size="icon" class="map-control-single" aria-label="Find my location" title="Find my location" disabled={!mapReady() || location() === 'loading'} onClick={() => setMapAction({ kind: 'locate' })}><Locate /></Button>
          <Button variant="ghost" size="icon" class="map-control-single" aria-label="Show world map" title="Show world map" disabled={!mapReady()} onClick={() => setMapAction({ kind: 'world' })}><Globe /></Button>
        </fieldset>

        <Show when={location() === 'error'} fallback={<span class="map-hint">Move the map to discover more newspapers</span>}>
          <div class="map-message" role="alert">Couldn’t find your location. You can still explore the map.<button type="button" aria-label="Dismiss location message" onClick={() => setLocation('idle')}><Close /></button></div>
        </Show>

        <SheetContent side="right" class="settings-sheet">
          <SheetHeader><SheetTitle>Map preferences</SheetTitle><SheetDescription>Read local news in a language that works for you.</SheetDescription></SheetHeader>
          <div class="settings-section"><h3>Translation language</h3><p>Newspaper websites can open through Google Translate. This does not filter the newspapers on the map.</p><TranslationSelect id="settings-translation" value={language()} onChange={changeLanguage} /></div>
          <div class="settings-section"><h3>Newspaper directory</h3><p>{number.format(records().length)} newspapers are available. Refresh to get the latest directory.</p><Button variant="outline" disabled={loading()} aria-label="Refresh markers" aria-busy={loading() ? 'true' : 'false'} onClick={refresh}><RefreshCw />{loading() ? 'Refreshing…' : 'Refresh newspapers'}</Button><Show when={directory().kind === 'ready'}><p class="refresh-success" role="status">The newspaper directory is up to date.</p></Show><Show when={storageUnavailable()}><p>Your browser couldn’t save this directory. You can keep using the map.</p></Show></div>
          <div class="settings-about"><span class="brand-mark" aria-hidden="true">n</span><p>Local newspapers.<br />A wider view of the world.</p></div>
        </SheetContent>
      </div>
    </Sheet>
  )
}
