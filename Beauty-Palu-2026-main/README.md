# Beauty Palu 2026 — Online Event Management

Paket ini adalah fondasi deploy-ready Next.js + Supabase untuk Beauty Palu 2026.

## Fitur yang sudah disiapkan
- Dashboard event
- Detail event
- Buying Plan Ads
- Finance
- Task & Timeline
- Master Tenant
- Master Influencer/KOL
- Search
- Add/Delete data pada UI starter
- Export CSV
- Backup JSON
- Responsive desktop/mobile UI
- Supabase production schema
- Default data event Beauty Palu 2026

## Data default
- Event: Beauty Palu 2026
- Tanggal: 26 November 2026
- Venue: Atrium Palu Grand Mall
- Ads budget: Rp9.000.000
- Platform: Instagram, TikTok, Facebook

## Deploy ke Vercel
1. Buat repository GitHub dan upload isi folder ini.
2. Import repository ke Vercel.
3. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Jalankan `npm install` lalu `npm run build` untuk pengecekan lokal.
5. Di Supabase SQL Editor, jalankan `supabase/schema.sql`.
6. Untuk finance proof, buat private Storage bucket `finance-proofs` dan policy sesuai user role.

## Catatan production
UI pada `app/ui.tsx` adalah starter yang bisa langsung dijalankan. Agar benar-benar menjadi sistem multi-user production, CRUD harus dihubungkan ke Supabase client/server, authentication, RLS, Storage, dan audit log. Struktur database sudah disiapkan untuk tahap tersebut.

Jangan memasukkan password, service-role key, atau secret Supabase ke source code atau chat.
