const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// KONEKSI DATABASE (Otomatis ambil dari Vercel Environment Variables)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  }
});

// MODEL USER
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

// SYNC DATABASE
sequelize.sync();

// ENDPOINT REGISTER
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    res.json({ message: "Pendaftaran Berhasil", user });
  } catch (err) {
    res.status(400).json({ message: "Email sudah terdaftar atau error", error: err.message });
  }
});

// ENDPOINT LOGIN
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, password } });
  if (user) {
    res.json({ message: "Login Berhasil", token: "token-dummy-123" });
  } else {
    res.status(401).json({ message: "Email atau password salah" });
  }
});

module.exports = app;
