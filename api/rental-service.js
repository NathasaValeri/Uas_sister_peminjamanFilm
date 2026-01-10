require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- KONEKSI DATABASE ---
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
    timestamps: true,
    freezeTableName: true // Memaksa nama tabel tetap 'Rental' (bukan Rentals)
});

// --- ENDPOINTS ---
app.post('/rentals/add', async (req, res) => {
    try {
        const { movie_id, customer_name } = req.body;
        const rental = await Rental.create({ 
            movie_id: parseInt(movie_id), 
            customer_name 
        });
        res.status(201).json({ message: "Peminjaman dicatat", rental });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/rentals/all', async (req, res) => {
    try {
        const rentals = await Rental.findAll({ order: [['createdAt', 'DESC']] });
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SYNC OTOMATIS ---
if (require.main === module) {
    const PORT = process.env.PORT || 3002;
    // force: true akan menghapus dan membuat ulang tabel sesuai model di atas
    sequelize.sync({ force: true }).then(() => {
        console.log("Database Rental Berhasil Dibuat Otomatis!");
        app.listen(PORT, () => console.log(`Rental Service running on port ${PORT}`));
    }).catch(err => console.error("Gagal Sinkronisasi DB:", err));
}

module.exports = app;
