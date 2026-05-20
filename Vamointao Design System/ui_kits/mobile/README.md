# Vamointao · Mobile UI kit

Seven interactive screens in iOS frames, side-by-side in a horizontal rail. Tap any CTA on a phone to scroll the rail to the next screen — the whole flow is wired up.

## Flow

1. **Onboarding** — welcome card, "let's find a time" headline
2. **Home** — list of upcoming events, filter chips, FAB-style "+ New"
3. **Create event** — title, key person, window, duration
4. **Invite people** — chip-based selected list, search, suggested list
5. **Availability picker** — cycle yes/maybe/no per day on a calendar
6. **AI result** — the hero spark-yellow card with reasoning + alternatives
7. **Confirmed** — locked-in event detail with attendees

## Files

- `index.html` — entry point. Renders all seven screens.
- `ios-frame.jsx` — iOS device frame starter.
- `components.jsx` — shared UI: buttons (primary, secondary, AI, ghost), avatars, app header, bottom nav, sparkle.
- `screens-a.jsx` — Onboarding, Home, Create.
- `screens-b.jsx` — Invite, Availability, Result, Confirmed.

## Adding a screen

1. Write the screen as a function in either `screens-a.jsx` or `screens-b.jsx`. Use `VMT.*` color tokens and the shared button / avatar components.
2. Expose it via `Object.assign(window, { ... })` at the bottom of the file.
3. Append to the `SCREENS` array in `index.html` and wire its `onBack` / `onNext` to call `focusOn(idx)`.
