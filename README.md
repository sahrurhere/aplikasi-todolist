# To-Do List Website — Dokumentasi Proyek

## 1. Ringkasan

Website to-do list untuk mengelola tugas harian. Pengguna dapat **membuat, melihat, mengubah, dan menghapus (CRUD)** tugas, memberi **status** pada setiap tugas, menambahkan **catatan**, serta mengatur **waktu mulai dan deadline**. Tampilan memakai **tema gelap (dark theme)** dengan warna aksen **`#e7fb5c`**.

Data disimpan di `localStorage` browser, sehingga aplikasi berjalan sepenuhnya di sisi klien tanpa backend.

---

## 2. Fitur

### 2.1 CRUD Tugas

| Aksi | Deskripsi |
|------|-----------|
| **Create** | Menambah tugas baru lewat form (judul wajib; catatan, waktu mulai, dan deadline opsional). Tekan **Enter** di input judul untuk menambah. |
| **Read** | Menampilkan semua tugas dalam bentuk kartu, 2 kartu per baris di layar lebar. |
| **Update** | Mengedit judul, catatan, waktu mulai, dan deadline lewat mode edit di kartu (tombol **Simpan** / **Batal**). Status diubah langsung dari dropdown di kartu. |
| **Delete** | Menghapus tugas setelah konfirmasi lewat modal. |

### 2.2 Status Tugas

Setiap tugas memiliki satu status:

| Status | Nilai | Keterangan | Warna badge |
|--------|-------|------------|-------------|
| None | `none` | Belum ditentukan (default) | Abu-abu `#6b7280` |
| Progres | `progress` | Sedang dikerjakan | Biru `#60a5fa` |
| Pending | `pending` | Tertunda / menunggu | Oranye `#fb923c` |
| Selesai | `done` | Sudah selesai | Aksen `#e7fb5c` |

- Status diubah langsung dari dropdown di kartu; warna dropdown mengikuti status.
- Tugas berstatus **Selesai** ditampilkan dengan judul dicoret dan opacity lebih rendah.

### 2.3 Catatan

- Setiap tugas bisa memiliki catatan multi-baris (baris baru tetap terjaga saat ditampilkan).
- Catatan dapat ditambah, diedit, atau dikosongkan.
- Di kartu, catatan ditampilkan ringkas (maks. 2 baris). Catatan panjang memunculkan tombol **Lihat selengkapnya** yang membuka catatan penuh di modal.

### 2.4 Waktu Mulai & Deadline

- Setiap tugas bisa memiliki **waktu mulai** dan **deadline** (tanggal + jam), keduanya opsional.
- Jika keduanya diisi, deadline **harus setelah** waktu mulai; jika tidak, muncul pesan error.
- Kartu menampilkan jadwal, misalnya `16 Okt 08.00 – 18 Okt 17.00`, `Deadline ...`, atau `Mulai ...`.
- Penanda deadline (tidak berlaku untuk tugas berstatus Selesai):

| Kondisi | Tampilan |
|---------|----------|
| Deadline sudah lewat | Badge **Terlambat**, teks jadwal dan border kartu merah (`--danger`) |
| Deadline kurang dari 24 jam lagi | Badge **< 24 jam** berwarna oranye |

- Penanda diperbarui otomatis setiap menit tanpa perlu me-refresh halaman.

### 2.5 Filter, Pencarian, Penghitung, dan Urutan

- **Tab filter** berdasarkan status: Semua / None / Progres / Pending / Selesai.
- **Penghitung** jumlah tugas di setiap tab, diperbarui otomatis saat status berubah.
- **Pencarian** berdasarkan judul atau isi catatan (tidak membedakan huruf besar/kecil).
- **Urutkan** berdasarkan: Terbaru, Terlama, Status (Progres → Pending → None → Selesai), atau Deadline terdekat (tugas tanpa deadline di bawah).
- Info jumlah tugas yang tampil: "Menampilkan X dari Y tugas".

### 2.6 Notifikasi & Modal

