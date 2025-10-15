-- Create login_attempts table for rate limiting
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  ip_address text,
  attempt_count integer DEFAULT 1,
  first_attempt_at timestamp with time zone DEFAULT now(),
  last_attempt_at timestamp with time zone DEFAULT now(),
  locked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX idx_login_attempts_locked_until ON public.login_attempts(locked_until);

-- RLS Policies (only Edge Functions can access)
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- No direct access from client - only Edge Functions can read/write
CREATE POLICY "Service role can manage login attempts"
  ON public.login_attempts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create auth_logs table for security monitoring
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  ip_address text,
  user_agent text,
  success boolean NOT NULL,
  failure_reason text,
  timestamp timestamp with time zone DEFAULT now()
);

-- Create indexes for monitoring queries
CREATE INDEX idx_auth_logs_email ON public.auth_logs(email);
CREATE INDEX idx_auth_logs_timestamp ON public.auth_logs(timestamp);
CREATE INDEX idx_auth_logs_success ON public.auth_logs(success);

-- RLS Policies
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage auth logs"
  ON public.auth_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);