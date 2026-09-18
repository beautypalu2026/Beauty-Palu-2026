-- Beauty Palu 2026 production schema
create extension if not exists pgcrypto;

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_date date not null,
  venue text,
  concept text,
  target_audience text,
  target_area text,
  ads_budget numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ads_plans (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  phase text,
  platform text,
  start_date date,
  end_date date,
  budget numeric default 0,
  audience text,
  estimated_reach text,
  objective text,
  content_type text,
  created_at timestamptz default now()
);

create table if not exists finance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  type text check(type in ('Income','Expense')),
  category text,
  amount numeric default 0,
  transaction_date date,
  notes text,
  proof_path text,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  task text,
  deadline date,
  pic text,
  status text,
  progress int default 0,
  created_at timestamptz default now()
);

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  name text,
  contact text,
  package text,
  status text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists influencers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  name text,
  platform text,
  followers bigint default 0,
  contact text,
  fee numeric default 0,
  status text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists agenda (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  agenda_date date,
  start_time time,
  end_time time,
  title text,
  pic text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  action text,
  table_name text,
  record_id uuid,
  created_at timestamptz default now()
);

insert into events(name,event_date,venue,concept,target_audience,target_area,ads_budget)
select 'Beauty Palu 2026','2026-11-26','Atrium Palu Grand Mall',
'Luxury Beauty Event / High-End Brand Partnership',
'Perempuan 17–40 tahun, beauty & fashion enthusiast, masyarakat umum Palu dan sekitarnya',
'Palu, Sulawesi Tengah + audience luar Palu / Sulawesi Tengah',9000000
where not exists (select 1 from events where name='Beauty Palu 2026');

-- For production, enable RLS and create policies based on authenticated users/roles.
-- Storage bucket recommended: finance-proofs (private).
