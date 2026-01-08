const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors'); // 1. Tambahkan ini
const app = express();

app.use(cors()); // 2. Tambahkan ini agar frontend bisa akses
app.use(express.json());

// 3. Gunakan process.env agar koneksi ke Railway aman
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
        ssl: { rejectUnauthorized: false } // Wajib untuk Railway
    }
});

// Model harus sesuai dengan input di index.html Anda (email, username, password)
const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false }
});

sequelize.sync();

// Endpoint Register
app.post('/auth/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: "Berhasil Daftar!", user });
    } catch (err) {
        res.status(400).json({ message: "Gagal: " + err.message });
    }
});

// Endpoint Login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    if (user) {
        res.json({ message: "Berhasil Masuk!", user });
    } else {
        res.status(401).json({ message: "Email atau Password Salah!" });
    }
});

module.exports = app;
