# Panduan Deploy ke Vercel (vercel.app)

Proyek ini telah dikonfigurasi secara lengkap agar dapat langsung di-*deploy* ke **Vercel** dengan arsitektur Vite SPA + Vercel Serverless Function (`/api/generate-story`).

---

## Langkah 1: Push Proyek ke GitHub
1. Buat repository baru di GitHub (misal: `generator-cerpen-ai`).
2. Push seluruh file proyek ini ke repository tersebut:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Generator Cerpen AI"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

---

## Langkah 2: Import Proyek di Vercel
1. Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Cari dan pilih repository GitHub yang baru saja Anda buat (`Import`).

---

## Langkah 3: Pengaturan Environment Variables (PENTING)
Sebelum mengklik Deploy, tambahkan Environment Variable berikut di bagian **Environment Variables**:
- **Key (Name):** `GEMINI_API_KEY`
- **Value:** Kunci API Google Gemini Anda (dapatkan gratis di [Google AI Studio](https://aistudio.google.com/app/apikey)).

---

## Langkah 4: Deploy
1. Klik tombol **"Deploy"**.
2. Vercel akan otomatis menjalankan build dan membuat Serverless Function.
3. Setelah selesai, aplikasi Anda langsung aktif di domain:
   `https://nama-proyek-anda.vercel.app`

---

## Struktur Konfigurasi yang Telah Disediakan & Diperbaiki:
- `vercel.json` : Mengatur routing SPA yang aman tanpa menimpa asset statis (`/assets/*.js`, `/assets/*.css`), sehingga mencegah terjadinya layar putih/blank saat dibuka di browser.
- `/api/generate-story.ts` : Handler serverless endpoint untuk komunikasi aman dengan Google Gemini API tanpa mengekspos API Key ke browser.

---

## Catatan Perbaikan Blank Screen:
Masalah layar blank sebelumnya disebabkan oleh konfigurasi *rewrites* wildcard di `vercel.json` yang secara tidak sengaja mengarahkan berkas JavaScript/CSS statis ke `index.html`. Hal ini kini telah diperbaiki dengan pola *negative lookahead* `((?!api/|assets/|.*\\..*).*)` sehingga Vercel menyajikan berkas JavaScript/CSS asli dengan *MIME type* yang benar.
