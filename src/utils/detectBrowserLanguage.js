export const detectBrowserLanguage = (supportedLanguages) => {
  const browserLang = navigator.language || navigator.userLanguage

  if (!browserLang) return 'en'

  // t.ex. "sv-SE" → "sv"
  const shortCode = browserLang.split('-')[0]

  const match = supportedLanguages.find(l => l.code === shortCode)

  return match ? shortCode : 'en'
}