import { isSupportedLanguage } from '../config/languages'
import { parseNewspaperRecords, type NewspaperRecord } from '../models/newspaper'

export interface StoredState {
  records: NewspaperRecord[]
  language: string
  fetched: boolean
}

const getStateFromStorage = (): StoredState | null => {
  try {
    const raw = window.localStorage.getItem('newspapermap')
    if (!raw) return null
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) return null
    if (!('language' in value) || !isSupportedLanguage(value.language)) return null
    if (!('records' in value) || !Array.isArray(value.records)) return null
    if (!('fetched' in value) || typeof value.fetched !== 'boolean') return null
    return {
      language: value.language,
      records: parseNewspaperRecords(value.records),
      fetched: value.fetched
    }
  } catch {
    return null
  }
}

const storeStateInStorage = (state: StoredState): boolean => {
  try {
    window.localStorage.setItem('newspapermap', JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export { getStateFromStorage, storeStateInStorage }
