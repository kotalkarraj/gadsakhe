-- Gadsakhe database schema.
-- Run this once in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run: everything is "if not exists" / "or replace".

-- ---------------------------------------------------------------------------
-- Profiles: one row per author, created automatically on sign-up.
-- role is 'author' (edits own posts) or 'admin' (edits everything).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  role text not null default 'author' check (role in ('author', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users created before this script ran
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1) from auth.users
on conflict (id) do nothing;

drop policy if exists "profiles: signed-in users can read" on public.profiles;
create policy "profiles: signed-in users can read"
  on public.profiles for select to authenticated
  using (true);

drop policy if exists "profiles: update own name" on public.profiles;
create policy "profiles: update own name"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Authors may only change their display name, never their own role.
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Posts (trek stories)
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text not null default '',
  name text not null,
  macro_region text not null,
  area text not null,
  difficulty text not null check (difficulty in ('Easy', 'Moderate', 'Difficult')),
  trek_date date not null default current_date,
  author_id uuid references public.profiles (id) on delete set null default auth.uid(),
  author_name text not null default '',
  excerpt text not null default '',
  image_url text not null default '',
  altitude text not null default '',
  distance text not null default '',
  duration text not null default '',
  body text[] not null default '{}',
  tips text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_date_idx on public.posts (status, trek_date desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;

drop policy if exists "posts: anyone reads published" on public.posts;
create policy "posts: anyone reads published"
  on public.posts for select
  using (status = 'published' or author_id = auth.uid() or public.is_admin());

drop policy if exists "posts: authors create own" on public.posts;
create policy "posts: authors create own"
  on public.posts for insert to authenticated
  with check (author_id = auth.uid() or public.is_admin());

drop policy if exists "posts: authors edit own" on public.posts;
create policy "posts: authors edit own"
  on public.posts for update to authenticated
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

drop policy if exists "posts: authors delete own" on public.posts;
create policy "posts: authors delete own"
  on public.posts for delete to authenticated
  using (author_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Image storage: public bucket, signed-in users upload, owners can delete
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('trek-images', 'trek-images', true)
on conflict (id) do nothing;

drop policy if exists "trek-images: signed-in upload" on storage.objects;
create policy "trek-images: signed-in upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'trek-images');

drop policy if exists "trek-images: owner or admin delete" on storage.objects;
create policy "trek-images: owner or admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'trek-images' and (owner = auth.uid() or public.is_admin()));
