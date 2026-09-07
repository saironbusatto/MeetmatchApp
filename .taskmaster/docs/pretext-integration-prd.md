# Pretext Integration for Farmei

## Overview
Integrate @chenglou/pretext into the Farmei web app to enable performant text measurement without DOM reflow. This improves virtualization, layout stability, and responsive text handling across event-related UI components.

## Scope
- apps/web (Next.js 15 + React 19)
- @chenglou/pretext already installed in apps/web

## Tasks

### 1. Create usePretext React Hook
Create a reusable React hook that wraps pretext's prepare() and layout() functions.
- Must memoize prepare() results (only re-run when text or font changes)
- Must re-run layout() on resize (width changes)
- Must sync font and lineHeight with CSS variables from the design system
- Should handle empty strings gracefully
- Should expose height, lineCount, and optionally lines for manual layout

### 2. Event List Virtualization
Implement virtualized scrolling for the public event list using pretext for height measurement.
- Measure event card heights before rendering (title + description + metadata)
- Use intersection observer or virtual scroll library (e.g., @tanstack/react-virtual)
- Must handle dynamic content (different description lengths)
- Should prevent layout shift on initial load

### 3. Event Description "Ver Mais" Toggle
Use pretext to determine if an event description exceeds 3 lines before rendering.
- Measure description text height at container width
- If height > 3 lines, show "ver mais" button without rendering full text first
- Toggle between truncated and full view
- Should work with responsive widths

### 4. Masonry Event Grid
Implement a masonry-style grid layout for event cards using pretext for height calculation.
- Calculate card heights based on text content before DOM insertion
- Position cards in a masonry layout (CSS or JS-driven)
- Must handle variable card heights (title, description, image presence)
- Should be responsive (recalculate on resize)

### 5. Invite Card Name Truncation
Use pretext to measure how many invitee names fit in a single line for invite preview cards.
- Measure individual name widths
- Calculate how many fit: "João, Maria, Pedro +5"
- Show overflow count for remaining names
- Must handle variable name lengths and font sizes
