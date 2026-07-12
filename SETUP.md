# 📦 Eldemy — Panduan Kontributor

> Baca ini dulu sebelum ngoding. Berlaku buat **dua repo**: `eldemy-backend` & `eldemy-apk`.

## Apa itu Eldemy
Ekosistem edukasi **2-in-1**: **marketplace kursus** (jual-beli kursus, bayar via iPaymu) **+ LMS sekolah** (mapel, tugas, kuis, sampai **generate rapor PDF**). Satu backend Laravel melayani **web** (dashboard instruktur/guru/admin + landing) sekaligus **API** untuk aplikasi mobile.

---

## 🟥 eldemy-backend (Laravel monolith)

**Stack:** PHP **8.2+** · Laravel **12** · MySQL · Sanctum 4 (auth API) · Socialite 5 (Google OAuth) · dompdf 3 (rapor PDF)

**Setup lokal:**
```bash
git clone https://github.com/kiptul/eldemy-backend.git
cd eldemy-backend
composer install
cp .env.example .env          # lalu isi DB LOKAL kamu sendiri
php artisan key:generate
php artisan migrate --seed     # bikin tabel + data demo
php artisan serve              # http://127.0.0.1:8000
```
> ⚠️ `.env` TIDAK ada di repo (rahasia). Buat lokal pakai DB MySQL lokalmu. Kunci iPaymu/Google & detail produksi minta ke owner **secara privat** — **JANGAN pernah commit `.env`.**

---

## 🟦 eldemy-apk (mobile app)

**Stack:** Angular **20** · Ionic **8** (standalone) · Capacitor **8.3** · `@capgo/capacitor-social-login` 8.3 · TypeScript 5.9

**Syarat:** Node.js **20.19+ / 22.12+ / 24** (Angular 20 nolak Node lama — cek `node -v`).

**Setup + jalanin (web):**
```bash
git clone https://github.com/kiptul/eldemy-apk.git
cd eldemy-apk
npm install
npm install -g @ionic/cli      # sekali aja (kalau mau pakai `ionic serve`)
ionic serve                    # http://localhost:8100
```
> Nggak mau install CLI global? Langsung `npm start` (= `ng serve`, jalan di :4200) — sama aja buat dev web.

**Build ke Android:**
```bash
npm run build
npx cap sync android
npx cap open android           # buka Android Studio
```

**apiUrl** ada di `src/environments/`:
- `environment.ts` (dev) → `http://127.0.0.1:8000/api`
- `environment.prod.ts` (rilis) → domain produksi (dari owner)

---

## ☁️ Produksi / database
Info produksi — **domain, lokasi server, nama database yang bener, kredensial** — **minta ke owner secara PRIVAT** (nggak ditaruh di repo demi keamanan).

> 🚨 **PENTING:** ada **database lama** (versi Course-only) yang skema-nya beda total. **JANGAN dipakai** — bikin aplikasi baru rusak. Owner bakal kasih tau nama DB yang bener.

---

## 🚧 Status terkini (dari owner)
Owner lagi **restrukturisasi data course & mapel** di database produksi.
- **Jangan ubah struktur tabel `courses` / `mapel` / `kelas` tanpa koordinasi** — bisa bentrok.
- Kerjain fitur di **branch baru + Pull Request**, jangan langsung push `main`.

---

## ⚠️ Konvensi WAJIB (biar nggak ngerusak)

1. **Angular 20**: `main.ts` WAJIB ada `provideZoneChangeDetection()` — kalau ilang, change detection mati & UI macet. Pakai **`IonicModule`**, jangan campur `@ionic/angular/standalone`.
2. **Tiap page** wajib `addIcons({...})` di constructor (ikon ionicons nggak global).
3. **Pola lifecycle**: `ngOnInit` + `ionViewWillEnter` (pakai guard) — lifecycle webview kadang flaky.
4. **`courses.tipe`**: `kursus` (marketplace) vs `mapel` (LMS sekolah). Selalu pakai scope `Course::kursus()` / `Course::tipeMapel()`.
5. **Role**: `admin` / `guru` / `siswa` (sekolah, login NIS) + `student` (pembeli marketplace) + `instructor` (pengajar marketplace).
6. **Design system**: pink `#F06292` / `#c92f6b`, background cream `#fdf8f0`, font **Outfit** (judul) / **Inter** (body). Jangan bikin tema/warna baru.
7. **Produksi HTTPS**: `AppServiceProvider` ada `URL::forceScheme('https')` — jangan diutak-atik.

---

## 🔑 Akun demo (hasil `migrate --seed`, buat testing LOKAL)
| Role | Login | Password |
|---|---|---|
| Admin | admin@eldemy.sch.id | admin123 |
| Guru | guru1@eldemy.sch.id | guru123 |
| Instruktur | instruktur.rina@eldemy.com | password123 |
| Siswa (NIS) | ipa3 | 123456 |

*(Ini akun data dummy lokal, bukan akun produksi.)*
