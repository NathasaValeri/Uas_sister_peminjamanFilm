const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. PERBAIKAN: Gunakan Pool & Tambahkan Konfigurasi SSL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    ssl: {
        rejectUnauthorized: false // WAJIB untuk Clever Cloud
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Gunakan promise wrapper agar lebih stabil
const db = pool.promise();

// 2. Endpoint Register
app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan Password harus diisi" });
    }

    try {
        const query = "INSERT INTO users (email, password) VALUES (?, ?)";
        await db.execute(query, [email, password]);
        res.status(200).json({ message: "User Terdaftar!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal Register", error: err.message });
    }
});

// 3. Endpoint Login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const query = "SELECT * FROM users WHERE email = ? AND password = ?";
        const [results] = await db.execute(query, [email, password]);

        if (results.length > 0) {
            res.status(200).json({ message: "Login Berhasil", user: results[0] });
        } else {
            res.status(401).json({ message: "Email atau Password Salah" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error Server", error: err.message });
    }
});

module.exports = app;
