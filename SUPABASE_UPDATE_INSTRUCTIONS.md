# Supabase Update Instructions

## ✅ Already Updated Files:

### 1. `.env` (Backend - Local/Vercel)
```
SUPABASE_URL=https://ogapdrgcwmzecbwwrmre.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role key)
```

### 2. `index.html` (Frontend)
```javascript
const SUPABASE_URL = 'https://ogapdrgcwmzecbwwrmre.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // ⚠️ NEEDS ANON KEY
```

### 3. `history.html` (Frontend)
```javascript
const SUPABASE_URL = 'https://ogapdrgcwmzecbwwrmre.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // ⚠️ NEEDS ANON KEY
```

---

## 🔑 You Need the ANON Key!

The **service_role** key you provided is for **backend only** (API). 
For the frontend (HTML files), you need the **anon (public)** key.

### How to Get the Anon Key:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `ogapdrgcwmzecbwwrmre`
3. Click **Settings** (gear icon) in the left sidebar
4. Click **API**
5. Under **Project API keys**, copy the **anon** key (NOT service_role)
   - It starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - It has `"role":"anon"` when decoded

---

## 📝 TODO: Replace Anon Keys

Once you have the anon key, replace `'YOUR_ANON_KEY_HERE'` in:

1. **index.html** (line ~140)
2. **history.html** (line ~83)

---

## 🚀 Deploy to Vercel

### Update Vercel Environment Variables:

1. Go to https://vercel.com/dashboard
2. Select your project: `asthma-dashboard`
3. Go to **Settings** → **Environment Variables**
4. Update these two variables:
   - `SUPABASE_URL` = `https://ogapdrgcwmzecbwwrmre.supabase.co`
   - `SUPABASE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYXBkcmdjd216ZWNid3dybXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM0MjE3MCwiZXhwIjoyMDczOTE4MTcwfQ.7L9zpymxD0nGE6pqk_d6Zs_GqrcBJwNUekUFBdYHLlo`
5. Click **Save**
6. Redeploy your project

---

## ⚠️ Database Table Check

Make sure your new Supabase database has a table named **`sensor_data`** with these columns:

- `id` (uuid, primary key)
- `created_at` (timestamp)
- `device_id` (text)
- `heart_rate` (numeric)
- `spo2` (numeric, 0-1 range)
- `accel_mag` (numeric)
- `temperature` (numeric)
- `humidity` (numeric)
- `prediction_label` (text: 'normal', 'wheeze', 'cough')
- `risk_level` (text: 'safe', 'medium', 'high')
- `pm25` (numeric)
- `pm25_density` (numeric)
- `pm25_raw` (numeric)

If column names are different, let me know and I'll update the code!

---

## 🔧 Next Steps:

1. ✅ Get the anon key from Supabase dashboard
2. ✅ Replace `'YOUR_ANON_KEY_HERE'` in index.html and history.html
3. ✅ Update Vercel environment variables
4. ✅ Verify database table structure matches
5. ✅ Push to GitHub: `git add . && git commit -m "Update Supabase credentials" && git push`
6. ✅ Wait for Vercel to auto-deploy
7. ✅ Test with test_safe.sql, test_medium.sql, test_high.sql
