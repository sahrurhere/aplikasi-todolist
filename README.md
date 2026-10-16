# To-Do List Website — Spesifikasi Proyek

## 1. Ringkasan

Website to-do list sederhana untuk mengelola tugas harian. Pengguna dapat **membuat, melihat, mengubah, dan menghapus (CRUD)** tugas, memberi **status** pada setiap tugas, serta menambahkan **catatan**. Tampilan memakai **tema gelap (dark theme)** dengan warna aksen **`#e7fb5c`**.

---

## 2. Fitur Utama

### 2.1 CRUD Tugas

| Aksi | Deskripsi |
|------|-----------|
| **Create** | Menambah tugas baru lewat form (judul wajib, status & catatan opsional). |
| **Read** | Menampilkan semua tugas dalam bentuk daftar/kartu. |
| **Update** | Mengedit judul, status, dan catatan tugas yang sudah ada. |
| **Delete** | Menghapus tugas, dengan dialog konfirmasi sebelum dihapus. |

### 2.2 Status Tugas

Setiap tugas memiliki satu status:

| Status | Nilai | Keterangan | Warna badge (saran) |
|--------|-------|------------|---------------------|
| None | `none` | Belum ditentukan (default) | Abu-abu `#6b7280` |
| Progres | `progress` | Sedang dikerjakan | Biru `#60a5fa` |
| Pending | `pending` | Tertunda / menunggu | Oranye `#fb923c` |
| Selesai | `done` | Sudah selesai | Aksen `#e7fb5c` |

- Status bisa diubah langsung dari kartu tugas (dropdown atau tombol).
- Tugas berstatus **Selesai** ditampilkan dengan judul dicoret dan opacity lebih rendah.

### 2.3 Catatan

- Setiap tugas bisa memiliki catatan (teks panjang, multi-baris).
- Catatan dapat ditambah, diedit, atau dikosongkan.
- Di daftar, catatan ditampilkan ringkas (maks. 2 baris), dan bisa dibuka penuh (expand / modal).

### 2.4 Fitur Tambahan (Opsional)

- **Filter** berdasarkan status (Semua / None / Progres / Pending / Selesai).
- **Pencarian** berdasarkan judul atau isi catatan.
- **Penghitung** jumlah tugas per status.
- **Urutkan** berdasarkan tanggal dibuat atau status.

---

## 3. Struktur Data

```json
{
  "id": "string (uuid)",
  "title": "string (wajib, maks. 120 karakter)",
  "status": "none | progress | pending | done",
  "note": "string (opsional)",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime",
  "startAt": "string (opsional, format YYYY-MM-DDTHH:mm, waktu lokal)",
  "dueAt": "string (opsional, format YYYY-MM-DDTHH:mm, harus setelah startAt)",
}
```

---

## 4. Desain & Tampilan

### 4.1 Palet Warna (Dark Theme)

| Token | Warna | Penggunaan |
|-------|-------|------------|
| `--bg` | `#0f0f10` | Latar belakang halaman |
| `--surface` | `#1a1a1d` | Kartu tugas, form, modal |
| `--surface-2` | `#242428` | Input, hover kartu |
| `--border` | `#2e2e33` | Garis pembatas |
| `--text` | `#f4f4f5` | Teks utama |
| `--text-muted` | `#a1a1aa` | Teks sekunder, catatan |
| `--accent` | **`#e7fb5c`** | Tombol utama, link, fokus, highlight, badge Selesai |
| `--accent-hover` | `#d4e84a` | Hover tombol aksen |
| `--on-accent` | `#0f0f10` | Teks di atas warna aksen (wajib gelap agar terbaca) |
| `--danger` | `#f87171` | Tombol hapus, pesan error |

```css
:root {
  --bg: #0f0f10;
  --surface: #1a1a1d;
  --surface-2: #242428;
  --border: #2e2e33;
  --text: #f4f4f5;
  --text-muted: #a1a1aa;
  --accent: #e7fb5c;
  --accent-hover: #d4e84a;
  --on-accent: #0f0f10;
  --danger: #f87171;
}
```

