-- Run this in the Supabase SQL editor for the existing Little Explorer project.
-- Adds My Bank deposits (gift cards and cash) on the explorer profile.

alter table public.explorer_profiles
  add column if not exists bank_deposits jsonb not null default '[]'::jsonb;
alter table public.explorer_profiles
  add column if not exists bank_updated_at bigint not null default 0;

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
    custom_missions,
    custom_mission_cents,
    custom_mission_log,
    custom_missions_updated_at,
    bank_deposits,
    bank_updated_at,
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
    coalesce(p_row->'custom_missions', '[]'::jsonb),
    greatest(coalesce((p_row->>'custom_mission_cents')::int, 0), 0),
    coalesce(p_row->'custom_mission_log', '[]'::jsonb),
    coalesce((p_row->>'custom_missions_updated_at')::bigint, 0),
    coalesce(p_row->'bank_deposits', '[]'::jsonb),
    coalesce((p_row->>'bank_updated_at')::bigint, 0),
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
    custom_missions = excluded.custom_missions,
    custom_mission_cents = excluded.custom_mission_cents,
    custom_mission_log = excluded.custom_mission_log,
    custom_missions_updated_at = excluded.custom_missions_updated_at,
    bank_deposits = excluded.bank_deposits,
    bank_updated_at = excluded.bank_updated_at,
    updated_at = now()
  returning * into rec;

  return to_jsonb(rec);
end;
$$;

grant execute on function public.upsert_explorer_profile(jsonb) to anon, authenticated;
