-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own admin record
CREATE POLICY "Users can view their own admin record"
  ON public.admins
  FOR SELECT
  USING (auth.email() = email);

-- Create policy to allow service role to manage all admin records
CREATE POLICY "Service role can manage all admin records"
  ON public.admins
  FOR ALL
  USING (auth.role() = 'service_role');

-- Insert the admin user
-- Note: You need to create this user in Supabase Auth first (Authentication > Users)
-- Then uncomment and run this line:
-- INSERT INTO public.admins (email, role) VALUES ('admin@gwenmade.com', 'super_admin');

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS admins_email_idx ON public.admins(email);
