const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Konfigurasi Database (Menggunakan Environment Variables Vercel)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    // Menambahkan keepAlive agar koneksi tidak mudah terputus di serverless
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error("Database Connection Error: " + err.message);
    } else {
        console.log("Terhubung ke MySQL Clever Cloud!");
    }
});

// Endpoint Register
// PERBAIKAN: Gunakan rute yang sesuai dengan pemanggilan dari frontend
app.post('/auth/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan Password harus diisi" });
    }

    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Gagal Register", error: err.message });
        }
        res.status(200).json({ message: "User Terdaftar!" });
    });
});

// Endpoint Login
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error Server", error: err.message });
        }
        if (results.length > 0) {
            res.status(200).json({ message: "Login Berhasil", user: results[0] });
        } else {
            res.status(401).json({ message: "Email atau Password Salah" });
        }
    });
});

// Penting: Selalu ekspor app agar Vercel bisa menjalankan sebagai Serverless Function
module.exports = app;
