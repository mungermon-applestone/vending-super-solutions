-- Doc Builder standalone: profiles, per-user CMS connections, sessions, published articles.

-- ── profiles ──
create table public.profiles (
  id uuid primary key,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "own profile read" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "own profile write" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "own profile insert" on public.profiles
  for insert to authenticated with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── cms connections (non-secret config, readable by owner) ──
create table public.cms_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider text not null default 'contentful',
  name text not null,
  space_id text not null,
  environment_id text not null default 'master',
  content_type_id text not null,
  title_field text not null default 'articleTitle',
  body_field text not null default 'articleContent',
  section_field text,
  heading_field text,
  locale text not null default 'en-US',
  created_at timestamptz not null default now()
);

create index cms_connections_user_id_idx on public.cms_connections (user_id);

grant select, insert, update, delete on public.cms_connections to authenticated;
grant all on public.cms_connections to service_role;

alter table public.cms_connections enable row level security;

create policy "own connections" on public.cms_connections
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── cms credentials (server-only; NO grants to anon/authenticated) ──
create table public.cms_connection_secrets (
  connection_id uuid primary key references public.cms_connections(id) on delete cascade,
  management_token text not null,
  delivery_token text,
  updated_at timestamptz not null default now()
);

grant all on public.cms_connection_secrets to service_role;

alter table public.cms_connection_secrets enable row level security;
-- No policies: reachable only through edge functions using the service role.

-- ── capture sessions ──
create table public.capture_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null default 'Untitled capture',
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index capture_sessions_user_id_idx on public.capture_sessions (user_id);

grant select, insert, update, delete on public.capture_sessions to authenticated;
grant all on public.capture_sessions to service_role;

alter table public.capture_sessions enable row level security;

create policy "own sessions" on public.capture_sessions
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── published articles ──
create table public.published_articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  connection_id uuid references public.cms_connections(id) on delete set null,
  title text not null,
  entry_id text not null,
  step_count integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index published_articles_user_id_idx on public.published_articles (user_id);

grant select, delete on public.published_articles to authenticated;
grant all on public.published_articles to service_role;

alter table public.published_articles enable row level security;

create policy "own articles" on public.published_articles
  for select to authenticated using (user_id = auth.uid());
create policy "own articles delete" on public.published_articles
  for delete to authenticated using (user_id = auth.uid());

-- ── private screenshots bucket ──
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', false)
on conflict (id) do nothing;

create policy "own screenshots read" on storage.objects
  for select to authenticated
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "own screenshots write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "own screenshots update" on storage.objects
  for update to authenticated
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "own screenshots delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);
