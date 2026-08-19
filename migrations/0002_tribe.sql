create table if not exists rsvps (
  id           serial primary key,
  user_id      text not null,
  event_id     text not null,
  display_name text not null,
  party_size   integer not null default 1,
  bringing     text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, event_id)
);
create index if not exists rsvps_event_id_idx on rsvps (event_id);

create table if not exists shoutouts (
  id           serial primary key,
  user_id      text not null,
  display_name text not null,
  message      text not null,
  created_at   timestamptz not null default now()
);
create index if not exists shoutouts_created_at_idx on shoutouts (created_at desc);

create table if not exists site_copy (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

create table if not exists site_images (
  slot       text primary key,
  mime       text not null,
  data       text not null,
  version    text not null,
  updated_at timestamptz not null default now()
);

create table if not exists site_editors (
  email      text primary key,
  created_at timestamptz not null default now()
);
