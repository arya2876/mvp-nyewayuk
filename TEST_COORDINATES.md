# Testing Coordinate Consistency - LANGKAH DEMI LANGKAH

## 🔍 PROBLEM: Barang tidak muncul padahal upload & search di lokasi yang sama

## 📝 CARA TEST:

### 1️⃣ UPLOAD BARANG (Simpan koordinat)
1. Buka browser, tekan **F12** untuk buka Developer Console
2. Klik tab **Console**
3. Klik tombol **"Sewakan Barang"**
4. Di form upload, klik **"📍 Deteksi Lokasi Saya"**
5. **CATAT** log yang muncul di console:
   ```
   📍 UPLOAD FORM: Detected GPS [-7.xxxx, 110.xxxx]
   📍 UPLOAD FORM: Nearest district "xxx" at [-7.xxxx, 110.xxxx]
   📍 UPLOAD FORM: Distance X.XXkm
   📍 UPLOAD FORM: Will save coordinates: [-7.xxxx, 110.xxxx]
   ```
6. Isi semua field (judul, brand, model, harga, upload foto)
7. Klik **"Sewakan Barang"** untuk save
8. Lihat log:
   ```
   ✅ LISTING CREATED: "nama barang" at coordinates [-7.xxxx, 110.xxxx] (Kecamatan, Kota)
   ```

### 2️⃣ SEARCH BARANG (Filter berdasarkan lokasi)
1. Refresh halaman utama (tetap buka Console)
2. Klik **"Deteksi Lokasi Saya"** di search bar
3. **CATAT** log yang muncul:
   ```
   Detected coordinates: -7.xxxx, 110.xxxx
   Nearest landmark: Kampus Udinus Semarang (atau landmark terdekat)
   ```
4. Klik tombol **"Cari"** atau tekan Enter
5. **LIHAT** log filtering di console:
   ```
   🔍 Filtering by location: User at [-7.xxxx, 110.xxxx]
   📍 Listing "nama barang": [-7.xxxx, 110.xxxx] = X.XXkm dari user
   ✅ Found X listings within 10km
   ```

## 🎯 YANG HARUS DICEK:

### ✅ KOORDINAT HARUS SAMA FORMAT:
- **Upload**: `[-7.xxxx, 110.xxxx]`
- **Search**: `[-7.xxxx, 110.xxxx]`
- **Format HARUS**: `[latitude, longitude]` (latitude dulu, longitude kedua)

### ✅ JARAK HARUS MASUK AKAL:
- Jika Anda upload & search di lokasi yang sama: **jarak < 1km**
- Jika jarak > 10km: barang **TIDAK** akan muncul
- Jika jarak > 100km: kemungkinan **lat/lng terbalik**

### ❌ KOORDINAT SEMARANG (Reference):
- **Latitude**: -6.9 sampai -7.1 (NEGATIF, karena selatan equator)
- **Longitude**: 110.3 sampai 110.5 (POSITIF)
- Contoh: Kampus Udinus = `[-6.9825, 110.4093]`

## 🐛 JIKA MASIH ERROR:

**Screenshot dan kirim:**
1. Console log saat upload (langkah 1)
2. Console log saat search (langkah 2)
3. Koordinat yang tercatat di kedua step

**Kemungkinan masalah:**
- Koordinat tersimpan dalam format berbeda
- Urutan lat/lng terbalik
- District coordinates di indonesia-locations.json tidak akurat

