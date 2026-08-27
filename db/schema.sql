-- Little Explorer World — cloud profiles
-- Run this once in the Supabase SQL editor.

create table if not exists public.explorer_profiles (
  email text primary key,
  google_name text not null default '',
  kid_name text not null default '',
  age integer,
  gender text not null default '',
  theme text not null default 'explorer',
  approval_code text not null default '',
  approval_email text not null default '',
  stars integer not null default 0,
  household_stars integer not null default 0,
  achievements jsonb not null default '[]'::jsonb,
  household_achievements jsonb not null default '[]'::jsonb,
  gifts jsonb not null default '[]'::jsonb,
  puzzle_plays jsonb not null default '{}'::jsonb,
  puzzle_recent jsonb not null default '{}'::jsonb,
  puzzle_mix_seed integer not null default 0,
  puzzle_mix_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.explorer_profiles enable row level security;

revoke all on public.explorer_profiles from anon, authenticated, public;
grant usage on schema public to anon, authenticated;

create or replace function public.get_explorer_profile(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.explorer_profiles;
begin
  if p_email is null or length(trim(p_email)) = 0 then
    return null;
  end if;
  select * into rec
  from public.explorer_profiles
  where email = lower(trim(p_email));
  if not found then
    return null;
  end if;
  return to_jsonb(rec);
end;
$$;

create or replace function public.upsert_explorer_profile(p_row jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  em text;
  rec public.explorer_profiles;
begin
  em := lower(trim(coalesce(p_row->>'email', '')));
  if em is null or em = '' then
    raise exception 'email required';
  end if;

  insert into public.explorer_profiles as t (
    email,
    google_name,
    kid_name,
    age,
    gender,
    theme,
    approval_code,
    approval_email,
    stars,
    household_stars,
    achievements,
    household_achievements,
    gifts,
    puzzle_plays,
    puzzle_recent,
    puzzle_mix_seed,
    puzzle_mix_index,
    updated_at
  ) values (
    em,
    coalesce(p_row->>'google_name', ''),
    coalesce(p_row->>'kid_name', ''),
    nullif(p_row->>'age', '')::int,
    coalesce(p_row->>'gender', ''),
    coalesce(nullif(p_row->>'theme', ''), 'explorer'),
    coalesce(p_row->>'approval_code', ''),
    coalesce(p_row->>'approval_email', ''),
    greatest(coalesce((p_row->>'stars')::int, 0), 0),
    greatest(coalesce((p_row->>'household_stars')::int, 0), 0),
    coalesce(p_row->'achievements', '[]'::jsonb),
    coalesce(p_row->'household_achievements', '[]'::jsonb),
    coalesce(p_row->'gifts', '[]'::jsonb),
    coalesce(p_row->'puzzle_plays', '{}'::jsonb),
    coalesce(p_row->'puzzle_recent', '{}'::jsonb),
    coalesce((p_row->>'puzzle_mix_seed')::int, 0),
    coalesce((p_row->>'puzzle_mix_index')::int, 0),
    now()
  )
  on conflict (email) do update set
    google_name = coalesce(nullif(excluded.google_name, ''), t.google_name),
    kid_name = coalesce(nullif(excluded.kid_name, ''), t.kid_name),
    age = coalesce(excluded.age, t.age),
    gender = coalesce(nullif(excluded.gender, ''), t.gender),
    theme = coalesce(nullif(excluded.theme, ''), t.theme),
    approval_code = case
      when excluded.approval_code is not null and excluded.approval_code <> ''
        then excluded.approval_code
      else t.approval_code
    end,
    approval_email = coalesce(nullif(excluded.approval_email, ''), t.approval_email),
    stars = excluded.stars,
    household_stars = excluded.household_stars,
    achievements = excluded.achievements,
    household_achievements = excluded.household_achievements,
    gifts = excluded.gifts,
    puzzle_plays = excluded.puzzle_plays,
    puzzle_recent = excluded.puzzle_recent,
    puzzle_mix_seed = excluded.puzzle_mix_seed,
    puzzle_mix_index = excluded.puzzle_mix_index,
    updated_at = now()
  returning * into rec;

  return to_jsonb(rec);
end;
$$;

grant execute on function public.get_explorer_profile(text) to anon, authenticated;
grant execute on function public.upsert_explorer_profile(jsonb) to anon, authenticated;

create or replace function public.delete_explorer_profile(p_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_email is null or length(trim(p_email)) = 0 then
    return false;
  end if;
  delete from public.explorer_profiles
  where email = lower(trim(p_email));
  return found;
end;
$$;

grant execute on function public.delete_explorer_profile(text) to anon, authenticated;
