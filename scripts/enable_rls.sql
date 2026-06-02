-- Enable Row Level Security (RLS) on all user data tables
ALTER TABLE wombcare_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wombcare_period_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE wombcare_user_profile_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE wombcare_live_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE wombcare_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Note: Row level security (RLS) is bypassed by the Express backend using the service_role key.
-- These policies protect user data from unauthorized access via public anon keys.
-- We use ::text typecasts on both sides (e.g. user_id::text = auth.uid()::text) to prevent type mismatch errors
-- when comparing varchar/character varying columns with Postgres uuid types.

-- 1. wombcare_user_profiles (Profile record is owner-read, owner-write)
CREATE POLICY owner_select ON wombcare_user_profiles
  FOR SELECT TO authenticated USING (id::text = auth.uid()::text);

CREATE POLICY owner_insert ON wombcare_user_profiles
  FOR INSERT TO authenticated WITH CHECK (id::text = auth.uid()::text);

CREATE POLICY owner_update ON wombcare_user_profiles
  FOR UPDATE TO authenticated USING (id::text = auth.uid()::text) WITH CHECK (id::text = auth.uid()::text);

CREATE POLICY owner_delete ON wombcare_user_profiles
  FOR DELETE TO authenticated USING (id::text = auth.uid()::text);

-- 2. wombcare_period_history (Period/cycles logs are owner-only)
CREATE POLICY owner_select_period ON wombcare_period_history
  FOR SELECT TO authenticated USING (user_id::text = auth.uid()::text);

CREATE POLICY owner_insert_period ON wombcare_period_history
  FOR INSERT TO authenticated WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY owner_update_period ON wombcare_period_history
  FOR UPDATE TO authenticated USING (user_id::text = auth.uid()::text) WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY owner_delete_period ON wombcare_period_history
  FOR DELETE TO authenticated USING (user_id::text = auth.uid()::text);

-- 3. wombcare_user_profile_history (Daily tracking records are owner-only)
CREATE POLICY owner_select_history ON wombcare_user_profile_history
  FOR SELECT TO authenticated USING (user_id::text = auth.uid()::text);

CREATE POLICY owner_insert_history ON wombcare_user_profile_history
  FOR INSERT TO authenticated WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY owner_update_history ON wombcare_user_profile_history
  FOR UPDATE TO authenticated USING (user_id::text = auth.uid()::text) WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY owner_delete_history ON wombcare_user_profile_history
  FOR DELETE TO authenticated USING (user_id::text = auth.uid()::text);

-- 4. wombcare_live_chats (Class chat logs: users can view all in their class, but only modify their own)
CREATE POLICY view_chats ON wombcare_live_chats
  FOR SELECT TO authenticated USING (true); -- users can view chat history for active classes

CREATE POLICY owner_insert_chats ON wombcare_live_chats
  FOR INSERT TO authenticated WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY owner_delete_chats ON wombcare_live_chats
  FOR DELETE TO authenticated USING (user_id::text = auth.uid()::text);

-- 5. wombcare_appointments (Consultation appointments are owner-only)
CREATE POLICY owner_select_appt ON wombcare_appointments
  FOR SELECT TO authenticated USING (user_id::text = auth.uid()::text);

CREATE POLICY owner_insert_appt ON wombcare_appointments
  FOR INSERT TO authenticated WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY owner_update_appt ON wombcare_appointments
  FOR UPDATE TO authenticated USING (user_id::text = auth.uid()::text) WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY owner_delete_appt ON wombcare_appointments
  FOR DELETE TO authenticated USING (user_id::text = auth.uid()::text);

-- 6. users (Credentials table is owner-only)
CREATE POLICY owner_select_user ON users
  FOR SELECT TO authenticated USING (id::text = auth.uid()::text);

CREATE POLICY owner_update_user ON users
  FOR UPDATE TO authenticated USING (id::text = auth.uid()::text) WITH CHECK (id::text = auth.uid()::text);

CREATE POLICY owner_delete_user ON users
  FOR DELETE TO authenticated USING (id::text = auth.uid()::text);
