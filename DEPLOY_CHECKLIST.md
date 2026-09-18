# Beauty Palu 2026 — Deploy Checklist

## Vercel
1. Upload the contents of this ZIP to the GitHub repository root.
2. The repository root MUST directly contain `package.json`, `app/`, `tsconfig.json`, and `next-env.d.ts`.
3. In Vercel, import that repository.
4. Framework Preset: Next.js.
5. Root Directory: `.` (repository root).
6. Build Command: `npm run build`.
7. Deploy.

## CRUD visibility
Every data page has a visible `AKSI` column with:
- Lihat
- Edit
- Hapus

There is also a `+ Tambah` button and global search. The action column is sticky on the right so it remains visible even when the table is wider than the screen.

## Important
This package keeps CRUD changes in browser localStorage. It is NOT yet cross-device/server-persistent. Supabase integration can be added next.
