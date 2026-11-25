# Newspaper discovery review

The existing map, marker clustering, translation links, language flags, and permalinks work and have desktop/mobile regression coverage. Preserve them.

## Problems to resolve

- No searchable newspaper index: the visitor must already know where to look on the map.
- Translation preferences are hidden behind a menu. The label does not distinguish source language from translation language.
- No way to filter the map by source language or see a result count.
- Refresh errors only reach the console. Initial loading and empty results lack useful feedback.
- Markers and popups are disconnected from a navigable result list.
- Bright magenta markers and low-information cluster labels visually dominate the understated shell.
- Dense result sets require efficient filtering and bounded rendering so search does not freeze the map.

## Implementation requirements

- Match newspaper names and site hostnames locally, with accent-insensitive search; do not fabricate location metadata absent from the API.
- Let the user filter the source language independently of translation language. Show counts and a clear-all action.
- Fit explicit search results to the map on request; preserve normal panning, zoom, and permalinks.
- Synchronize result selection and map popup, including zooming through a cluster.
- Preserve newspaper URLs and translation links. Use actual data for all counts and result labels.
- Provide a compact, accessible desktop panel and an intentional mobile composition; keep map attribution unobstructed.
- Show loading, retryable errors, no matches, and successful refresh. Avoid replacing an existing dataset on fetch failure.
- Build within the existing Solid 2, TypeScript 7, UI SDK, and Leaflet stack without adding runtime dependencies for the redesign.

## Visual decision candidates

1. Atlas index: reference atlases; airy floating index, petrol text, teal selection.
2. Reading room: library wayfinding; cool quiet surfaces, measured type, organized index.
3. World desk: international travel graphics; navy, white, red selection, compact labels.
4. Newsstand guide: public retail wayfinding; clear neutral shelf, restrained blue, strong source titles.
5. Civic directory: public information systems; light neutral panels, deep blue controls, consistent separators.
6. Public service atlas: international broadcast/public information graphics; mineral discovery panel, deep petrol masthead, teal linked selection.
7. Geographic field guide: educational publishing; generous pale-blue ground, navy reading text, small green source marks.

The skill's direction seed e6a51423 assigned candidate 6. The owner chooses the direction on the local comparison page. The ticket-wallet challenger remains a full alternate; the remaining challengers were declined for conflicts with task clarity or audience, with their useful disciplines retained in the proposed direction.