- **Toast** muncul setelah menambah, mengedit, mengubah status, dan menghapus tugas. Hilang otomatis setelah ±2,5 detik, bisa ditutup manual (×), dan beberapa toast bisa tampil bertumpuk.
- **Modal** memakai elemen `<dialog>` bawaan browser:
  - Ditutup dengan tombol, **Escape**, atau klik area gelap di belakangnya.
  - Fokus **Tab** berputar di dalam modal (focus trap).
  - Pada konfirmasi hapus, fokus awal berada di tombol **Batal** agar tidak terhapus tanpa sengaja.
  - Halaman di belakang modal tidak bisa di-scroll selama modal terbuka.

---

## 3. Struktur Data

```json
{
  "id": "string (uuid)",
  "title": "string (wajib, maks. 120 karakter)",
  "status": "none | progress | pending | done",
  "note": "string (opsional)",
  "startAt": "string (opsional, format YYYY-MM-DDTHH:mm, waktu lokal)",
  "dueAt": "string (opsional, format YYYY-MM-DDTHH:mm, harus setelah startAt)",
  "createdAt": "ISO 8601 datetime (UTC)",
  "updatedAt": "ISO 8601 datetime (UTC)"
}
```

Catatan:
- `startAt` dan `dueAt` berisi string kosong `""` jika tidak diisi.
- `startAt` dan `dueAt` disimpan sebagai **waktu lokal** tanpa zona waktu (sesuai keluaran `<input type="datetime-local">`), sedangkan `createdAt` dan `updatedAt` disimpan dalam UTC.
- Data disimpan di `localStorage` dengan kunci `todos`. Data lama yang belum memiliki `startAt`/`dueAt` otomatis dilengkapi dengan string kosong saat dimuat (migrasi data).

---

## 4. Desain & Tampilan

### 4.1 Palet Warna (Dark Theme)

| Token | Warna | Penggunaan |
|-------|-------|------------|
| `--color-bg` | `#0f0f10` | Latar belakang halaman |
| `--color-surface` | `#1a1a1d` | Kartu tugas, form, modal |
| `--color-surface-2` | `#242428` | Input, hover kartu, toast |
| `--color-border` | `#2e2e33` | Garis pembatas |
| `--color-text` | `#f4f4f5` | Teks utama |
| `--color-muted` | `#a1a1aa` | Teks sekunder, catatan |
| `--color-accent` | **`#e7fb5c`** | Tombol utama, link, fokus, tab aktif, badge Selesai |
| `--color-accent-hover` | `#d4e84a` | Hover tombol aksen |
| `--color-on-accent` | `#0f0f10` | Teks di atas warna aksen |
| `--color-danger` | `#f87171` | Tombol hapus, error, penanda Terlambat |
| `--color-status-none` | `#6b7280` | Badge status None |
| `--color-status-progress` | `#60a5fa` | Badge status Progres |
| `--color-status-pending` | `#fb923c` | Badge status Pending, penanda < 24 jam |

Token didefinisikan di blok `@theme` pada `src/index.css` (Tailwind CSS v4), sehingga bisa dipakai sebagai kelas seperti `bg-accent`, `text-muted`, atau `border-border`. Halaman juga memakai `color-scheme: dark` agar elemen bawaan browser (dropdown, pemilih tanggal, scrollbar) ikut bertema gelap.

### 4.2 Penggunaan Warna Aksen `#e7fb5c`

- **Tombol utama** (Tambah, Simpan): background aksen, teks gelap.
- **Tombol sekunder** (Edit, Tutup): border dan teks aksen.
- **Focus ring** pada input dan tombol (keyboard): aksen.
- **Tab filter aktif**: garis bawah dan penghitung beraksen.
- **Badge Selesai** dan **logo** (✓) pada judul aplikasi.

> ⚠️ Jangan gunakan teks putih di atas `#e7fb5c` — kontrasnya rendah. Selalu pakai teks gelap.

### 4.3 Tipografi

- Font: **Plus Jakarta Sans** (Google Fonts), ketebalan 400/500/600/700.
- Judul halaman: 30px (`text-3xl`), bold.
- Judul tugas: 16px, semibold.
- Catatan: 14px, warna `--color-muted`.

### 4.4 Komponen UI & Tata Letak

