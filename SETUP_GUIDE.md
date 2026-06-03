# 💕 Our Love Website — Complete Setup Guide

## What You're Getting
A beautiful, multi-page love website with:
- 🏠 **Home** — Hero with love stats & countdown
- 🗓️ **Plan a Date** — Calendar + itinerary builder with multiple stops
- ✨ **Coming Up** — Upcoming dates with full details
- 📸 **Memories** — Past dates with photo/video uploads
- 🌙 Dark/Light theme, floating petals, magnetic cursor, glass morphism

---

## PART 1 — Set Up Supabase (free database so both of you share data)

### Step 1: Create Supabase account
1. Go to **https://supabase.com** → Sign Up (free)
2. Create a new project → name it `loveapp` → choose a region close to you

### Step 2: Create the database tables
Go to **SQL Editor** in Supabase and paste this:

```sql
-- Date entries table
CREATE TABLE date_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'upcoming',
  mood TEXT DEFAULT 'romantic',
  cover_emoji TEXT DEFAULT '💕',
  places JSONB DEFAULT '[]',
  notes TEXT DEFAULT '',
  photos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos table
CREATE TABLE date_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date_id UUID REFERENCES date_entries(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  type TEXT DEFAULT 'photo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow public access (both of you can read/write)
ALTER TABLE date_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access" ON date_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON date_photos FOR ALL USING (true) WITH CHECK (true);
```

Click **Run**.

### Step 3: Create photo storage bucket
1. Go to **Storage** in Supabase sidebar
2. Click **New bucket** → name: `date-photos` → check **Public bucket** → Create

### Step 4: Get your API keys
Go to **Settings → API** and copy:
- **Project URL** (looks like `https://xxxxx.supabase.co`)
- **anon public key** (long string starting with `eyJ...`)

---

## PART 2 — Set Up and Deploy on Netlify

### Step 5: Upload code to GitHub
1. Go to **https://github.com** → New repository → name: `our-love-app`
2. In the `loveapp` folder, open a terminal and run:
```bash
git init
git add .
git commit -m "💕 Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/our-love-app.git
git push -u origin main
```

### Step 6: Deploy on Netlify
1. Go to **https://netlify.com** → Sign up with GitHub (free)
2. Click **Add new site → Import an existing project**
3. Connect GitHub → Choose `our-love-app` repo
4. Build settings will auto-fill (it reads `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click **Deploy site**

### Step 7: Add your Supabase keys to Netlify
1. In Netlify dashboard → **Site settings → Environment variables**
2. Add these two variables:
   - `REACT_APP_SUPABASE_URL` = your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click **Trigger deploy → Deploy site**

### Step 8: Get your live link! 🎉
Netlify gives you a URL like `https://random-name-12345.netlify.app`

You can **rename it**:
- Site settings → General → Change site name → e.g. `our-love-story`
- Now your URL is: `https://our-love-story.netlify.app`

**Share this link with your girlfriend — it works on any device, anytime!**

---

## PART 3 — Personalise the Website

### Change couple names & start date
Open `src/pages/Home.js` and find this near the top:

```js
const COUPLE = {
  name1: 'You',       // ← Change to your name
  name2: 'Her',       // ← Change to her name  
  togetherSince: '2023-02-14',  // ← Change to your anniversary date
  note: 'Every moment with you is a story worth telling', // ← Your quote
};
```

### After making changes, redeploy:
```bash
git add .
git commit -m "personalise names"
git push
```
Netlify auto-redeploys in ~1 minute!

---

## PART 4 — Mark a Date as "Past"

When a date has happened, go to Supabase:
1. **Table Editor → date_entries**
2. Find the row → change `status` from `upcoming` to `past`
3. It will move from "Coming Up" to "Memories" ✨

*(We'll add a UI button for this in a future update)*

---

## How It Works Without Supabase

If you haven't set up Supabase yet, the app still works!
- It uses **localStorage** (saved in your browser)
- But data won't sync between your phone and her phone
- Set up Supabase for full sync

---

## Quick Reference

| Feature | Where |
|---------|-------|
| Plan new date | /plan |
| See upcoming dates | /upcoming |
| View past memories | /memories |
| Upload photos | /memories → click any past date → scroll down |
| Toggle dark mode | Moon icon in navbar |

---

## Need Help?

If anything doesn't work, common fixes:
- **Blank page on Netlify**: Check that `netlify.toml` is in the root folder
- **Data not syncing**: Double-check Supabase env vars in Netlify settings
- **Photos not uploading**: Make sure the `date-photos` bucket is set to public in Supabase

Made with 💕 just for you two.
