import { languages } from '../config/languages'
import type { NewspaperRecord } from './newspaper'

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

const knownLanguageCodes = new Map<string, string>()
for (const language of languages) {
  knownLanguageCodes.set(language.code.toLowerCase(), language.code.toLowerCase())
  knownLanguageCodes.set(language.label.toLowerCase(), language.code.toLowerCase())
  knownLanguageCodes.set((languageNames.of(language.code) ?? language.code).toLowerCase(), language.code.toLowerCase())
}

function languageCodes(value: string): string[] {
  const codes = value.split(/[,;/|]+/).map(part => part.trim().toLowerCase()).filter(Boolean)
  return Array.from(new Set(codes.map(code => knownLanguageCodes.get(code) ?? code)))
}

export function sourceLanguageCodes(record: NewspaperRecord): string[] {
  const codes = languageCodes(record.l)
  return codes.length ? codes : ['und']
}

export function languageLabel(value: string): string {
  const codes = languageCodes(value)
  if (!codes.length) return 'Language not listed'
  return codes.map(code => {
    try { return languageNames.of(code) ?? code } catch {
      return code.replace(/\b[a-z]/g, letter => letter.toUpperCase())
    }
  }).join(', ')
}

export const languageFlag = (code: string) =>
  languages.find(language => language.code.toLowerCase() === code.toLowerCase())?.flag ?? ''

export function newspaperUrl(record: NewspaperRecord): string | null {
  try {
    const value = record.u.trim()
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch { return null }
}

export function newspaperHostname(record: NewspaperRecord): string {
  const url = newspaperUrl(record)
  return url ? new URL(url).hostname.replace(/^www\./, '') : 'Website unavailable'
}

export function translationUrl(record: NewspaperRecord, targetLanguage: string): string | null {
  const url = newspaperUrl(record)
  if (!url) return null
  const target = new URL('https://translate.google.com/translate')
  target.search = new URLSearchParams({ hl: targetLanguage, sl: 'auto', tl: targetLanguage, u: url }).toString()
  return target.href
}

export const newspaperKey = (record: NewspaperRecord) =>
  JSON.stringify([record.u, record.n, record.lat, record.lng])

export const searchText = (value: string) =>
  value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase().trim()
