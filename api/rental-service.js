require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- KONEKSI DATABASE (OTOMATIS CLEVER CLOUD) ---
const sequelize = new Sequelize(
    process.env.MYSQL_ADDON_DB || 'bwzvhs015jo4jophzplb', 
    process.env.MYSQL_ADDON_USER, 
    process.env.MYSQL_ADDON_PASSWORD, 
    {
        host: process.env.MYSQL_ADDON_HOST, 
        dialect: 'mysql',
        port: process.env.MYSQL_ADDON_PORT || 3306,
        logging: false,
        dialectOptions: { ssl: { rejectUnauthorized: false } }
    }
);

// --- MODEL RENTAL ---
const Rental = sequelize.define('Rental', {
    // Gunakan movie_id sesuai dengan kolom di PHPMyAdmin
    movie_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_name: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: true // Menghasilkan kolom createdAt & updatedAt secara otomatis
});

// 1. [CREATE] Catat Peminjaman Baru
app.post('/rentals/add', async (req, res) => {
    try {
        const { movie_id, customer_name } = req.body;
        // Pastikan movie_id dikirim sebagai angka
        const rental = await Rental.create({ 
            movie_id: parseInt(movie_id), 
            customer_name 
        });
        res.status(201).json({ message: "Peminjaman dicatat", rental });
    } catch (err) {
        // Log ini akan muncul di dashboard Clever Cloud menu "Logs"
        console.error("Error saat simpan rental:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. [READ] Ambil Semua Riwayat Peminjaman
app.get('/rentals/all', async (req, res) => {
    try {
        const rentals = await Rental.findAll({ order: [['createdAt', 'DESC']] });
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. [UPDATE] Edit Nama Pelanggan
app.put('/rentals/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_name } = req.body;
        const rental = await Rental.findByPk(id);
        
        if (rental) {
            await rental.update({ customer_name });
            res.json({ message: "Nama pelanggan diperbarui!", rental });
        } else {
            res.status(404).json({ message: "Data tidak ditemukan" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. [DELETE] Hapus Peminjaman
app.delete('/rentals/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rental = await Rental.findByPk(id);
        if (rental) {
            await rental.destroy();
            res.json({ message: "Data peminjaman dihapus!" });
        } else {
            res.status(404).json({ message: "Data tidak ditemukan" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SYNC & RUN SERVER ---
// Tambahkan proteksi agar tidak bentrok dengan index.js
if (require.main === module) {
    const PORT = process.env.PORT || 3002;
    // alter: true akan memperbaiki kolom tabel secara otomatis jika ada yang beda
    sequelize.sync({ alter: true }).then(() => {
        console.log("Rental Database Synced");
        app.listen(PORT, () => console.log(`Rental Service running on port ${PORT}`));
    }).catch(err => console.log("DB Error: " + err));
}

module.exports = app;
