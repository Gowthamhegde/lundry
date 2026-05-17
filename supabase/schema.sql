-- ============================================================
-- FreshWash — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. profiles ──────────────────────────────────────────────
-- Extends auth.users with display name, phone, and role.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. services ──────────────────────────────────────────────
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  price       numeric(10,2) not null default 0,
  category    text not null default 'Per piece',
  icon        text,
  badge       text,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Seed default services
insert into public.services (name, description, price, category, icon, badge, sort_order) values
  ('Iron only',       'Professional pressing for individual garments.',        15,  'Per piece', 'iron',        null,      1),
  ('Wash + iron',     'Full wash and professional ironing.',                   49,  'Per kg',    'washing',     'Popular', 2),
  ('Wash + fold',     'Wash, dry and neatly folded.',                          39,  'Per kg',    'fold',        null,      3),
  ('Dry cleaning',    'Careful dry cleaning for delicate fabrics.',            99,  'Per piece', 'hanger',      null,      4),
  ('Premium wash',    'Gentle, premium detergents for best results.',          69,  'Per kg',    'sparkles',    null,      5),
  ('Stain removal',   'Targeted treatment for tough stains.',                  29,  'Per stain', 'droplet-off', null,      6),
  ('Shoe cleaning',   'Deep clean and deodorize shoes (per pair).',            79,  'Per pair',  'shoe',        null,      7),
  ('Carpet / blanket','Large-item cleaning for carpets and blankets.',         149, 'Per piece', 'layout-grid', null,      8)
on conflict do nothing;

-- ── 3. orders ────────────────────────────────────────────────
create table if not exists public.orders (
  id              text primary key,                          -- e.g. FW-123456
  user_id         uuid references auth.users(id) on delete set null,
  customer_name   text not null,
  customer_phone  text not null,
  pickup_address  text not null,
  pickup_date     date,
  pickup_time     time,
  notes           text,
  status          text not null default 'Order received'
                    check (status in (
                      'Order received',
                      'Picked up',
                      'Being cleaned',
                      'Out for delivery',
                      'Delivered',
                      'Cancelled'
                    )),
  estimated_total numeric(10,2) not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Order line items
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    text not null references public.orders(id) on delete cascade,
  service_id  uuid references public.services(id) on delete set null,
  name        text not null,
  price       numeric(10,2) not null,
  quantity    integer not null default 1
);

-- ── 4. site_config ───────────────────────────────────────────
create table if not exists public.site_config (
  key         text primary key,
  value       text not null default '',
  updated_at  timestamptz not null default now()
);

-- Seed default config values
insert into public.site_config (key, value) values
  ('companyName',   'FreshWash'),
  ('heroTitle',     'Your fit. Always Fresh.'),
  ('heroSubtitle',  'Premium pickup, wash, fold, press, and delivery — clean app flow, zero waiting-room energy.'),
  ('contactEmail',  'support@freshwash.demo'),
  ('contactPhone',  '+91 98765 43210')
on conflict do nothing;

-- ── Row Level Security ────────────────────────────────────────

-- profiles: users can read/update their own row; admins can read all
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- services: public read; only admins can write
alter table public.services enable row level security;

create policy "Anyone can read active services"
  on public.services for select
  using (active = true);

create policy "Admins can manage services"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- orders: users see their own; admins see all
alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Anyone can insert orders"
  on public.orders for insert
  with check (true);

create policy "Admins can manage all orders"
  on public.orders for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- order_items: follow parent order policy
alter table public.order_items enable row level security;

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "Anyone can insert order items"
  on public.order_items for insert
  with check (true);

create policy "Admins can manage all order items"
  on public.order_items for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- site_config: public read; only admins can write
alter table public.site_config enable row level security;

create policy "Anyone can read site config"
  on public.site_config for select
  using (true);

create policy "Admins can update site config"
  on public.site_config for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── Helper: promote a user to admin ──────────────────────────
-- Run manually in SQL editor:
-- update public.profiles set role = 'admin' where id = '<your-user-uuid>';
