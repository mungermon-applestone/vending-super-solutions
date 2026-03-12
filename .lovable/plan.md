

# Fix: Add Admin User to `admin_users` Table

## Problem
The edge function successfully authenticates user `6533fe93-1171-417d-9d3b-4f370804949b` (`munger@applestonesolutions.com`), but the `is_admin()` check returns false because the `admin_users` table is empty. This causes the 403 response.

## Solution
Insert a single row into `public.admin_users`:

```sql
INSERT INTO public.admin_users (user_id)
VALUES ('6533fe93-1171-417d-9d3b-4f370804949b');
```

No code changes needed — just a database insert. After this, retrying the publish should proceed past the admin check and create the Contentful draft.

