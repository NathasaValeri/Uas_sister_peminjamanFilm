const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Konfigurasi Database (Gunakan Environment Variables Vercel)
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
            ssl: { rejectUnauthorized: false } 
        },
        // Optimasi untuk Vercel Serverless
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// 2. Model Rental
const Rental = sequelize.define('Rental', {
    movie_id: DataTypes.INTEGER,
    customer_name: DataTypes.STRING,
    rental_date: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.NOW 
    }
}, { 
    tableName: 'rentals', 
    timestamps: false 
});

// OTO-SINKRON: Membuat tabel secara otomatis jika belum ada di Clever Cloud
sequelize.sync()
    .then(() => console.log("Tabel Rentals siap digunakan!"))
    .catch(err => console.error("Gagal sinkronisasi DB Rentals: ", err));

// 3. Endpoint: Ambil Semua Data Peminjaman (GET /rentals/all)
app.get('/rentals/all', async (req, res) => {
    try {
        const rentals = await Rental.findAll();
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data", error: error.message });
    }
});

// 4. Endpoint: Tambah Peminjaman (POST /rentals/add)
app.post('/rentals/add', async (req, res) => {
    try {
        const { movie_id, customer_name } = req.body;
        
        if (!movie_id || !customer_name) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        const rental = await Rental.create({ 
            movie_id: parseInt(movie_id), 
            customer_name 
        });
        res.status(200).json({ message: "Peminjaman berhasil dicatat", rental });
    } catch (error) {
        res.status(500).json({ message: "Gagal mencatat peminjaman", error: error.message });
    }
});

// 5. Endpoint: Hapus Peminjaman (DELETE /rentals/delete/:id)
app.delete('/rentals/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Rental.destroy({ where: { id: id } });
        
        if (deleted) {
            res.json({ message: "Data peminjaman dihapus" });
        } else {
            res.status(404).json({ message: "Data tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus data", error: error.message });
    }
});

module.exports = app;
