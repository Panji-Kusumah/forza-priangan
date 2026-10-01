create table if not exists private.shared_account_config (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete cascade
);

alter table private.shared_account_config enable row level security;
revoke all on private.shared_account_config from public, anon, authenticated;

create or replace function private.is_shared_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.shared_account_config as config
    join auth.users as account on account.id = config.user_id
    where config.singleton = true
      and config.user_id = (select auth.uid())
      and account.email_confirmed_at is not null
  );
$$;

revoke all on function private.is_shared_editor() from public, anon;
grant execute on function private.is_shared_editor() to authenticated;

create or replace function public.is_shared_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_shared_editor();
$$;

revoke all on function public.is_shared_editor() from public, anon;
grant execute on function public.is_shared_editor() to authenticated;

drop policy if exists "Alumni can create their own profile" on public.alumni;
drop policy if exists "Alumni can update their own profile" on public.alumni;
drop policy if exists "Alumni can add their own memories" on public.memories;
drop policy if exists "Alumni can update their own memories" on public.memories;
drop policy if exists "Alumni can delete their own memories" on public.memories;
drop policy if exists "Alumni can upload under their user folder" on storage.objects;
drop policy if exists "Alumni can replace files under their user folder" on storage.objects;
drop policy if exists "Alumni can delete files under their user folder" on storage.objects;

drop function if exists public.get_my_alumni_profile();
drop function if exists public.link_verified_alumni(uuid, uuid);
drop function if exists private.owns_alumni(uuid);
alter table public.alumni drop column if exists auth_user_id;

alter table public.memories alter column alumni_id drop not null;

create policy "Shared account can create alumni" on public.alumni
for insert to authenticated
with check ((select private.is_shared_editor()));
create policy "Shared account can update alumni" on public.alumni
for update to authenticated
using ((select private.is_shared_editor()))
with check ((select private.is_shared_editor()));

revoke all on public.alumni from anon, authenticated;
grant select (id, full_name, regional_origin, profession, profile_photo_url, details, created_at, updated_at)
  on public.alumni to anon, authenticated;
grant insert (full_name, regional_origin, profession, profile_photo_url, details)
  on public.alumni to authenticated;
grant update (full_name, regional_origin, profession, profile_photo_url, details)
  on public.alumni to authenticated;

create policy "Shared account can add memories" on public.memories
for insert to authenticated
with check ((select private.is_shared_editor()));
create policy "Shared account can update memories" on public.memories
for update to authenticated
using ((select private.is_shared_editor()))
with check ((select private.is_shared_editor()));
create policy "Shared account can delete memories" on public.memories
for delete to authenticated
using ((select private.is_shared_editor()));

create table if not exists public.signatures (
  id uuid primary key default gen_random_uuid(),
  client_id text not null unique,
  source_mock_id text unique,
  name text not null,
  kunya text not null default 'Sahabat 2008',
  consulat text not null default 'Priangan',
  message text not null,
  date_label text not null,
  ink_color text not null check (ink_color in ('sepia', 'indigo', 'black', 'burgundy')),
  hand_style text not null check (hand_style in ('neat', 'cursive', 'bold')),
  rotation double precision not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists signatures_created_idx on public.signatures (created_at desc);

create table if not exists public.memory_notes (
  id uuid primary key default gen_random_uuid(),
  client_id text not null unique,
  memory_id uuid not null references public.memories(id) on delete cascade,
  author text not null,
  author_kunya text,
  content text not null,
  date_label text not null,
  ink_color text not null default 'sepia' check (ink_color in ('sepia', 'indigo', 'black', 'burgundy')),
  rotation double precision not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists memory_notes_memory_created_idx on public.memory_notes (memory_id, created_at desc);

alter table public.signatures enable row level security;
alter table public.memory_notes enable row level security;

create policy "Public can read signatures" on public.signatures
for select to anon, authenticated using (true);
create policy "Shared account can add signatures" on public.signatures
for insert to authenticated with check ((select private.is_shared_editor()));
create policy "Shared account can update signatures" on public.signatures
for update to authenticated using ((select private.is_shared_editor()))
with check ((select private.is_shared_editor()));
create policy "Shared account can delete signatures" on public.signatures
for delete to authenticated using ((select private.is_shared_editor()));

create policy "Public can read memory notes" on public.memory_notes
for select to anon, authenticated using (true);
create policy "Shared account can add memory notes" on public.memory_notes
for insert to authenticated with check ((select private.is_shared_editor()));
create policy "Shared account can update memory notes" on public.memory_notes
for update to authenticated using ((select private.is_shared_editor()))
with check ((select private.is_shared_editor()));
create policy "Shared account can delete memory notes" on public.memory_notes
for delete to authenticated using ((select private.is_shared_editor()));

grant select on public.signatures, public.memory_notes to anon, authenticated;
grant insert, update, delete on public.signatures, public.memory_notes to authenticated;

create policy "Shared account can upload memory images" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'memory-images'
  and (select private.is_shared_editor())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Shared account can replace memory images" on storage.objects
for update to authenticated
using (
  bucket_id = 'memory-images'
  and (select private.is_shared_editor())
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'memory-images'
  and (select private.is_shared_editor())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Shared account can delete memory images" on storage.objects
for delete to authenticated
using (
  bucket_id = 'memory-images'
  and (select private.is_shared_editor())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

insert into public.memory_notes (
  client_id, memory_id, author, author_kunya, content, date_label, ink_color, rotation
)
select
  coalesce(note.value ->> 'id', gen_random_uuid()::text),
  memory.id,
  coalesce(note.value ->> 'author', 'Sahabat 2008'),
  note.value ->> 'authorKunya',
  coalesce(note.value ->> 'text', ''),
  coalesce(note.value ->> 'date', ''),
  coalesce(note.value ->> 'inkColor', 'sepia'),
  coalesce((note.value ->> 'rotation')::double precision, 0)
from public.memories as memory
cross join lateral jsonb_array_elements(
  case
    when jsonb_typeof(memory.details -> 'marginNotes') = 'array' then memory.details -> 'marginNotes'
    else '[]'::jsonb
  end
) as note(value)
where memory.details ? 'sourceMockId'
on conflict (client_id) do nothing;