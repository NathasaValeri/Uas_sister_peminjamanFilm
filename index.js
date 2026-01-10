const express = require('express');
const app = express();

// Import semua service
const authApp = require('./api/auth-service');
const movieApp = require('./api/movie-service');
const rentalApp = require('./api/rental-service');

// Gabungkan semua route ke satu aplikasi utama
app.use('/auth', authApp);
app.use('/movies', movieApp);
app.use('/rentals', rentalApp);

// Tambahkan route sederhana untuk cek status (Health Check)
app.get('/', (req, res) => {
    res.send('Semua Microservices Rental Film sedang berjalan di 0.0.0.0:8080');
});

// Jalankan hanya SATU listen pada port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Utama berjalan di port ${PORT}`);
});
