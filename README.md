# Tailgate Tribe

Gameday fellowship site for Seminole fans — family-friendly tailgate at every FSU home football game, east of Lot 8.

Live on Grok: [tailgatetribe.grok.me](https://tailgatetribe.grok.me)

## Stack

- React 19 + TypeScript
- TanStack Start / Router
- Tailwind v4
- Better Auth (Google + X)
- Postgres (Neon in production, PGLite in local preview)

## Scripts

```bash
npm install
npm run dev      # local preview
npm run build    # production build + migrations
```

Set `DATABASE_URL` on Vercel so RSVPs, shoutouts, and the studio persist.

## Pages

- `/` home
- `/schedule` 2026 slate
- `/schedule/:eventId` game + RSVP
- `/location` find the tent
- `/tribe` RSVP board + shoutouts
- `/faq`
- `/studio` editors-only photo and copy booth
