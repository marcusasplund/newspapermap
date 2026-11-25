// Inline SVG icons from Lucide (https://lucide.dev), ISC License. See ./LICENSE.
import type { ComponentProps } from '@solidjs/web'

const Icon = (props: ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    {...props}
  />
)

export const Menu = () => (
  <Icon>
    <path d="M4 5h16M4 12h16M4 19h16" />
  </Icon>
)

export const RefreshCw = () => (
  <Icon>
    <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.36 6.36L3 16M8 16H3v5" />
  </Icon>
)

export const Search = () => <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
export const Close = () => <Icon><path d="m6 6 12 12M18 6 6 18" /></Icon>
export const Plus = () => <Icon><path d="M12 5v14M5 12h14" /></Icon>
export const Minus = () => <Icon><path d="M5 12h14" /></Icon>
export const Globe = () => <Icon><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a19 19 0 0 1 0 18 19 19 0 0 1 0-18" /></Icon>
export const Locate = () => <Icon><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></Icon>
export const Settings = () => <Icon><path d="M4 7h16M4 17h16" /><circle cx="8" cy="7" r="3" fill="currentColor" stroke="none" /><circle cx="16" cy="17" r="3" fill="currentColor" stroke="none" /></Icon>
export const ArrowUpRight = () => <Icon><path d="M7 17 17 7M7 7h10v10" /></Icon>
export const ChevronDown = () => <Icon><path d="m6 9 6 6 6-6" /></Icon>
export const List = () => <Icon><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></Icon>
export const FitMap = () => <Icon><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5" /><circle cx="12" cy="12" r="3" /></Icon>
