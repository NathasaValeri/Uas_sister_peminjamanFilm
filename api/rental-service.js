require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- KONEKSI DATABASE ---
const sequelize = new Sequelize(
    'bwzvhs015jo4jophzplb',
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

// --- MODEL RENTAL ---
// Mengaktifkan timestamps: true agar kolom createdAt otomatis ada dan terisi tanggal saat ini
const Rental = sequelize.define('Rental', {
    movie_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_name: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: true // Ini kunci agar tanggal muncul otomatis sebagai 'createdAt'
});

// 1. [CREATE] Catat Peminjaman Baru
app.post('/rentals/add', async (req, res) => {
    try {
        const { movie_id, customer_name } = req.body;
        // createdAt akan terisi otomatis oleh Sequelize
        const rental = await Rental.create({ movie_id, customer_name });
        res.status(201).json({ message: "Peminjaman dicatat", rental });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. [READ] Ambil Semua Riwayat Peminjaman
app.get('/rentals/all', async (req, res) => {
    try {
        // Mengurutkan dari yang terbaru (DESC) agar tanggal terbaru di atas
        const rentals = await Rental.findAll({ order: [['createdAt', 'DESC']] });
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. [UPDATE] Edit Nama Pelanggan (Baru Ditambahkan)
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

// 4. [DELETE] Hapus/Selesaikan Peminjaman
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

// --- RUN SERVER ---
const PORT = 3002; // Hardcode port agar tidak bentrok dengan .env
sequelize.sync().then(() => {
    console.log("Rental Database Synced");
    app.listen(PORT, () => console.log(`Rental Service running on port ${PORT}`));
});

module.exports = app;
