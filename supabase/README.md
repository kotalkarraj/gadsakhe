# Setting up the Gadsakhe backend (Supabase)

The website reads stories from a Supabase database and authors manage them at
**`/admin`**. Until it's connected, the site shows the placeholder stories in
`src/data/treks.ts`.

## 1. Create the project (free)

1. Sign up at <https://supabase.com> and click **New project**.
2. Pick a name (e.g. `gadsakhe`), a database password (save it somewhere safe),
   and the region closest to your readers (e.g. Mumbai).

## 2. Create the tables

1. In the project, open **SQL Editor → New query**.
2. Paste everything from [`schema.sql`](schema.sql) and click **Run**.
3. Optional: run [`seed.sql`](seed.sql) the same way to copy the three
   original stories into the database.

## 3. Connect the website

1. Open **Project Settings → API Keys** and copy the **Publishable key**.
   Open **Project Settings → Data API** and copy the **Project URL**.
2. In the project folder, copy `.env.example` to `.env.local` and paste both
   values in. `.env.local` is git-ignored, so it never goes to GitHub.
3. Restart `npm run dev`.

## 4. Allow the sign-in link to come back to the site

**Authentication → URL Configuration**:

- **Site URL**: your live site, e.g. `https://gadsakhe.vercel.app`
  (use `http://localhost:3000` until you deploy).
- **Redirect URLs**: add `http://localhost:3000/**` and your live site,
  e.g. `https://gadsakhe.vercel.app/**`.

## 5. Add authors

Sign-up is invite-only: the login page never creates accounts.

1. **Authentication → Users → Add user → Create new user**, enter the
   author's email, tick **Auto Confirm User**. (The password doesn't matter;
   authors sign in with an emailed link.)
2. They go to `/admin`, enter their email and click the link they receive.

To also stop sign-ups through Supabase directly, turn off **Authentication →
Sign In / Providers → Allow new users to sign up**.

### Make yourself an admin

Admins can edit and delete every story; authors only their own. After your
account exists, run this in the SQL Editor with your email:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

To set someone's display name (used as the default author name on new posts):

```sql
update public.profiles set display_name = 'Aisha Patil'
where id = (select id from auth.users where email = 'aisha@example.com');
```

## 6. Deploying (Vercel)

Add the same two variables (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) in **Vercel → Project → Settings →
Environment Variables** and redeploy.

## Good to know

- **Emails:** Supabase's built-in email sender only allows a few sign-in
  emails per hour. That's fine for a handful of authors. For more, set up
  custom SMTP under **Authentication → Emails**.
- **Images:** covers go to the public `trek-images` storage bucket (max 6 MB
  each). Replacing or removing a cover deletes the old file.
- **Who sees what:** the database itself enforces it with row-level security.
  Visitors see published stories only, authors see and edit their own, and
  admins see everything.
