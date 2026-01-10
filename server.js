require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Tambahkan ini agar Frontend Vercel bisa akses
const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Mengizinkan request dari domain lain (Vercel)
app.use(express.json()); // Agar server bisa membaca data JSON yang dikirim frontend

// --- IMPORT SERVICE ---
// Pastikan di dalam file ini menggunakan module.exports = router;
const authRoute = require('./api/auth-service');
const movieRoute = require('./api/movie-service');
const rentalRoute = require('./api/rental-service');

// --- ROUTING ---
app.use('/auth', authRoute);
app.use('/movies', movieRoute);
app.use('/rentals', rentalRoute);

// Health Check
app.get('/', (req, res) => {
    res.json({
        status: "Online",
        message: "API Gateway Rental Film berjalan",
        services: ["Auth", "Movies", "Rentals"]
    });
});

// --- RUN SERVER ---
// Gunakan port dari environment (Clever Cloud akan memberikan port otomatis)
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 Gateway Server siap di port: ${PORT}`);
    console.log(`-----------------------------------------`);
});
