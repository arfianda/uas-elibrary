# ReadRentFun - E-Library & Komik Digital (Baca Online)

Proyek ini dibuat untuk memenuhi syarat Ujian Akhir Semester (UAS) pada mata kuliah **Pemrograman Web 2**. Sistem ini mengimplementasikan **Decoupled Architecture** yang memisahkan penuh antara Backend API Engine dan Frontend Single Page Application (SPA).

---

## 📝 Deskripsi Proyek & Tema
**ReadRentFun** adalah aplikasi perpustakaan digital (E-Library) dan portal baca komik online. 
* **Pengunjung Publik**: Dapat menjelajahi katalog buku/komik serta membaca bab secara online menggunakan fitur *Digital Reader* interaktif langsung dari browser tanpa perlu login atau mengunduh berkas.
* **Administrator**: Dapat mengelola seluruh katalog data buku, menambahkan genre baru, serta mengelola file bacaan digital melalui halaman Dashboard Admin khusus setelah melakukan autentikasi login yang aman menggunakan Token.

---

## 🛠️ Spesifikasi Teknologi
* **Backend API Engine**: PHP Framework **CodeIgniter 4** (dikonfigurasi murni sebagai RESTful API Server).
* **Frontend SPA**: **VueJS 3** & **Vue Router 4** (di-load via CDN) untuk navigasi cepat tanpa reload halaman (*Single Page Application*).
* **UI Framework**: **TailwindCSS** (di-load via CDN) untuk desain antarmuka modern yang responsif.
* **HTTP Client**: **Axios** (dilengkapi Request & Response Interceptors untuk manajemen otomatis token keamanan).
* **Database**: **MySQL / MariaDB**.

---

## 🌐 Tautan Penting
* **Demo Aplikasi (Live)**: [https://arfiandaworks.my.id/elibrary/](https://arfiandaworks.my.id/elibrary/)
* **Video Presentasi Proyek (YouTube)**: *[Link Video YouTube Menyusul]* <!-- Ganti baris ini dengan link YouTube Anda -->

---

## 📸 Dokumentasi & Screenshot
*(Silakan ganti path berkas gambar di bawah ini dengan screenshot hasil pengerjaan Anda)*

### 1. Skema Relasi Database
![Skema Relasi Database](docs/screenshots/database-relation.png)
*Screenshot rancangan tabel `users`, `genres`, `books`, dan `rentals` pada menu Designer phpMyAdmin.*

### 2. Uji Coba API Proteksi Token (Error 401 Unauthorized via Postman)
![Uji Coba Gagal 401 Postman](docs/screenshots/postman-401-error.png)
*Tangkapan layar ketika mencoba melakukan request mutasi data (seperti POST/PUT/DELETE) ke endpoint backend tanpa menyertakan Authorization Bearer Token.*

### 3. Antarmuka Halaman Login (Frontend)
![Halaman Login](docs/screenshots/login-page.png)
*Tampilan form login admin yang ditenagai TailwindCSS dan divalidasi Axios.*

### 4. Dashboard Admin & Visualisasi Data
![Dashboard Admin](docs/screenshots/admin-dashboard.png)
*Visualisasi statistik ringkasan data buku dan genre pada panel administrator.*

### 5. Form Modal Tambah/Edit Data
![Modal CRUD](docs/screenshots/crud-modal.png)
*Tampilan popup form modal interaktif untuk manipulasi data katalog secara real-time.*

---

## ⚙️ Petunjuk Instalasi Lokal (Localhost Development)

### 1. Prasyarat Sistem
* PHP versi `>= 8.1`
* Composer
* MySQL / MariaDB Server (misalnya menggunakan XAMPP/Laragon)

### 2. Instalasi Backend API (`backend-api`)
1. Buka terminal dan arahkan ke folder backend:
   ```bash
   cd backend-api
   ```
2. Pasang dependensi PHP menggunakan Composer:
   ```bash
   composer install
   ```
3. Salin file `.env.example` atau `env` menjadi `.env`:
   ```bash
   cp env .env
   ```
4. Buka file `.env` dan sesuaikan konfigurasi database lokal Anda:
   ```env
   database.default.hostname = localhost
   database.default.database = uas_elibrary
   database.default.username = root
   database.default.password = 
   database.default.DBDriver = MySQLi
   ```
5. Buat database baru di MySQL lokal Anda bernama `uas_elibrary` dan import berkas SQL:
   * File SQL terletak di: `database/schema.sql` atau `docs/database/schema.sql`.
6. Jalankan server lokal CodeIgniter 4:
   ```bash
   php spark serve
   ```
   *Backend API akan berjalan di URL default: `http://localhost:8080/`*

### 3. Instalasi Frontend Client (`frontend-spa`)
Karena frontend aplikasi ini dirancang sebagai SPA murni tanpa proses kompilasi bundler, menjalankannya sangat mudah:
1. Pastikan server backend Anda di `http://localhost:8080/` sudah aktif.
2. Buka folder `frontend-spa/` di komputer lokal Anda.
3. Jalankan server lokal statis. Anda bisa menggunakan ekstensi **Live Server** di VS Code, atau menggunakan perintah Python/NodeJS di terminal Anda:
   * Menggunakan Node.js `http-server`:
     ```bash
     npx http-server ./frontend-spa -p 3000
     ```
   * Menggunakan Python:
     ```bash
     python -m http.server 3000 --directory ./frontend-spa
     ```
4. Buka browser Anda dan akses: `http://localhost:3000/`
