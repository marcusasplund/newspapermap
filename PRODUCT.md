# Newspaper Map

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Everyday readers discovering local news around the world, confirmed by the owner.

## Product Purpose

Find newspaper websites geographically and open them directly or through translation.
Success means finding a relevant newspaper quickly while retaining geographic context.

## Capabilities and Constraints

- Preserve the Leaflet map, clustering, marker popups, newspaper links, translation, and map permalinks.
- Prioritize newspaper search, source-language filters, and clearer map controls, confirmed by the owner.
- Keep the interface a useful tool. Visual refinement must not obstruct browsing or make working flows less reliable.
- Use the existing SolidJS 2, TypeScript 7, solid-ui-next, Leaflet 2 beta, and MarkerCluster 2 stack.
- The API supplies newspaper names, coordinates, URLs, and language codes; it does not supply verified cities or countries.
- Support desktop and mobile web without assuming access to location.

## Brand Commitments

Keep the Newspaper Map name. The owner requested a full design overhaul while retaining the product's practical purpose.

## Evidence on Hand

The production API and existing application are functional. The last checked API response contained 10,814 records;
coordinate validation accepted 10,810. Counts are live data, not marketing claims.

## Product Principles

- Keep the map central and useful immediately.
- Make searching and filtering predictable and reversible.
- Distinguish a newspaper's language from the reader's translation language.
- Show loading, errors, and empty results clearly.
- Preserve source links, attribution, and keyboard operation.
