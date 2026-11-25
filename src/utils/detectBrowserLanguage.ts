import type { Language } from '../config/languages'

export const detectBrowserLanguage = (supportedLanguages: readonly Pick<Language, 'code'>[]): string => {
  const browserLang = navigator.language
  if (!browserLang) return 'en'

  const exact = supportedLanguages.find(language => language.code.toLowerCase() === browserLang.toLowerCase())
  if (exact) return exact.code

  const shortCode = browserLang.split('-')[0]
  return supportedLanguages.find(language => language.code === shortCode)?.code ?? 'en'
}
