require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// GUNAKAN Router agar bisa digabung di server.js
const router = express.Router();

// --- KONEKSI DATABASE (OTOMATIS) ---
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

// --- MODEL USER ---
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

// Sinkronisasi tabel di background
sequelize.sync();

// --- ENDPOINT REGISTER ---
// Ganti app.post menjadi router.post
router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
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

// EXPORT router (BUKAN app)
module.exports = router;
