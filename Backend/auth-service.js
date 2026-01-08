const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('mysql://root:EyuPGVRitFScKqqCdVmdXrUtjAYtjmLJ@mainline.proxy.rlwy.net:49790/railway');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'users', timestamps: false });

app.post('/register', async (req, res) => {
    try {
        await User.create(req.body);
        res.json({ message: "Registrasi Akun Rental Berhasil!" });
    } catch (err) { res.status(400).json({ message: "Email sudah terdaftar!" }); }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email, password: req.body.password } });
    if (user) res.json({ message: "Selamat Datang Admin Rental!", user });
    else res.status(401).json({ message: "Email/Password salah!" });
});

app.listen(3000, () => console.log('Auth Service: 3000'));