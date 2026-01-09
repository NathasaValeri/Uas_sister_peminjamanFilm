const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
app.use(express.json());

const sequelize = new Sequelize(
  'bwzvhs015jo4jophzplb',
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'bwzvhs015jo4jophzplb-mysql.services.clever-cloud.com',
    dialect: 'mysql',
    port: 3306,
    logging: false,
    dialectOptions: { ssl: { rejectUnauthorized: false } }
  }
);

const Rental = sequelize.define('Rental', {
  movie_id: DataTypes.INTEGER,
  customer_name: DataTypes.STRING,
  rental_date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { timestamps: false });

// Add Rental
app.post('/rentals/add', async (req, res) => {
  const rental = await Rental.create(req.body);
  res.json({ message: "Peminjaman dicatat", rental });
});

const PORT = process.env.PORT || 3002;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Rental Service running on port ${PORT}`));
});