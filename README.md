# Nemat & Bakhtiyar — wedding invitation

A one-page, scroll-driven invitation for the wedding of Dr. Nemat Aafreen and
Er. Bakhtiyar Alam. Kishan Palace, Patna, 24 October 2026.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

`?skipIntro=1` opens the page past the curtain — handy while working on the
later acts, and for anyone re-opening the link.

## How it is put together

The page is three acts plus the invitation proper:

| Act | File | What happens |
| --- | --- | --- |
| 0 | `components/CurtainGate.tsx` | Velvet panels over a foil seal. Tapping the seal parts them — and is the user gesture browsers require before audio may play. |
| I | `components/Overture.tsx` | The camera looks through an iwan onto a palace skyline. Scroll dollies the arch forward and drifts the skyline behind it. |
| II | `components/Journey.tsx` | She walks the colonnade, he comes the other way, they meet under the centre arch. Both are seen only from behind. |
| — | `components/InviteBody.tsx` | Countdown, programme, venue, RSVP, closing dua. |

### The art is generated, not drawn

`lib/mughal.ts` produces every architectural shape from geometry rather than
hand-authored path data: two-centred cusped arches, onion domes, finials,
merlon cresting, jaali lattices, and a seeded skyline layout. That is why the
domes and arches stay proportional at any size, and why there are no image
assets to load.

The only motion in the figures is cloth — a dupatta and a shawl driven by a
sine loop in `components/art/Figures.tsx`. It reads as alive at silhouette
scale where a walk cycle would read as broken.

### Countdown

`components/Countdown.tsx` has three states and moves between them on its own:

- **before** — counts down to the nikah;
- **during the four days** — counts down to the *next* rasm and says the
  celebrations have begun;
- **after** — replaces itself with "They were married on 24 October 2026" and
  the years since. Nothing has to be edited on the day.

### RSVP

The guest fills in our own form; `app/api/rsvp/route.ts` relays it to a Google
Form server-side, so the form URL and its entry ids never reach the browser.
Copy `.env.example` to `.env.local` and fill in the ids — the file explains
where to find them. Without them the endpoint returns a polite "not connected
yet" message rather than failing silently.

### Audio

Drop a loopable instrumental at `public/audio/ambience.mp3` (see the README in
that folder). It fades in when the curtain opens and the visitor keeps control
of it. If the file is absent the music button removes itself.

## Content

All names, dates, addresses and phone numbers live in `lib/invite.ts`. Nothing
is hard-coded into a component.
