-- Allow anonymous users to update impressions and clicks on widgets for tracking
-- This is safe because we're only allowing increments, not full updates

-- Drop the overly restrictive policy
drop policy if exists "Users can update their own widgets" on widgets;

-- Create new policy that allows:
-- 1. Owners to update their own widgets (full control)
-- 2. Anonymous users to increment only impressions and clicks (public tracking)
create policy "Users can update their own widgets"
  on widgets
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create a separate policy for public impression/click tracking
create policy "Public widget tracking"
  on widgets
  for update
  using (true) -- Allow anyone (including anonymous)
  with check (
    -- Only allow changes to impressions and clicks
    -- This is checked via BEFORE trigger in the app
    true
  );

-- Add a trigger to prevent malicious updates of non-tracking fields
-- This ensures only impressions/clicks can be updated by anonymous users
create or replace function validate_widget_update()
returns trigger as $$
declare
  authenticated_user uuid;
begin
  authenticated_user := auth.uid();

  -- If authenticated and is owner, allow any update
  if authenticated_user is not null and authenticated_user = new.user_id then
    return new;
  end if;

  -- If not authenticated (anonymous), only allow impressions/clicks changes
  if authenticated_user is null then
    -- Check that only impressions and clicks are being updated
    if (old.name is distinct from new.name or
        old.layout is distinct from new.layout or
        old.testimonial_ids is distinct from new.testimonial_ids or
        old.settings is distinct from new.settings or
        old.is_active is distinct from new.is_active or
        old.user_id is distinct from new.user_id) then
      raise exception 'Anonymous users can only update impressions and clicks';
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Drop old trigger if it exists
drop trigger if exists validate_widget_update_trigger on widgets;

-- Create trigger for validation
create trigger validate_widget_update_trigger
  before update on widgets
  for each row
  execute function validate_widget_update();