### 4.2 Penggunaan Warna Aksen `#e7fb5c`

- **Tombol utama** (Tambah, Simpan): background `#e7fb5c`, teks gelap `#0f0f10`.
- **Tombol sekunder**: background transparan, border & teks `#e7fb5c`.
- **Focus ring** pada input: outline `#e7fb5c`.
- **Filter aktif / tab aktif**: garis bawah atau background `#e7fb5c`.
- **Checkbox / ikon selesai**: `#e7fb5c`.
- **Logo / judul aplikasi**: bisa diberi aksen `#e7fb5c`.

> ⚠️ Jangan gunakan teks putih di atas `#e7fb5c` — kontrasnya rendah. Selalu pakai teks gelap.

### 4.3 Tipografi

- Font: **Inter** atau **Plus Jakarta Sans** (Google Fonts).
- Judul halaman: 28–32px, bold.
- Judul tugas: 16px, semibold.
- Catatan: 14px, warna `--text-muted`.

### 4.4 Komponen UI

- Sudut membulat (`border-radius: 12px` untuk kartu, `8px` untuk tombol/input).
- Transisi halus (150–200ms) untuk hover dan perubahan status.
- Responsif: 1 kolom di mobile, daftar lebar maks. ~720px di desktop.

---

## 5. Layout Halaman

```
┌──────────────────────────────────────────────┐
│  ✓ My To-Do            [ 🔍 Cari tugas...  ] │
├──────────────────────────────────────────────┤
│  [ Judul tugas baru...            ] [Tambah] │
│  [ Catatan (opsional)...                   ] │
├──────────────────────────────────────────────┤
│  Semua(8) | None(2) | Progres(3) | Pending(1) | Selesai(2) │
├──────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────┐ │
│ │ Belanja bahan makanan      [Progres ▾]   │ │
│ │ Beli beras, telur, dan sayur…            │ │
│ │ 15 Okt 2026            [Edit] [Hapus]    │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ ~~Bayar listrik~~          [Selesai ▾]   │ │
│ │ 14 Okt 2026            [Edit] [Hapus]    │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

## 6. Teknologi (Saran)

**Opsi A — Sederhana (tanpa backend)**
- HTML + CSS + JavaScript vanilla
- Penyimpanan: `localStorage`

**Opsi B — Modern frontend**
- React + Vite (atau Next.js)
- Tailwind CSS
- Penyimpanan: `localStorage` atau Supabase / Firebase

**Opsi C — Full-stack**
- Frontend: React / Vue
- Backend: Node.js + Express (atau Laravel)
- Database: SQLite / MySQL / PostgreSQL

### Contoh REST API (untuk Opsi C)

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `GET` | `/api/todos` | Ambil semua tugas (`?status=` untuk filter) |
| `GET` | `/api/todos/:id` | Ambil satu tugas |
| `POST` | `/api/todos` | Tambah tugas baru |
| `PUT` | `/api/todos/:id` | Ubah tugas (judul, status, catatan) |
| `DELETE` | `/api/todos/:id` | Hapus tugas |

---

## 7. Validasi & UX

- Judul tidak boleh kosong; tampilkan pesan error berwarna `--danger`.
- Tekan **Enter** di input judul untuk menambah tugas.
- Konfirmasi sebelum menghapus.
- Tampilkan **empty state** ("Belum ada tugas. Tambahkan tugas pertamamu!") saat daftar kosong.
- Notifikasi singkat (toast) setelah tambah/ubah/hapus berhasil.

---

## 8. Checklist Pengembangan

- [ ] Setup proyek & struktur folder
- [ ] Terapkan variabel warna dark theme + aksen `#e7fb5c`
- [ ] Form tambah tugas (judul + catatan)
- [ ] Tampilkan daftar tugas
- [ ] Ubah status tugas (None / Progres / Pending / Selesai)
- [ ] Edit tugas & catatan
- [ ] Hapus tugas dengan konfirmasi
- [ ] Simpan data (localStorage / database)
- [ ] Filter & pencarian
- [ ] Responsif di mobile
- [ ] Testing semua fitur CRUD
