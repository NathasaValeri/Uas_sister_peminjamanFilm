const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Konfigurasi Database Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME, // Pastikan di Vercel diisi: bwzvhs015jo4jophzplb
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST, // bwzvhs015jo4jophzplb-mysql.services.clever-cloud.com
        dialect: 'mysql',
        port: 3306,
        logging: false,
        dialectOptions: { 
            ssl: { rejectUnauthorized: false } 
        }
    }
);

// Model Rental
const Rental = sequelize.define('Rental', {
    movie_id: DataTypes.INTEGER,
    customer_name: DataTypes.STRING,
    rental_date: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.NOW 
    }
}, { 
    tableName: 'rentals', // Pastikan tabel 'rentals' ada di database
    timestamps: false 
});

// Endpoint untuk menambah peminjaman
app.post('/rentals/add', async (req, res) => {
    try {
        const { movie_id, customer_name } = req.body;
        
        if (!movie_id || !customer_name) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        const rental = await Rental.create({ movie_id, customer_name });
        res.status(200).json({ message: "Peminjaman berhasil dicatat", rental });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mencatat peminjaman", error: error.message });
    }
});
module.exports = app;
