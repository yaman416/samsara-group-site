-- ============================================================
-- SPL Complete Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- SEASONS
-- ============================================================
create table if not exists seasons (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,              -- e.g. "Season 3"
  year        int  not null,              -- e.g. 2026
  is_active   boolean not null default false,
  created_at  timestamptz default now()
);

-- Only one active season at a time (add index after table exists)


-- ============================================================
-- CLUBS
-- ============================================================
create table if not exists clubs (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  short_code    text not null unique,     -- e.g. "KHK"
  community     text not null,            -- e.g. "Bhutanese"
  home_ground   text,
  home_color    text default '#101820',
  away_color    text default '#ffffff',
  home_trim     text default '#ffffff',
  away_trim     text default '#101820',
  logo_url      text,
  season_id     uuid references seasons(id) on delete set null,
  manager_id    uuid,                     -- references auth.users
  status        text not null default 'active' check (status in ('active','inactive')),
  created_at    timestamptz default now()
);

-- ============================================================
-- PLAYERS
-- ============================================================
create table if not exists players (
  id              uuid primary key default uuid_generate_v4(),
  club_id         uuid not null references clubs(id) on delete cascade,
  full_name       text not null,
  jersey_number   int,
  position        text check (position in ('GK','DEF','MID','FWD')),
  date_of_birth   date,
  nationality     text,
  is_active       boolean default true,
  created_at      timestamptz default now()
);

-- ============================================================
-- FIXTURES
-- ============================================================
create table if not exists fixtures (
  id            uuid primary key default uuid_generate_v4(),
  season_id     uuid not null references seasons(id) on delete cascade,
  week          int not null,
  home_club_id  uuid not null references clubs(id),
  away_club_id  uuid not null references clubs(id),
  venue         text,
  played_at     timestamptz,             -- scheduled datetime
  status        text not null default 'scheduled' check (status in ('scheduled','completed','postponed','cancelled')),
  created_at    timestamptz default now(),
  check (home_club_id <> away_club_id)
);

-- ============================================================
-- RESULTS
-- ============================================================
create table if not exists results (
  id            uuid primary key default uuid_generate_v4(),
  fixture_id    uuid not null unique references fixtures(id) on delete cascade,
  home_score    int not null check (home_score >= 0),
  away_score    int not null check (away_score >= 0),
  notes         text,
  entered_by    uuid,                    -- references auth.users
  entered_at    timestamptz default now()
);

-- ============================================================
-- GOAL SCORERS (optional matchday detail)
-- ============================================================
create table if not exists goal_scorers (
  id          uuid primary key default uuid_generate_v4(),
  fixture_id  uuid not null references fixtures(id) on delete cascade,
  player_id   uuid not null references players(id),
  club_id     uuid not null references clubs(id),
  minute      int,
  is_own_goal boolean default false,
  is_penalty  boolean default false
);

-- ============================================================
-- INVITES
-- ============================================================
create table if not exists invites (
  id            uuid primary key default uuid_generate_v4(),
  code          text not null unique default encode(gen_random_bytes(12), 'hex'),
  club_name     text not null,
  manager_email text not null,
  season_id     uuid references seasons(id),
  used          boolean default false,
  used_at       timestamptz,
  created_at    timestamptz default now()
);

-- ============================================================
-- REGISTRATIONS (club submissions via invite)
-- ============================================================
create table if not exists registrations (
  id              uuid primary key default uuid_generate_v4(),
  invite_id       uuid references invites(id),
  club_id         uuid references clubs(id),
  submitted_by    uuid,                  -- references auth.users
  status          text not null default 'pending' check (status in ('pending','approved','changes_requested','rejected')),
  reviewer_notes  text,
  submitted_at    timestamptz default now(),
  reviewed_at     timestamptz
);

-- ============================================================
-- USER ROLES (admin / manager)
-- ============================================================
create table if not exists user_roles (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid not null unique,        -- references auth.users
  role      text not null check (role in ('admin','manager')),
  club_id   uuid references clubs(id)    -- only for managers
);

