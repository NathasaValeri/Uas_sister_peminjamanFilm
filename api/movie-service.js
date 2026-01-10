require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- KONEKSI DATABASE ---
const sequelize = new Sequelize(
    process.env.DB_NAME || 'bwzvhs015jo4jophzplb',
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: 'bwzvhs015jo4jophzplb-mysql.services.clever-cloud.com',
        dialect: 'mysql',
        port: 3306,
        logging: false,
        dialectOptions: { ssl: { rejectUnauthorized: false } }
    }
);

// --- MODEL MOVIE ---
const Movie = sequelize.define('Movie', {
    title: { type: DataTypes.STRING, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false });

// 1. [CREATE] Tambah Film Baru
app.post('/movies/add', async (req, res) => {
    try {
        const { title, genre, stock } = req.body;
        const movie = await Movie.create({ title, genre, stock });
        res.status(201).json({ message: "Film berhasil ditambahkan!", movie });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. [READ] Ambil Semua Film
app.get('/movies/all', async (req, res) => {
    try {
        const movies = await Movie.findAll();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. [UPDATE] Ubah Data Film (berdasarkan ID)
app.put('/movies/update/:id', async (req, res) => {
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

// 4. [DELETE] Hapus Film (berdasarkan ID)
app.delete('/movies/delete/:id', async (req, res) => {
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

// --- RUN SERVER ---
const PORT = process.env.PORT || 3001;
sequelize.sync().then(() => {
    console.log("Movie Database & Table Synced");
    app.listen(PORT, () => console.log(`Movie Service running on port ${PORT}`));
}).catch(err => console.log("DB Connection Error: " + err));

module.exports = app;
