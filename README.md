# RinseUp

RinseUp is a Next.js laundry service application backed by Supabase.

## Supabase setup

Create `.env.local` with:

```text
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser-safe Supabase
values required by the client SDK. Keep `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`GOOGLE_CLIENT_SECRET`, and all Razorpay secrets server-only. The Google client ID is
configuration rather than a secret, but it should still be kept in `.env.local` and
never hard-coded in source.

Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor.

To enable Google sign-in:

1. Enable Google under **Authentication → Providers** in the Supabase dashboard.
2. Enter the Google OAuth client ID and client secret from Google Cloud Console in
   the provider settings. If you keep a local copy, use the variables in
   `.env.local`; the application delegates the OAuth exchange to Supabase and
   does not expose `GOOGLE_CLIENT_SECRET` to the browser.
3. Add `http://localhost:3000/auth/callback` to **Authentication → URL Configuration → Redirect URLs**.
4. Add the production callback URL using the same `/auth/callback` path.

The OAuth callback exchanges Supabase's PKCE authorization code before redirecting
the user to the requested page.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