-- ============================================================
-- LEAGUE TABLE VIEW
-- Auto-calculates standings from results
-- ============================================================
create or replace view league_table as
with all_games as (
  -- home perspective
  select
    f.season_id,
    f.home_club_id as club_id,
    r.home_score   as gf,
    r.away_score   as ga,
    case when r.home_score > r.away_score then 3
         when r.home_score = r.away_score then 1
         else 0 end as pts,
    case when r.home_score > r.away_score then 1 else 0 end as wins,
    case when r.home_score = r.away_score then 1 else 0 end as draws,
    case when r.home_score < r.away_score then 1 else 0 end as losses
  from fixtures f
  join results r on r.fixture_id = f.id
  where f.status = 'completed'

  union all

  -- away perspective
  select
    f.season_id,
    f.away_club_id as club_id,
    r.away_score   as gf,
    r.home_score   as ga,
    case when r.away_score > r.home_score then 3
         when r.away_score = r.home_score then 1
         else 0 end as pts,
    case when r.away_score > r.home_score then 1 else 0 end as wins,
    case when r.away_score = r.home_score then 1 else 0 end as draws,
    case when r.away_score < r.home_score then 1 else 0 end as losses
  from fixtures f
  join results r on r.fixture_id = f.id
  where f.status = 'completed'
),
standings as (
  select
    season_id,
    club_id,
    count(*)        as played,
    sum(wins)       as won,
    sum(draws)      as drawn,
    sum(losses)     as lost,
    sum(gf)         as goals_for,
    sum(ga)         as goals_against,
    sum(gf) - sum(ga) as goal_diff,
    sum(pts)        as points
  from all_games
  group by season_id, club_id
)
select
  row_number() over (
    partition by s.season_id
    order by s.points desc, s.goal_diff desc, s.goals_for desc, c.name asc
  ) as position,
  s.season_id,
  s.club_id,
  c.name         as club_name,
  c.short_code,
  c.logo_url,
  c.home_color,
  s.played,
  s.won,
  s.drawn,
  s.lost,
  s.goals_for,
  s.goals_against,
  s.goal_diff,
  s.points
from standings s
join clubs c on c.id = s.club_id
order by s.points desc, s.goal_diff desc, s.goals_for desc, c.name asc;

-- ============================================================
-- TRIGGER: auto-mark fixture as completed when result entered
-- ============================================================
create or replace function mark_fixture_completed()
returns trigger as $$
begin
  update fixtures set status = 'completed' where id = new.fixture_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_result_insert on results;
create trigger on_result_insert
  after insert or update on results
  for each row execute function mark_fixture_completed();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table seasons       enable row level security;
alter table clubs         enable row level security;
alter table players       enable row level security;
alter table fixtures      enable row level security;
alter table results       enable row level security;
alter table goal_scorers  enable row level security;
alter table invites       enable row level security;
alter table registrations enable row level security;
alter table user_roles    enable row level security;

-- Helper: check if current user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Helper: get current user's club_id
create or replace function my_club_id()
returns uuid as $$
  select club_id from user_roles
  where user_id = auth.uid() and role = 'manager';
$$ language sql security definer;

-- SEASONS: public read, admin write
create policy "seasons_public_read"  on seasons for select using (true);
create policy "seasons_admin_write"  on seasons for all    using (is_admin());

-- CLUBS: public read, admin full, manager read own
create policy "clubs_public_read"    on clubs for select using (true);
create policy "clubs_admin_write"    on clubs for all    using (is_admin());
create policy "clubs_manager_read"   on clubs for select using (id = my_club_id());

-- PLAYERS: public read, admin full, manager manage own club
create policy "players_public_read"  on players for select using (true);
create policy "players_admin_write"  on players for all    using (is_admin());
create policy "players_manager_write" on players for all   using (club_id = my_club_id());

-- FIXTURES: public read, admin full
create policy "fixtures_public_read" on fixtures for select using (true);
create policy "fixtures_admin_write" on fixtures for all    using (is_admin());

-- RESULTS: public read, admin full
create policy "results_public_read"  on results for select using (true);
create policy "results_admin_write"  on results for all    using (is_admin());

-- GOAL SCORERS: public read, admin full
create policy "goals_public_read"    on goal_scorers for select using (true);
create policy "goals_admin_write"    on goal_scorers for all    using (is_admin());

-- INVITES: admin only
create policy "invites_admin"        on invites for all using (is_admin());

-- REGISTRATIONS: admin full, manager read own
create policy "regs_admin"           on registrations for all    using (is_admin());
create policy "regs_manager_read"    on registrations for select using (submitted_by = auth.uid());

-- USER ROLES: admin full, self read
create policy "roles_admin"          on user_roles for all    using (is_admin());
create policy "roles_self_read"      on user_roles for select using (user_id = auth.uid());

-- ============================================================
-- SEED: Insert initial active season
-- ============================================================
insert into seasons (name, year, is_active)
values ('Season 3', 2026, true)
on conflict do nothing;
