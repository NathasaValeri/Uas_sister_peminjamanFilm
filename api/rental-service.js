require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- KONFIGURASI KONEKSI DATABASE (Kredensial Terbaru) ---
const DB_NAME = process.env.MYSQL_ADDON_DB || 'bwzvhs015jo4jophzplb';
const DB_USER = process.env.MYSQL_ADDON_USER || 'unzdnmar9xi9kwzh';
const DB_PASS = process.env.MYSQL_ADDON_PASSWORD || 'ZPEQYCF6ec6I2j3e47MU';
const DB_HOST = process.env.MYSQL_ADDON_HOST || 'bwzvhs015jo4jophzplb-mysql.services.clever-cloud.com';
const DB_PORT = process.env.MYSQL_ADDON_PORT || 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mysql',
    port: DB_PORT,
    logging: false,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// --- MODEL RENTAL ---
const Rental = sequelize.define('Rental', {
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    freezeTableName: true 
});

// --- ENDPOINTS ---

app.get('/', (req, res) => {
    res.send("Rental Service is Running and Connected to Cloud!");
});

// Create: Catat Peminjaman
app.post('/rentals/add', async (req, res) => {
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
app.get('/rentals/all', async (req, res) => {
    try {
        const rentals = await Rental.findAll({ order: [['createdAt', 'DESC']] });
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete: Hapus Riwayat
app.delete('/rentals/delete/:id', async (req, res) => {
    try {
        await Rental.destroy({ where: { id: req.params.id } });
        res.json({ message: "Data dihapus." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RUN SERVER ---
const PORT = process.env.PORT || 3002;

sequelize.sync({ alter: true })
    .then(() => {
        console.log("---------------------------------------");
        console.log("✅ DATABASE: Koneksi Berhasil (User: unzdnmar9xi9kwzh)");
        console.log("✅ STATUS: Tabel Rental Siap!");
        app.listen(PORT, () => {
            console.log(`🚀 SERVER: Berjalan di port ${PORT}`);
            console.log("---------------------------------------");
        });
    })
    .catch(err => {
        console.error("❌ KONEKSI GAGAL:", err.message);
    });
