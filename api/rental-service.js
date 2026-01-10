require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// GUNAKAN Router agar bisa di-import ke server.js utama
const router = express.Router();

// --- KONEKSI DATABASE ---
const sequelize = new Sequelize(
    process.env.MYSQL_ADDON_DB || 'bwzvhs015jo4jophzplb',
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

// --- MODEL RENTAL ---
const Rental = sequelize.define('Rental', {
    movie_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_name: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: true, 
    freezeTableName: true 
});

// Sinkronisasi tabel di background
sequelize.sync({ alter: true });

// --- ENDPOINTS (Ganti 'app' menjadi 'router') ---

router.get('/test', (req, res) => {
    res.send("Rental Service is Active!");
});

// Create: Catat Peminjaman
router.post('/add', async (req, res) => {
    try {
        const { movie_id, customer_name } = req.body;
        if (!movie_id || !customer_name) {
            return res.status(400).json({ error: "Data tidak lengkap!" });
        }
        const newRental = await Rental.create({
            movie_id: parseInt(movie_id),
            customer_name: customer_name
        });
        res.status(201).json({ message: "Peminjaman Berhasil!", data: newRental });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read: Ambil Semua Data
router.get('/all', async (req, res) => {
    try {
        const rentals = await Rental.findAll({ order: [['createdAt', 'DESC']] });
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete: Hapus Riwayat
router.delete('/delete/:id', async (req, res) => {
    try {
        await Rental.destroy({ where: { id: req.params.id } });
        res.json({ message: "Data dihapus." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// EXPORT router
module.exports = router;