- Sudut membulat: 12px untuk kartu dan modal, 8px untuk tombol dan input.
- Transisi halus (150–200ms) untuk hover dan perubahan status.
- Animasi masuk untuk toast dan modal; dinonaktifkan otomatis jika pengguna mengaktifkan pengaturan "kurangi gerakan" (*reduced motion*).
- Lebar konten maksimal **960px**.
- **Grid kartu responsif:**
  - Layar < 768px: 1 kolom.
  - Layar ≥ 768px: 2 kartu per baris. Jika jumlah kartu ganjil, kartu terakhir berada di **tengah** dengan lebar yang sama (grid 4 kolom, setiap kartu `col-span-2`, kartu terakhir ganjil `col-start-2`).
  - Kartu dalam satu baris memiliki tinggi yang sama, dan tombol Edit/Hapus selalu sejajar di bagian bawah kartu.
- Dua jenis empty state: "Belum ada tugas" saat daftar kosong, dan "Tidak ada tugas yang cocok" (dengan tombol untuk menampilkan semua) saat filter/pencarian tidak menemukan hasil.

---

## 5. Layout Halaman

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ My To-Do                               [ 🔍 Cari tugas...  ] │
├─────────────────────────────────────────────────────────────────┤
│  [ Judul tugas baru...                              ] [Tambah]  │
│  [ Catatan (opsional)...                                      ] │
│  Waktu mulai (opsional)          Deadline (opsional)            │
│  [ dd/mm/yyyy --:-- ]            [ dd/mm/yyyy --:-- ]           │
├─────────────────────────────────────────────────────────────────┤
│  Semua 5 | None 1 | Progres 2 | Pending 1 | Selesai 1           │
│  Menampilkan 5 dari 5 tugas                 Urutkan [Terbaru ▾] │
├─────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────┐ ┌────────────────────────────┐   │
│ │ Belanja bahan  [Progres ▾] │ │ Laporan KP     [Pending ▾] │   │
│ │ Beli beras, telur, sayur…  │ │ ⏱ Deadline 15 Okt 17.00    │   │
│ │ ⏱ 16 Okt 08.00 – 12.00     │ │   [Terlambat]              │   │
│ │   [< 24 jam]               │ │                            │   │
│ │ Dibuat 15 Okt 2026         │ │ Dibuat 14 Okt 2026         │   │
│ │              [Edit] [Hapus]│ │              [Edit] [Hapus]│   │
│ └────────────────────────────┘ └────────────────────────────┘   │
│ ┌────────────────────────────┐ ┌────────────────────────────┐   │
│ │ ...                        │ │ ...                        │   │
│ └────────────────────────────┘ └────────────────────────────┘   │
│               ┌────────────────────────────┐                    │
│               │ Kartu ke-5 (ganjil, tengah)│                    │
│               └────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                 Toast: [ ✓ Tugas ditambahkan   × ]
```

---

## 6. Teknologi

| Bagian | Pilihan |
|--------|---------|
| Framework UI | **React** |
| Build tool / dev server | **Vite** |
| Styling | **Tailwind CSS v4** (plugin `@tailwindcss/vite`) |
| Penyimpanan | **`localStorage`** |
| Linter | **ESLint** (termasuk aturan React Hooks) |
| Version control | Git + GitHub |

Tidak ada library tambahan untuk ID, tanggal, atau modal; semuanya memakai fitur bawaan browser (`crypto.randomUUID()`, `Intl.DateTimeFormat`, elemen `<dialog>`).

### Pengembangan lanjutan (opsional)

Jika nanti data perlu disinkronkan antar perangkat, penyimpanan bisa dipindah ke backend (misalnya Node.js + Express dengan SQLite/PostgreSQL, atau Supabase/Firebase). Karena semua logika data terpusat di hook `useTodos`, komponen tampilan tidak perlu diubah.

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `GET` | `/api/todos` | Ambil semua tugas (`?status=` untuk filter) |
| `GET` | `/api/todos/:id` | Ambil satu tugas |
| `POST` | `/api/todos` | Tambah tugas baru |
| `PUT` | `/api/todos/:id` | Ubah tugas (judul, status, catatan, jadwal) |
| `DELETE` | `/api/todos/:id` | Hapus tugas |

---

## 7. Struktur Folder

```
aplikasi-todolist/
├── index.html                  # Entry HTML, font Google Fonts
├── vite.config.js              # Konfigurasi Vite + plugin Tailwind
├── package.json
├── README.md
└── src/
    ├── main.jsx                # Entry React, memasang ToastProvider
    ├── App.jsx                 # Layout halaman, state filter/pencarian/urutan
    ├── index.css               # Token tema (@theme), animasi, gaya global
    ├── components/
    │   ├── TodoForm.jsx        # Form tambah tugas
    │   ├── TodoCard.jsx        # Kartu tugas (tampil, edit, hapus, catatan penuh)
    │   ├── DateRangeFields.jsx # Input waktu mulai & deadline
    │   ├── FilterTabs.jsx      # Tab filter status + penghitung
    │   ├── SearchBar.jsx       # Kolom pencarian
    │   ├── Modal.jsx           # Modal berbasis <dialog> + focus trap
    │   └── Toast.jsx           # Satu notifikasi toast
    ├── context/
    │   ├── ToastContext.js     # Context + hook useToast
    │   └── ToastProvider.jsx   # Penyedia & wadah toast
    ├── hooks/
    │   ├── useTodos.js         # CRUD + penyimpanan localStorage + migrasi data
    │   └── useNow.js           # Waktu sekarang, diperbarui setiap menit
    ├── constants/
    │   └── status.js           # Daftar status (nilai, label, warna badge)
    └── utils/
        ├── todoFilters.js      # Hitung per status, filter, cari, urutkan
        └── dates.js            # Format jadwal, validasi, status deadline
