# Gossip Cafe

Gossip Cafe is a local React and Vite website for the cafe in Mumbra, Thane.

## Run locally

```bash
npm install
npm run server
npm run dev
```

Run the API and Vite in separate terminals. The API creates `data/gossip-cafe.sqlite`
automatically and stores local accounts, sessions, and reservations there.

Google sign-in is optional. To enable it, set `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`, enable Google in the Supabase
dashboard, and add `http://localhost:5173/login` as a redirect URL.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
