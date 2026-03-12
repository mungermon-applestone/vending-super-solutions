

# Create Admin Account for Doc Builder

## What needs to happen

1. **Create a Supabase auth user** for `munger@applestonesolutions.com` — this must be done in the Supabase Dashboard since we cannot create auth users via SQL.

2. **Insert the user into `admin_users`** — once the auth user exists, we insert their UUID into the `admin_users` table so the `is_admin()` function returns true.

## Steps

### Step 1: Create the auth user (manual — Dashboard)
Go to the [Supabase Users page](https://supabase.com/dashboard/project/rwvlvooojegpebognnzn/auth/users) and click **"Add user" → "Create new user"**. Enter:
- Email: `munger@applestonesolutions.com`
- Password: choose a password you'll remember
- Check "Auto Confirm" so the account is immediately active

### Step 2: Insert into admin_users (I'll do this)
Once you've created the user and share the UUID (or just confirm it's done), I'll insert the row into `admin_users` using the user's UUID.

---

No code changes needed — this is purely a data/config task. Let me know once you've created the user in the dashboard and I'll add the admin row.