```

---

## 8. Validasi & UX

- Judul tidak boleh kosong (termasuk hanya berisi spasi); pesan error berwarna `--danger` dan hilang saat pengguna mengetik lagi.
- Deadline harus setelah waktu mulai (dicek saat menambah dan saat menyimpan edit).
- Tekan **Enter** di input judul untuk menambah tugas.
- Konfirmasi lewat modal sebelum menghapus.
- Empty state saat daftar kosong maupun saat hasil filter/pencarian kosong.
- Toast setelah tambah, ubah, ubah status, dan hapus.
- Aksesibilitas: label/`aria-label` pada semua input, `aria-pressed` pada tab filter, `aria-live` pada wadah toast, focus ring khusus keyboard (`focus-visible`), dan dukungan *reduced motion*.

---

## 9. Menjalankan Proyek

Prasyarat: Node.js dan npm.

```bash
npm install        # install dependensi
npm run dev        # jalankan server pengembangan (http://localhost:5173)
npm run lint       # periksa kode dengan ESLint
npm run build      # build versi produksi ke folder dist/
npm run preview    # jalankan hasil build (http://localhost:4173)
```

---

## 10. Checklist Pengembangan

- [x] Setup proyek & struktur folder (React + Vite + Tailwind CSS v4)
- [x] Terapkan variabel warna dark theme + aksen `#e7fb5c`
- [x] Form tambah tugas (judul + catatan)
- [x] Tampilkan daftar tugas
- [x] Ubah status tugas (None / Progres / Pending / Selesai)
- [x] Edit tugas & catatan
- [x] Hapus tugas dengan konfirmasi (modal)
- [x] Simpan data (localStorage)
- [x] Filter, penghitung, & pencarian
- [x] Urutkan tugas (terbaru, terlama, status, deadline terdekat)
- [x] Toast notifikasi
- [x] Modal aksesibel (Escape, klik latar, focus trap)
- [x] Lihat catatan penuh
- [x] Waktu mulai & deadline, beserta validasinya
- [x] Penanda Terlambat dan < 24 jam yang diperbarui otomatis
- [x] Migrasi data lama ke struktur baru
- [x] Grid 2 kartu per baris, kartu ganjil terakhir di tengah
- [x] Responsif di mobile
- [x] Testing semua fitur CRUD
- [x] Jalankan `npm run lint` dan `npm run build` tanpa error
- [ ] Deploy (Vercel atau GitHub Pages)
