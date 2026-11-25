---
name: Newspaper Map
description: A floating atlas index for finding local newspapers.
colors:
  atlas-ink: "#1f363b"
  atlas-teal: "#13776b"
  atlas-soft: "#f1f5f3"
  atlas-muted: "#60776e"
  atlas-line: "#e2eae6"
  white: "#fff"
typography:
  title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-.015em"
  newspaper:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-.015em"
  input:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
    fontSize: "13px"
    lineHeight: 1.4
  metadata:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
    fontSize: "11px"
    lineHeight: 1.5
rounded:
  field: "7px"
  control: "8px"
  surface: "12px"
  panel: "14px"
spacing:
  compact: "8px"
  control: "12px"
  group: "16px"
  panel: "22px"
  edge: "28px"
components:
  text-button:
    backgroundColor: "transparent"
    textColor: "{colors.atlas-teal}"
    padding: "0"
  map-control:
    backgroundColor: "{colors.white}"
    textColor: "{colors.atlas-ink}"
    width: "44px"
    height: "44px"
  search-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.atlas-ink}"
    rounded: "{rounded.field}"
    height: "48px"
    padding: "0 12px"
  floating-surface:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.surface}"
  result-row:
    textColor: "{colors.atlas-ink}"
    padding: "17px 22px"
---

# Design System: Newspaper Map

## Overview

**Creative North Star: "The atlas index"**

White floating panels sit over a full-screen map. Petrol text and teal selection keep the controls legible against geographic detail. The owner chose this code-led direction for a practical newspaper discovery tool.

Compact controls use a sans-serif stack. Newspaper names use Georgia to distinguish publications from interface labels. Search results remain connected to the map through shared selection states.

**Key Characteristics:**

- White panels with soft elevation over a muted map.
- Compact controls and aligned publication rows.
- Teal emphasis shared by links, markers, and selection.

## Colors

The palette combines petrol text, teal actions, and pale green-gray support colors. The frontmatter records the reused Atlas colors from `src/styles/app.css`.

### Primary

Atlas teal identifies actions, selected result numbers, map pins, focus outlines, and the text caret. It also fills the popup's primary source link.

### Neutral

Atlas ink carries titles and primary text. Atlas muted carries metadata and supporting labels. Atlas soft separates the results heading and quiet hover areas. Atlas line divides groups within white panels.

**The Shared Selection Rule.** Result selection and its geographic marker use teal emphasis together.

## Typography

The interface uses the system sans-serif stack recorded in the frontmatter. Georgia is reserved for publication names and the existing letterform brand mark.

The panel title uses the title role. Result names use the newspaper role. Popup names enlarge the serif treatment to 23px with a 1.2 line height. Input text uses the input role, while publication metadata uses the metadata role. Compact utility labels range from 10px to 12px. Numeric counts use tabular figures.

The product name uses 20px type, weight 650, and a 1.25 line height on desktop. It decreases to 16px on mobile and 14px below the narrow-screen breakpoint. There is no promotional display heading.

## Layout

The map fills the viewport at `100dvh`. Desktop headers float 26px from the top and 28px from the sides. The discovery panel is 370px wide, starts 110px from the top, and ends 26px above the bottom. Its results scroll independently between the search controls and footer.

At 1120px, the brand description disappears. At 850px, the header drops its count and translation caption, and the panel narrows to 340px. At 640px, side margins become 12px and the panel begins 78px from the top. Mobile results start collapsed. Expansion reveals a scrollable list and footer, ends 38px above the bottom, and hides map controls while the list occupies the screen. At 360px, the brand and translation control compact further.

Map controls stay on the right edge. Settings open as a right-hand sheet whose width is the smaller of 380px and the viewport minus 20px. The recurring spacing steps in the frontmatter describe existing gaps and padding, not a compulsory grid for every measurement.

## Elevation & Depth

Soft shadows separate white tools from the map. The shared floating elevation is `0 6px 28px rgb(31 54 59 / 13%)`. Map controls use `0 3px 16px rgb(31 54 59 / 14%)`. Popups use `0 5px 24px rgb(31 54 59 / 20%)`. Quiet internal sections use fills and fine borders rather than nested shadows.

**The Floating Tools Rule.** Elevation separates tools from geography. Result rows remain flat inside their panel.

## Shapes

Rounded rectangles distinguish controls from the map. Fields use the field radius, map controls use the control radius, and headers and popups use the surface radius. The desktop discovery panel uses the larger panel radius and returns to the surface radius on mobile. Result numbers and marker clusters are circular. Map pins use a rotated teardrop shape.

## Components

### Buttons

Utility actions use teal text on transparent backgrounds. Hover darkens the text and adds an underline. Disabled text actions lose emphasis and decoration. Map controls use square white buttons, a pale green hover fill, and teal hover icons. Their size decreases to 42px on mobile. Settings refresh uses the existing outlined button treatment.

Keyboard focus uses a teal 2px outline with a 3px offset. Controls inside clipped groups move the outline inward. Short state transitions take 150ms. Reduced-motion preferences reduce animations and transitions to 0.01ms.

### Inputs and selects

Search is a bordered white field with a leading search icon. Focus changes the border to teal and adds a translucent 3px ring. Search shrinks to 43px high on mobile. Translation preference and newspaper-language filtering remain separate controls with separate labels. Select menus use the existing Solid UI keyboard and focus behavior.

### Floating containers

Header groups and the discovery panel share white backgrounds and the floating elevation. Dividers organize search scope, results, and the footer. The settings sheet uses a dimmed overlay and scrolls when its content exceeds the viewport.

### Newspaper results

Each result pairs a circular number with a serif newspaper name and sans-serif language and domain metadata. A pale green selected fill, solid teal number, and teal arrow identify the selected row. Source and translation actions appear beneath the selected publication. Long names and domains wrap within the available width.

### Markers and popups

Teal pins have white borders. Hover enlarges a pin, and selection enlarges it further. Clusters use a translucent teal outer disk and white count center. Selecting a result reveals its marker through clusters and opens a popup with source and translation actions. Attribution stays visible on the map.

## Do's and Don'ts

### Do

- Do keep the map visible around floating tools.
- Do use serif type for publication names and sans-serif type for controls.
- Do preserve visible keyboard focus and reduced-motion behavior.
- Do connect selected results and markers through teal emphasis.

### Don't

- Don't merge newspaper language filtering with translation preferences.
- Don't give result rows separate floating-card shadows.
- Don't replace source names or domains with invented geographic metadata.

Not canonized: the existing text-letter brand mark and uppercase brand description are implementation details, not reusable icon or label patterns. No defects or drift require repair in this documentation pass; the independent finish review approved shipping.
