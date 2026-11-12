# Fajar Januriawan

Portofolio Fajar Januriawan, desainer dan pengembang web yang berbasis di Jakarta.

[Website](https://januriawan.my.id/) · [GitHub](https://github.com/januriawan)

## Tampilan terbaru

![Tampilan desktop portofolio Fajar Januriawan](img/readme/portfolio-desktop.jpg)

<details>
<summary>Tampilan mobile</summary>

![Navbar melayang dan halaman portofolio pada mobile](img/readme/portfolio-mobile.jpg)

</details>

Screenshot diambil dari versi lokal pada 11 November 2026.

## Fitur

- Pilihan English dan Bahasa Indonesia, serta dark mode. Pilihan bahasa dan tema tersimpan di browser.
- Direktori 43 proyek dengan 12 preview, pencarian, filter instansi, detail proyek, dan tampilan gambar penuh.
- Daftar keahlian dalam tujuh kategori, termasuk AI, web, mobile/GIS, basis data, Server & DevOps, infrastruktur, dan desain.
- Sidebar desktop dan navbar melayang di mobile dengan panel menu geser. Avatar menampilkan badge Open to Work saat hover atau fokus keyboard.
- Slider partner menggunakan Swiper, dengan autoplay dan looping di mobile.
- Animasi ilustrasi pantai pada hero dan siluet Jakarta pada Contact, termasuk Monas, gedung Kemendag, KRL, kendaraan, halte, dan pejalan kaki. Animasi menyesuaikan pengaturan reduced motion.
- Formulir kontak menyiapkan draf di aplikasi email pengguna. Pengguna mengirim email melalui aplikasi tersebut.
- Tombol Preview CV di sidebar dan menu mobile membuka pratinjau PDF, dengan pilihan English/Bahasa Indonesia dan unduhan langsung. Kedua PDF berisi profil, skill, riwayat kerja, sosial media, 12 preview, 43 proyek, serta halaman kontak terakhir, lengkap dengan footer dan nomor halaman.

## Menjalankan secara lokal

Jalankan perintah berikut dari direktori project:

```sh
python3 -m http.server 8000
```

Buka [localhost:8000](http://localhost:8000/). Project juga dapat dijalankan melalui MAMP.

Website menggunakan HTML, CSS, dan JavaScript, dengan Swiper dan Font Awesome yang disimpan secara lokal.

## Struktur project

| Lokasi | Isi |
| --- | --- |
| `index.html` | Konten halaman, daftar skill, proyek, dan ilustrasi SVG |
| `css/` | Gaya halaman, tema, animasi, dan stylesheet vendor |
| `js/` | Interaksi, terjemahan EN/ID, galeri proyek, dan Swiper |
| `img/` | Foto profil, logo partner, preview proyek, favicon, dan screenshot README |
| `assets/pdf/` | PDF CV statis versi Inggris dan Indonesia, masing-masing 17 halaman |
| `scripts/build-cv.cjs` | Penyusunan ulang PDF dari konten dan terjemahan website, dijalankan saat pemeliharaan |

Konten utama dapat diperbarui di `index.html`; pasangan terjemahan berada di `js/i18n.js`.

## Memperbarui PDF CV

PDF yang ditampilkan adalah file statis: [English](assets/pdf/fajar-januriawan-cv-en.pdf) dan [Bahasa Indonesia](assets/pdf/fajar-januriawan-cv-id.pdf). Website langsung memuat file tersebut ketika modal dibuka; tidak ada proses pembuatan PDF di browser pengunjung.

Setelah konten CV berubah, susun ulang kedua file menggunakan Node.js dan Playwright:

```sh
npm install --prefix /tmp/januriawan-cv-build playwright
/tmp/januriawan-cv-build/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/januriawan-cv-build/node_modules node scripts/build-cv.cjs
```

Script membaca profil, riwayat kerja, skill, sosial media, preview, serta daftar proyek dari `index.html` dan terjemahan `js/i18n.js`. Script memeriksa jumlah konten dan batas footer sebelum menyimpan PDF. Jika daftar proyek berubah, sesuaikan pemeriksaan jumlah dan tinjau kembali tata letaknya. Untuk memakai Chrome yang sudah terpasang, isi variabel `CHROME_PATH` dengan lokasi executable Chrome.

Lisensi project tersedia di [LICENSE](LICENSE). Lisensi vendor disertakan pada folder masing-masing.
