# PROSES

## 1. Persona dan masalahnya
Persona saya adalah petugas gedung yang perlu mengetahui ketersediaan ruang atau alat pada tanggal tertentu. Sebelumnya, petugas harus melihat daftar peminjaman satu per satu untuk mengetahui slot yang masih tersedia. Karena itu, saya membuat fitur papan ketersediaan agar petugas bisa melihat sisa kapasitas dan status setiap slot secara langsung.

## 2. Rancangan komponen dan state
Pembagian komponen yang saya gunakan:

App.tsx: komponen utama yang menghubungkan data, API, dan komponen lainnya.
SumberDaya.tsx: menampilkan daftar sumber daya dan form untuk menambahkan sumber daya.
FormPeminjaman.tsx: menangani input untuk membuat peminjaman.
DaftarPeminjaman.tsx: menampilkan daftar peminjaman dan menyediakan filter serta detail peminjaman.
api/pinjam.ts: berisi fungsi untuk berkomunikasi dengan backend.

## 3. Satu keputusan desain
(Satu keputusan yang kamu ambil, pilihan lain yang kamu pertimbangkan, dan alasanmu memilih yang ini. Contoh: kenapa daftar peminjaman diambil ulang dari server setelah setiap aksi, bukan hanya diubah di state.)

## 4. Bug atau kendala (minimal dua)
### Bug 1
- Gejala:
- Cara menemukan:
- Penyebab dan solusi:

### Bug 2
- Gejala:
- Cara menemukan:
- Penyebab dan solusi:

## 5. Change request
(Apa yang diminta, bagian kode mana yang kamu ubah, dan satu keputusan desain yang kamu ambil.)
