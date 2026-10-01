create table if not exists public.alumni (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  regional_origin text not null default 'Bandung Raya',
  profession text not null default '',
  profile_photo_url text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  alumni_id uuid not null references public.alumni(id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists alumni_name_idx on public.alumni (lower(full_name));
create index if not exists alumni_region_idx on public.alumni (regional_origin);
create index if not exists memories_alumni_created_idx on public.memories (alumni_id, created_at desc);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_verified_auth_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.users
    where id = (select auth.uid()) and email_confirmed_at is not null
  );
$$;

revoke all on function private.is_verified_auth_user() from public, anon;
grant execute on function private.is_verified_auth_user() to authenticated;

create or replace function private.owns_alumni(p_alumni_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_verified_auth_user() and exists (
    select 1 from public.alumni
    where id = p_alumni_id and auth_user_id = (select auth.uid())
  );
$$;

revoke all on function private.owns_alumni(uuid) from public, anon;
grant execute on function private.owns_alumni(uuid) to authenticated;

create or replace function public.get_my_alumni_profile()
returns table (
  id uuid,
  full_name text,
  regional_origin text,
  profession text,
  profile_photo_url text,
  details jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select a.id, a.full_name, a.regional_origin, a.profession,
         a.profile_photo_url, a.details, a.created_at, a.updated_at
  from public.alumni as a
  where a.auth_user_id = (select auth.uid())
    and private.is_verified_auth_user();
$$;

revoke all on function public.get_my_alumni_profile() from public, anon;
grant execute on function public.get_my_alumni_profile() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists alumni_set_updated_at on public.alumni;
create trigger alumni_set_updated_at
before update on public.alumni
for each row execute function public.set_updated_at();

alter table public.alumni enable row level security;
alter table public.memories enable row level security;

drop policy if exists "Public can read alumni" on public.alumni;
create policy "Public can read alumni" on public.alumni
for select to anon, authenticated using (true);

drop policy if exists "Alumni can create their own profile" on public.alumni;
create policy "Alumni can create their own profile" on public.alumni
for insert to authenticated
with check (private.is_verified_auth_user() and auth_user_id = (select auth.uid()));

drop policy if exists "Alumni can update their own profile" on public.alumni;
create policy "Alumni can update their own profile" on public.alumni
for update to authenticated
using (private.is_verified_auth_user() and auth_user_id = (select auth.uid()))
with check (private.is_verified_auth_user() and auth_user_id = (select auth.uid()));

drop policy if exists "Public can read memories" on public.memories;
create policy "Public can read memories" on public.memories
for select to anon, authenticated using (true);

drop policy if exists "Alumni can add their own memories" on public.memories;
create policy "Alumni can add their own memories" on public.memories
for insert to authenticated
with check (
  private.owns_alumni(alumni_id)
);

drop policy if exists "Alumni can update their own memories" on public.memories;
create policy "Alumni can update their own memories" on public.memories
for update to authenticated
using (
  private.owns_alumni(alumni_id)
)
with check (
  private.owns_alumni(alumni_id)
);

drop policy if exists "Alumni can delete their own memories" on public.memories;
create policy "Alumni can delete their own memories" on public.memories
for delete to authenticated
using (
  private.owns_alumni(alumni_id)
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memory-images', 'memory-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view memory images" on storage.objects;
create policy "Public can view memory images" on storage.objects
for select to anon, authenticated
using (bucket_id = 'memory-images');

drop policy if exists "Alumni can upload under their user folder" on storage.objects;
create policy "Alumni can upload under their user folder" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'memory-images'
  and private.is_verified_auth_user()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Alumni can replace files under their user folder" on storage.objects;
create policy "Alumni can replace files under their user folder" on storage.objects
for update to authenticated
using (
  bucket_id = 'memory-images'
  and private.is_verified_auth_user()
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'memory-images'
  and private.is_verified_auth_user()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Alumni can delete files under their user folder" on storage.objects;
create policy "Alumni can delete files under their user folder" on storage.objects
for delete to authenticated
using (
  bucket_id = 'memory-images'
  and private.is_verified_auth_user()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

revoke all on public.alumni from anon, authenticated;
grant select (id, full_name, regional_origin, profession, profile_photo_url, details, created_at, updated_at)
  on public.alumni to anon, authenticated;
grant insert (auth_user_id, full_name, regional_origin, profession, profile_photo_url, details)
  on public.alumni to authenticated;
grant update (full_name, regional_origin, profession, profile_photo_url, details)
  on public.alumni to authenticated;
grant select on public.memories to anon, authenticated;
grant insert, update, delete on public.memories to authenticated;

create or replace function public.link_verified_alumni(p_alumni_id uuid, p_auth_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from auth.users
    where id = p_auth_user_id and email_confirmed_at is not null
  ) then
    raise exception 'The account must have a verified email';
  end if;

  update public.alumni
  set auth_user_id = p_auth_user_id
  where id = p_alumni_id and auth_user_id is null;

  if not found then
    raise exception 'Alumni record is missing or already linked';
  end if;
end;
$$;

revoke all on function public.link_verified_alumni(uuid, uuid) from public, anon, authenticated;
grant execute on function public.link_verified_alumni(uuid, uuid) to service_role;