import { For } from 'solid-js'
import { isSupportedLanguage, languages } from '../config/languages'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface TranslationSelectProps {
  id: string
  value: string
  onChange: (language: string) => void
}

export default function TranslationSelect(props: TranslationSelectProps) {
  return (
    <Select<string>
      value={props.value}
      onValueChange={value => { if (isSupportedLanguage(value)) props.onChange(value) }}
      itemToLabel={code => languages.find(option => option.code === code)?.label ?? code}
    >
      <SelectTrigger id={props.id} aria-label="Translation language" class="translation-select">
        <SelectValue>
          {state => (
            <>
              <span aria-hidden="true">{languages.find(option => option.code === state.value)?.flag}</span>
              <span>{state.label}</span>
            </>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="language-options">
        <For each={languages}>
          {option => (
            <SelectItem value={option.code} label={option.label}>
              {() => <><span aria-hidden="true">{option.flag}</span>{option.label}</>}
            </SelectItem>
          )}
        </For>
      </SelectContent>
    </Select>
  )
}
