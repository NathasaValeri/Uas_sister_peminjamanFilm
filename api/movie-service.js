require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// GUNAKAN Router, jangan app baru agar bisa digabung di Gateway
const router = express.Router();

// --- KONEKSI DATABASE ---
const sequelize = new Sequelize(
    process.env.MYSQL_ADDON_DB || 'bwzvhs015jo4jophzplb', // Sesuaikan dengan variabel Clever Cloud
    process.env.MYSQL_ADDON_USER || 'unzdnmar9xi9kwzh',
    process.env.MYSQL_ADDON_PASSWORD || 'ZPEQYCF6ec6I2j3e47MU',
    {
        host: process.env.MYSQL_ADDON_HOST || 'bwzvhs015jo4jophzplb-mysql.services.clever-cloud.com',
        dialect: 'mysql',
        port: 3306,
        logging: false,
        dialectOptions: { 
            ssl: { rejectUnauthorized: false } 
        }
    }
);

// --- MODEL MOVIE ---
const Movie = sequelize.define('Movie', {
    title: { type: DataTypes.STRING, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false });

// Sinkronisasi Tabel (Hanya jalankan di background)
sequelize.sync();

// --- ROUTES ---

// 1. [CREATE] Tambah Film Baru
router.post('/add', async (req, res) => {
    try {
        const { title, genre, stock } = req.body;
        const movie = await Movie.create({ title, genre, stock });
        res.status(201).json({ message: "Film berhasil ditambahkan!", movie });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. [READ] Ambil Semua Film
router.get('/all', async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. [UPDATE] Ubah Data Film
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, genre, stock } = req.body;
        const movie = await Movie.findByPk(id);
        if (movie) {
            await movie.update({ title, genre, stock });
            res.json({ message: "Film berhasil diperbarui!", movie });
        } else {
            res.status(404).json({ message: "Film tidak ditemukan" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. [DELETE] Hapus Film
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByPk(id);
        if (movie) {
            await movie.destroy();
            res.json({ message: "Film berhasil dihapus!" });
        } else {
            res.status(404).json({ message: "Film tidak ditemukan" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// EXPORT router agar bisa dipakai di server.js
module.exports = router;
