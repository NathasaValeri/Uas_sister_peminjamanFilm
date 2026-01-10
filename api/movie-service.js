const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Konfigurasi Database (Pastikan Environment Variables di Vercel sudah diisi)
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: 3306,
        logging: false,
        dialectOptions: {
            ssl: { 
                rejectUnauthorized: false // WAJIB untuk Clever Cloud
            }
        },
        // Tambahan agar koneksi tidak mudah putus di Vercel
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// 2. Definisi Model Movie
const Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    stock: DataTypes.INTEGER
}, { 
    tableName: 'movies', 
    timestamps: false 
});

// FUNGSI SINKRONISASI: Menjamin tabel ada di database
sequelize.sync()
    .then(() => console.log("Database & Tabel Movies siap!"))
    .catch(err => console.error("Gagal sinkronisasi DB: ", err));

// 3. Endpoint: Ambil Semua Film (GET /movies/all)
app.get('/movies/all', async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data", error: error.message });
    }
});

// 4. Endpoint: Tambah Film Baru (POST /movies/add)
app.post('/movies/add', async (req, res) => {
    try {
        const { title, genre, stock } = req.body;
        if (!title || !stock) return res.status(400).json({ message: "Data tidak lengkap" });

        const newMovie = await Movie.create({ title, genre, stock });
        res.status(200).json({ message: "Film berhasil ditambahkan", data: newMovie });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambah film", error: error.message });
    }
});

// 5. Endpoint: Hapus Film (DELETE /movies/delete/:id)
app.delete('/movies/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Movie.destroy({ where: { id: id } });
        
        if (deleted) {
            res.json({ message: "Film berhasil dihapus" });
        } else {
            res.status(404).json({ message: "Film tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus film", error: error.message });
    }
});

// Endpoint Testing
app.get('/movies', (req, res) => {
    res.json({ message: "Movie Service is active" });
});

module.exports = app;
