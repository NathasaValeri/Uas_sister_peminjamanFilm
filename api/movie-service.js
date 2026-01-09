const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors'); // Tambahkan CORS agar bisa diakses dari Frontend
const app = express();

app.use(cors());
app.use(express.json());

// Menggunakan Environment Variables untuk keamanan
const sequelize = new Sequelize(
    process.env.DB_NAME, // 'bwzvhs015jo4jophzplb'
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST, // 'bwzvhs015jo4jophzplb-mysql.services.clever-cloud.com'
        dialect: 'mysql',
        port: 3306,
        logging: false,
        dialectOptions: {
            ssl: { rejectUnauthorized: false }
        }
    }
);

const Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    stock: DataTypes.INTEGER
}, { 
    tableName: 'movies', // Pastikan nama tabel di database sama
    timestamps: false 
});

// Get All Movies
app.get('/movies/all', async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data film", error: error.message });
    }
});

// Tambahkan rute dasar untuk tes (opsional)
app.get('/movies', (req, res) => {
    res.json({ message: "Movie Service is active" });
});

// PENTING UNTUK VERCEL: 
// Jangan gunakan app.listen(). Cukup ekspor app.
module.exports = app;
