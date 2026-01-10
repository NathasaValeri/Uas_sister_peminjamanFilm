require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- KONEKSI DATABASE (OTOMATIS) ---
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
        
        // Cek jika user sudah ada
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
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    console.log("Database & Tabel Berhasil Disinkronisasi");
    app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
}).catch(err => {
    console.error("Gagal koneksi ke database:", err);
});

module.exports = app; 
