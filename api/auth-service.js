require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- KONEKSI DATABASE (OTOMATIS CLEVER CLOUD) ---
const sequelize = new Sequelize(
    // Menggunakan variabel standar dari Add-on MySQL Clever Cloud
    process.env.MYSQL_ADDON_DB || process.env.DB_NAME, 
    process.env.MYSQL_ADDON_USER || process.env.DB_USER, 
    process.env.MYSQL_ADDON_PASSWORD || process.env.DB_PASSWORD, 
    {
        host: process.env.MYSQL_ADDON_HOST || process.env.DB_HOST,
        port: process.env.MYSQL_ADDON_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            // Penting agar koneksi ke Clever Cloud stabil
            ssl: { rejectUnauthorized: false }
        }
    }
);

// --- MODEL USER ---
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

// --- ENDPOINT REGISTER ---
app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "Email sudah terdaftar!" });
        }
        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: "User Terdaftar!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Gagal daftar", error: error.message });
    }
});

// --- ENDPOINT LOGIN ---
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email, password } });
        if (user) {
            res.json({ 
                message: "Login Berhasil", 
                user: { id: user.id, username: user.username, email: user.email } 
            });
        } else {
            res.status(401).json({ message: "Email atau Password Salah" });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
});

// --- SYNC & RUN SERVER ---
// Jangan jalankan app.listen jika file ini di-require oleh index.js (menghindari port bentrok)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    sequelize.sync().then(() => {
        console.log("Database Sync (Auth Service)");
        app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
    }).catch(err => console.error("Database Error:", err));
}

module.exports = app;
