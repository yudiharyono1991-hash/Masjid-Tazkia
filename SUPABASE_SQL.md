# Supabase SQL Setup for Masjid Tazkia

Gunakan query SQL berikut di Supabase SQL editor untuk membuat tabel dasar aplikasi.

```sql
-- App Roles (Dynamic Roles)
create table if not exists app_roles (
  id text primary key,
  name text not null,
  type text not null,
  created_at timestamptz not null default now()
);

-- Insert Default Roles
insert into app_roles (id, name, type)
values 
  ('ketua_dewan_pembina', 'Ketua Dewan Pembina', 'pengurus_dkm'),
  ('direktur', 'Direktur', 'pengurus_dkm'),
  ('ketua_dkm', 'Ketua DKM', 'pengurus_dkm'),
  ('bendahara', 'Bendahara', 'admin_masjid'),
  ('penghimpunan', 'Bagian Penghimpunan', 'admin_masjid'),
  ('penyaluran', 'Bagian Penyaluran', 'admin_masjid')
on conflict (id) do nothing;

-- Users & Roles
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  password text,
  full_name text,
  phone text,
  role text not null default 'jamaah',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists idx_users_role on users(role);

-- Programs
create table if not exists programs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  category text not null,
  target_amount bigint not null default 0,
  collected_amount bigint not null default 0,
  donors_count integer not null default 0,
  image_url text,
  description text,
  is_urgent boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Donation records
create table if not exists donations (
  id uuid primary key default uuid_generate_v4(),
  program_id uuid references programs(id) on delete set null,
  program_title text,
  category text,
  amount bigint not null,
  unique_code integer not null,
  total_amount bigint not null,
  donor_name text,
  donor_phone text,
  payment_method text,
  is_anonymous boolean not null default false,
  recurring_period text not null default 'none',
  status text not null default 'menunggu_pembayaran',
  transaction_ref text,
  created_at timestamptz not null default now()
);

create index if not exists idx_donations_program_id on donations(program_id);
create index if not exists idx_donations_status on donations(status);

-- Financial transactions
create table if not exists financial_transactions (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  title text not null,
  category text,
  amount bigint not null,
  date date not null,
  description text,
  proof_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Petugas jadwal
create table if not exists petugas_jadwal (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  day_name text,
  subuh text,
  dzuhur text,
  ashar text,
  maghrib text,
  isya text,
  khatib_jumat text,
  imam_jumat text,
  muadzin_jumat text,
  bilal_jumat text,
  topik_jumat text,
  time_jumat text,
  notes_jumat text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Qurban groups and participants
create table if not exists qurban_groups (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  animal_type text not null,
  type text not null,
  price_per_share bigint not null,
  total_shares integer not null,
  filled_shares integer not null default 0,
  weight_estimate text,
  image_url text,
  description text,
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists qurban_participants (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references qurban_groups(id) on delete cascade,
  group_title text,
  mudhahhi_name text,
  phone text,
  shares_count integer not null,
  total_paid bigint not null,
  payment_status text not null default 'Menunggu Pembayaran',
  transaction_ref text,
  created_at timestamptz not null default now()
);

create index if not exists idx_qurban_participants_group_id on qurban_participants(group_id);

-- Gallery items
create table if not exists gallery_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  category text,
  media_type text,
  media_url text,
  video_embed_url text,
  thumbnail_url text,
  date date,
  ustadz_name text,
  location text,
  summary text,
  article_content text,
  likes_count integer not null default 0,
  views_count integer not null default 0,
  tags text[],
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Inventory
create table if not exists inventory_items (
  id uuid primary key default uuid_generate_v4(),
  code text not null,
  name text not null,
  category text,
  quantity integer not null default 0,
  unit text,
  condition text,
  location text,
  last_maintenance date,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Announcements
create table if not exists announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  category text,
  date date,
  is_pinned boolean not null default false,
  author text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Settings / Admin
create table if not exists app_settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now()
);

-- Triggers for updated_at fields
create function update_updated_at_column() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_programs_updated_at
  before update on programs
  for each row execute function update_updated_at_column();

create trigger update_financial_transactions_updated_at
  before update on financial_transactions
  for each row execute function update_updated_at_column();

create trigger update_petugas_jadwal_updated_at
  before update on petugas_jadwal
  for each row execute function update_updated_at_column();

create trigger update_qurban_groups_updated_at
  before update on qurban_groups
  for each row execute function update_updated_at_column();

create trigger update_gallery_items_updated_at
  before update on gallery_items
  for each row execute function update_updated_at_column();

create trigger update_inventory_items_updated_at
  before update on inventory_items
  for each row execute function update_updated_at_column();

create trigger update_announcements_updated_at
  before update on announcements
  for each row execute function update_updated_at_column();

create trigger update_app_settings_updated_at
  before update on app_settings
  for each row execute function update_updated_at_column();

-- ERP Accounting: Chart of Accounts
create table if not exists chart_of_accounts (
  id uuid primary key default uuid_generate_v4(),
  account_code text not null unique,
  account_name text not null,
  account_type text not null, -- Asset, Liability, Equity, Revenue, Expense
  normal_balance text not null, -- Debit, Credit
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ERP Accounting: General Journals
create table if not exists general_journals (
  id uuid primary key default uuid_generate_v4(),
  journal_no text not null unique,
  date date not null,
  description text not null,
  reference text,
  status text not null default 'Draft', -- Draft, Posted
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ERP Accounting: Journal Entries
create table if not exists journal_entries (
  id uuid primary key default uuid_generate_v4(),
  journal_id uuid references general_journals(id) on delete cascade,
  account_id uuid references chart_of_accounts(id) on delete restrict,
  debit bigint not null default 0,
  credit bigint not null default 0,
  description text,
  created_at timestamptz not null default now()
);

-- ERP Accounting: Report Signatures
create table if not exists report_signatures (
  id uuid primary key default uuid_generate_v4(),
  report_type text not null, -- LabaRugi, Neraca, ArusKas, Penyaluran
  period text not null, -- e.g., 2026-07
  role text not null, -- Pembuat, Bendahara, Ketua DKM, Dewan Pembina
  signer_name text,
  status text not null default 'Pending', -- Pending, Signed, Rejected
  signature_date timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_coa_updated_at
  before update on chart_of_accounts
  for each row execute function update_updated_at_column();

create trigger update_journals_updated_at
  before update on general_journals
  for each row execute function update_updated_at_column();

create trigger update_report_signatures_updated_at
  before update on report_signatures
  for each row execute function update_updated_at_column();

-- Booking Gedung
create table if not exists gedung_bookings (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  name text not null,
  whatsapp text not null,
  email text,
  notes text,
  status text not null default 'pending', -- pending, approved, rejected
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_gedung_bookings_updated_at
  before update on gedung_bookings
  for each row execute function update_updated_at_column();

-- Kamar Bookings
create table if not exists kamar_bookings (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  checkout_date date not null,
  name text not null,
  whatsapp text not null,
  email text,
  room_type text not null,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_kamar_bookings_updated_at
  before update on kamar_bookings
  for each row execute function update_updated_at_column();

-- Keropak Transactions
create table if not exists keropak_transactions (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  amount bigint not null,
  date date not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_keropak_transactions_updated_at
  before update on keropak_transactions
  for each row execute function update_updated_at_column();

-- Jamaah Transactions
create table if not exists jamaah_transactions (
  id uuid primary key default uuid_generate_v4(),
  jamaah_id text not null,
  date date not null,
  description text,
  type text not null,
  amount bigint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_jamaah_transactions_updated_at
  before update on jamaah_transactions
  for each row execute function update_updated_at_column();

-- App Sync State (For global state syncing)
create table if not exists app_sync_state (
  id integer primary key default 1,
  state_json jsonb not null,
  updated_at timestamptz not null default now()
);
```

