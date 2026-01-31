-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create custom types
create type subscription_tier as enum ('free', 'starter', 'pro');
create type subscription_status as enum ('active', 'cancelled', 'expired', 'past_due', 'trialing');
create type testimonial_status as enum ('pending', 'approved', 'rejected');
create type widget_layout as enum ('grid', 'carousel', 'spotlight', 'wall', 'badge');
create type milestone_type as enum ('revenue', 'users', 'launch', 'anniversary', 'custom');

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  company_name text,
  website_url text,
  subscription_tier subscription_tier default 'free' not null,
  subscription_status subscription_status default 'active' not null,
  lemon_squeezy_customer_id text,
  lemon_squeezy_subscription_id text,
  testimonial_count integer default 0 not null,
  widget_count integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Collection pages for gathering testimonials
create table collection_pages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  logo_url text,
  primary_color text default '#3b82f6' not null,
  questions jsonb default '["How has our product helped you?", "What specific results have you achieved?", "Would you recommend us to others?"]'::jsonb not null,
  thank_you_message text default 'Thank you for your testimonial!' not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(user_id, slug)
);

-- Create index for slug lookups
create index collection_pages_slug_idx on collection_pages(slug);

-- Testimonials table
create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  collection_page_id uuid references collection_pages(id) on delete set null,
  author_name text not null,
  author_email text,
  author_title text,
  author_company text,
  author_avatar_url text,
  author_social_url text,
  content text not null,
  rating integer check (rating >= 1 and rating <= 5),
  status testimonial_status default 'pending' not null,
  source text default 'manual' not null,
  source_url text,
  tags text[] default '{}' not null,
  is_featured boolean default false not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create indexes for testimonials
create index testimonials_user_id_idx on testimonials(user_id);
create index testimonials_status_idx on testimonials(status);
create index testimonials_collection_page_id_idx on testimonials(collection_page_id);

-- Widgets table
create table widgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  layout widget_layout default 'grid' not null,
  testimonial_ids uuid[] default '{}' not null,
  settings jsonb default '{
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "accentColor": "#3b82f6",
    "borderRadius": 8,
    "showAvatar": true,
    "showRating": true,
    "showDate": false,
    "showCompany": true,
    "fontFamily": "system-ui",
    "maxTestimonials": 10,
    "autoplay": true,
    "autoplayInterval": 5000,
    "showBranding": true
  }'::jsonb not null,
  is_active boolean default true not null,
  impressions integer default 0 not null,
  clicks integer default 0 not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create index for widgets
create index widgets_user_id_idx on widgets(user_id);

-- Milestones table
create table milestones (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type milestone_type not null,
  title text not null,
  value numeric,
  target_value numeric,
  achieved_at timestamp with time zone,
  settings jsonb default '{}'::jsonb not null,
  is_public boolean default false not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create index for milestones
create index milestones_user_id_idx on milestones(user_id);

-- Integrations table (for Stripe, Twitter, etc.)
create table integrations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider text not null,
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(user_id, provider)
);

-- Create index for integrations
create index integrations_user_id_idx on integrations(user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update testimonial count
create or replace function public.update_testimonial_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update profiles set testimonial_count = testimonial_count + 1 where id = NEW.user_id;
  elsif TG_OP = 'DELETE' then
    update profiles set testimonial_count = testimonial_count - 1 where id = OLD.user_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger for testimonial count
create trigger on_testimonial_change
  after insert or delete on testimonials
  for each row execute procedure public.update_testimonial_count();

-- Function to update widget count
create or replace function public.update_widget_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update profiles set widget_count = widget_count + 1 where id = NEW.user_id;
  elsif TG_OP = 'DELETE' then
    update profiles set widget_count = widget_count - 1 where id = OLD.user_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger for widget count
create trigger on_widget_change
  after insert or delete on widgets
  for each row execute procedure public.update_widget_count();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

-- Apply updated_at trigger to all tables
create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at();
create trigger update_collection_pages_updated_at before update on collection_pages for each row execute procedure update_updated_at();
create trigger update_testimonials_updated_at before update on testimonials for each row execute procedure update_updated_at();
create trigger update_widgets_updated_at before update on widgets for each row execute procedure update_updated_at();
create trigger update_milestones_updated_at before update on milestones for each row execute procedure update_updated_at();
create trigger update_integrations_updated_at before update on integrations for each row execute procedure update_updated_at();

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table collection_pages enable row level security;
alter table testimonials enable row level security;
alter table widgets enable row level security;
alter table milestones enable row level security;
alter table integrations enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Collection pages policies
create policy "Users can view their own collection pages"
  on collection_pages for select
  using (auth.uid() = user_id);

create policy "Anyone can view active collection pages by slug"
  on collection_pages for select
  using (is_active = true);

create policy "Users can create collection pages"
  on collection_pages for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own collection pages"
  on collection_pages for update
  using (auth.uid() = user_id);

create policy "Users can delete their own collection pages"
  on collection_pages for delete
  using (auth.uid() = user_id);

-- Testimonials policies
create policy "Users can view their own testimonials"
  on testimonials for select
  using (auth.uid() = user_id);

create policy "Users can create testimonials"
  on testimonials for insert
  with check (auth.uid() = user_id);

create policy "Anyone can submit testimonials via collection pages"
  on testimonials for insert
  with check (
    exists (
      select 1 from collection_pages
      where collection_pages.id = collection_page_id
      and collection_pages.is_active = true
    )
  );

create policy "Users can update their own testimonials"
  on testimonials for update
  using (auth.uid() = user_id);

create policy "Users can delete their own testimonials"
  on testimonials for delete
  using (auth.uid() = user_id);

-- Widgets policies
create policy "Users can view their own widgets"
  on widgets for select
  using (auth.uid() = user_id);

create policy "Anyone can view active widgets for embedding"
  on widgets for select
  using (is_active = true);

create policy "Users can create widgets"
  on widgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own widgets"
  on widgets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own widgets"
  on widgets for delete
  using (auth.uid() = user_id);

-- Milestones policies
create policy "Users can view their own milestones"
  on milestones for select
  using (auth.uid() = user_id);

create policy "Anyone can view public milestones"
  on milestones for select
  using (is_public = true);

create policy "Users can create milestones"
  on milestones for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own milestones"
  on milestones for update
  using (auth.uid() = user_id);

create policy "Users can delete their own milestones"
  on milestones for delete
  using (auth.uid() = user_id);

-- Integrations policies
create policy "Users can view their own integrations"
  on integrations for select
  using (auth.uid() = user_id);

create policy "Users can create integrations"
  on integrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own integrations"
  on integrations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own integrations"
  on integrations for delete
  using (auth.uid() = user_id);
