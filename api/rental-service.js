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
    movie_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_name: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: true // Kolom createdAt otomatis terisi tanggal & waktu
});

// 1. [CREATE] Catat Peminjaman Baru
app.post('/rentals/add', async (req, res) => {
    try {
        const { movie_id, customer_name } = req.body;
        const rental = await Rental.create({ movie_id, customer_name });
        res.status(201).json({ message: "Peminjaman dicatat", rental });
    } catch (err) {
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
// Hanya jalankan listen jika file ini dipanggil langsung
if (require.main === module) {
    const PORT = process.env.PORT || 3002;
    sequelize.sync().then(() => {
        console.log("Rental Database Synced");
        app.listen(PORT, () => console.log(`Rental Service running on port ${PORT}`));
    }).catch(err => console.log("DB Error: " + err));
}

module.exports = app;
