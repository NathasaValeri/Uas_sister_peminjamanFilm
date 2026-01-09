const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Koneksi ke Clever Cloud menggunakan Environment Variables di Vercel
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
});

db.connect((err) => {
    if (err) console.error("Database Connection Error: " + err.message);
    else console.log("Terhubung ke MySQL Clever Cloud!");
});

// Endpoint Register
app.post('/auth/register', (req, res) => {
    const { email, password } = req.body;
    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(query, [email, password], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal Register", error: err });
        res.status(200).json({ message: "User Terdaftar!" });
    });
});

// Endpoint Login
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: "Error Server", error: err });
        if (results.length > 0) res.status(200).json({ message: "Login Berhasil", user: results[0] });
        else res.status(401).json({ message: "Email atau Password Salah" });
    });
});

module.exports = app;
