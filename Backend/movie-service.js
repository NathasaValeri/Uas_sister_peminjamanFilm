const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('mysql://root:EyuPGVRitFScKqqCdVmdXrUtjAYtjmLJ@mainline.proxy.rlwy.net:49790/railway');

// Menggunakan tabel 'movies'
const Movie = sequelize.define('Movie', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: false }, // Pengganti Author
    stock: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'movies', timestamps: false });

app.get('/movies', async (req, res) => res.json(await Movie.findAll()));
app.get('/movies/:id', async (req, res) => res.json(await Movie.findByPk(req.params.id)));
app.post('/movies', async (req, res) => res.json(await Movie.create(req.body)));
app.put('/movies/:id', async (req, res) => {
    await Movie.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Koleksi CD Diperbarui" });
});
app.delete('/movies/:id', async (req, res) => {
    await Movie.destroy({ where: { id: req.params.id } });
    res.json({ message: "CD Film Dihapus" });
});

app.listen(3001, () => console.log('Movie Service: 3001'));