alter table public.profiles
  add column if not exists brand_color text default '#12385F'
    check (brand_color ~* '^#[0-9A-Fa-f]{6}$');
