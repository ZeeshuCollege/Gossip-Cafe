# CodeSupa

Gossip Café & Restro frontend.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

- `VITE_SUPABASE_URL`: your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: your Supabase publishable/anon key

## Supabase Google login

1. In Supabase, open **Authentication → Providers → Google** and enable Google.
2. Add the Google OAuth client ID and secret from Google Cloud.
3. Add your local and production app URLs to **Authentication → URL Configuration**.
4. Use `/` as the redirect URL; the app passes the current origin automatically.

The active login and signup screens use Supabase Auth. Never expose a Supabase service-role key in frontend environment variables.
