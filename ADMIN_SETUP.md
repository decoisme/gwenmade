# GwenMade CMS Admin Setup Guide

## Step 1: Create the Admin User in Supabase Auth

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/tpagcmyaxkglxbubiqyo
2. Navigate to **Authentication** > **Users**
3. Click **"Add user"** > **"Create new user"**
4. Enter:
   - **Email**: `admin@gwenmade.com`
   - **Password**: `admin123`
   - Check **"Auto Confirm User"** (so you don't need to verify email)
5. Click **"Create user"**

## Step 2: Create the Admins Table

1. In your Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the entire contents of `scripts/setup-admin.sql`
4. Click **"Run"** to execute the SQL

## Step 3: Add Admin User to Admins Table

After creating the user in Auth and the table in SQL Editor:

1. Go back to **SQL Editor**
2. Run this query:

```sql
INSERT INTO public.admins (email, role) 
VALUES ('admin@gwenmade.com', 'super_admin');
```

3. Verify the admin was added by running:

```sql
SELECT * FROM public.admins;
```

## Step 4: Test the Admin Login

1. Start your development server: `npm run dev`
2. Navigate to: http://localhost:3000/admin/login
3. Login with:
   - **Email**: admin@gwenmade.com
   - **Password**: admin123
4. You should be redirected to the admin dashboard

## Security Notes

⚠️ **Important**: Change the default password `admin123` to something more secure in production!

To change the password:
1. Go to Supabase Dashboard > **Authentication** > **Users**
2. Find the admin user and click the three dots
3. Select **"Reset password"** or **"Edit user"**

## Troubleshooting

**Error: "This account is not listed as a GwenMade CMS admin"**
- Make sure the user exists in the `admins` table
- Check that the email matches exactly (case-sensitive)

**Error: "Invalid login credentials"**
- Verify the user was created in Supabase Auth
- Check that "Auto Confirm User" was enabled
- Try resetting the password in the Supabase Dashboard

**Can't access admin dashboard**
- Clear your browser cookies
- Make sure you're logged in
- Check the browser console for errors
