-- GwenMade CMS schema. Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.cms_admins (
  email text primary key check (email = lower(email))
);

create table if not exists public.site_content (
  id text primary key check (id = 'main'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title_id text not null default '',
  title_en text not null default '',
  description_id text not null default '',
  description_en text not null default '',
  category_id text not null default '',
  category_en text not null default '',
  client text not null default '',
  year text not null default '',
  cover_image text not null default '',
  project_url text not null default '',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_gwenmade_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cms_admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_gwenmade_cms_admin() from public;
grant execute on function public.is_gwenmade_cms_admin() to anon, authenticated;

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant select on public.portfolio_projects to anon, authenticated;
grant insert, update, delete on public.portfolio_projects to authenticated;
grant select on public.cms_admins to authenticated;

alter table public.cms_admins enable row level security;
alter table public.site_content enable row level security;
alter table public.portfolio_projects enable row level security;

drop policy if exists "CMS admins can read their own allowlist entry" on public.cms_admins;
create policy "CMS admins can read their own allowlist entry"
  on public.cms_admins for select to authenticated
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select to anon, authenticated
  using (true);
drop policy if exists "CMS admins can insert site content" on public.site_content;
create policy "CMS admins can insert site content"
  on public.site_content for insert to authenticated
  with check (public.is_gwenmade_cms_admin());
drop policy if exists "CMS admins can update site content" on public.site_content;
create policy "CMS admins can update site content"
  on public.site_content for update to authenticated
  using (public.is_gwenmade_cms_admin())
  with check (public.is_gwenmade_cms_admin());
drop policy if exists "CMS admins can delete site content" on public.site_content;
create policy "CMS admins can delete site content"
  on public.site_content for delete to authenticated
  using (public.is_gwenmade_cms_admin());

drop policy if exists "Public can read published projects" on public.portfolio_projects;
create policy "Public can read published projects"
  on public.portfolio_projects for select to anon, authenticated
  using (published = true);
drop policy if exists "CMS admins can read all projects" on public.portfolio_projects;
create policy "CMS admins can read all projects"
  on public.portfolio_projects for select to authenticated
  using (public.is_gwenmade_cms_admin());
drop policy if exists "CMS admins can insert projects" on public.portfolio_projects;
create policy "CMS admins can insert projects"
  on public.portfolio_projects for insert to authenticated
  with check (public.is_gwenmade_cms_admin());
drop policy if exists "CMS admins can update projects" on public.portfolio_projects;
create policy "CMS admins can update projects"
  on public.portfolio_projects for update to authenticated
  using (public.is_gwenmade_cms_admin())
  with check (public.is_gwenmade_cms_admin());
drop policy if exists "CMS admins can delete projects" on public.portfolio_projects;
create policy "CMS admins can delete projects"
  on public.portfolio_projects for delete to authenticated
  using (public.is_gwenmade_cms_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-images', 'portfolio-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio images" on storage.objects;
create policy "Public can view portfolio images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio-images');
drop policy if exists "CMS admins can upload portfolio images" on storage.objects;
create policy "CMS admins can upload portfolio images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-images' and public.is_gwenmade_cms_admin());
drop policy if exists "CMS admins can update portfolio images" on storage.objects;
create policy "CMS admins can update portfolio images"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-images' and public.is_gwenmade_cms_admin())
  with check (bucket_id = 'portfolio-images' and public.is_gwenmade_cms_admin());
drop policy if exists "CMS admins can delete portfolio images" on storage.objects;
create policy "CMS admins can delete portfolio images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-images' and public.is_gwenmade_cms_admin());

-- After creating your user in Supabase Authentication, add that same email here:
-- insert into public.cms_admins (email) values (lower('you@example.com'));
