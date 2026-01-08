const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('mysql://root:EyuPGVRitFScKqqCdVmdXrUtjAYtjmLJ@mainline.proxy.rlwy.net:49790/railway');

const Rental = sequelize.define('Rental', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    movie_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_name: { type: DataTypes.STRING, allowNull: false },
    rental_date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { tableName: 'rentals', timestamps: false });

app.get('/rentals', async (req, res) => res.json(await Rental.findAll()));
app.post('/rentals', async (req, res) => res.json(await Rental.create(req.body)));
app.put('/rentals/:id', async (req, res) => {
    await Rental.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Data Sewa Diupdate" });
});
app.delete('/rentals/:id', async (req, res) => {
    await Rental.destroy({ where: { id: req.params.id } });
    res.json({ message: "Sewa CD Selesai/Dihapus" });
});

app.listen(3002, () => console.log('Rental Service: 3002'));