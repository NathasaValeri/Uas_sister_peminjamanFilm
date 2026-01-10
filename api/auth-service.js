require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());

// --- PERBAIKAN CORS ---
// Ini sangat penting agar Vercel bisa mengakses Clever Cloud tanpa diblokir
app.use(cors({
    origin: '*', // Mengizinkan semua domain (termasuk Vercel) untuk tahap development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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
        dialectOptions: { 
            ssl: { rejectUnauthorized: false } 
        },
        // Tambahkan pool agar koneksi tidak mudah putus (Timeout)
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// --- MODEL USER ---
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
}, { 
    timestamps: true, // Sebaiknya true agar kita tahu kapan user mendaftar
    freezeTableName: true // Memastikan nama tabel tetap 'User'
});

// --- ENDPOINT REGISTER ---
app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }
        
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "Email sudah terdaftar!" });
        }
        
        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: "User Terdaftar!", user: { id: newUser.id, username, email } });
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
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    // Gunakan alter: true agar jika ada perubahan kolom (seperti timestamps), DB otomatis update
    sequelize.sync({ alter: true }).then(() => {
        console.log("Database Sync (Auth Service)");
        app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
    }).catch(err => console.error("Database Error:", err));
}

module.exports = app;
