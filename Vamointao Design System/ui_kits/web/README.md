# Vamointao · Web app UI kit

Two-view desktop app with sidebar nav. The sidebar's "Calendar" item swaps the main content from the Dashboard to the Calendar view.

## Files

- `index.html` — entry, wires Sidebar + TopBar + view switch
- `components.jsx` — Sidebar, TopBar, Avatar / AvatarStack, Logomark, Sparkle, sample data
- `views.jsx` — DashboardView (AI hero card, stat row, pending list, upcoming, activity feed) and CalendarView (full month grid with event chips, AI-pick highlight, today marker)

## Try

Open `index.html`. Click **Calendar** in the sidebar to switch views. The "Calendar" segmented control in the top bar is wired but display-only (Day/Week/Month don't change the grid yet).

## Notes

- The Dashboard's hero is the AI suggestion card in spark yellow with the stamp shadow — same visual DNA as the mobile result screen.
- Calendar event chips carry a thin left-color bar (group color) and a slightly inset background. AI-suggested days use the spark fill + the stamp border.
- The today indicator is a vermillion-filled circle on the date digit.
