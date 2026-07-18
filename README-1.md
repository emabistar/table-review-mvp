# Review ticket form — setup

## 1. Create the Next.js app (if you haven't already)

```bash
npx create-next-app@latest table-review-mvp --typescript --app
cd table-review-mvp
npm install @supabase/supabase-js
```

## 2. Drop these files in

- `lib/supabaseClient.ts` → into your project's `lib/` folder
- `app/r/[businessId]/page.tsx` → into your project's `app/r/[businessId]/` folder
- `.env.local.example` → copy to `.env.local` and fill in your real Supabase URL + anon key
  (Supabase dashboard → Project Settings → API)

## 3. Run it

```bash
npm run dev
```

Visit:

```
http://localhost:3000/r/<your-test-business-id>?table=12
```

Use the `id` of the test business you inserted into the `businesses` table in Step 1
(the database setup). The `?table=12` part is optional — it's what makes the "Table No. 12"
line appear, and in production each printed QR code would encode its own table number this way.

## 4. What this does right now

- Loads the business by ID from Supabase on page load.
- Lets the customer pick a star rating, name, phone, and note.
- On submit, inserts a row into `reviews`.
- If rating ≥ 4 **and** the business has a `google_place_id` saved → shows the thank-you
  screen, then redirects to the real Google review flow after ~1.8s.
- If rating ≤ 3 → shows the private "sent to the manager" screen and nothing goes to Google.

## 5. What's intentionally not built yet

- The owner-facing dashboard reading these rows (next step).
- The onboarding flow that saves `google_place_id` in the first place — until a business
  has one, low ratings still work but high ratings will silently skip the redirect
  (check the `if (routedToGoogle)` branch in `page.tsx`).
- Form validation beyond "a rating must be selected" — e.g. phone number formatting.
