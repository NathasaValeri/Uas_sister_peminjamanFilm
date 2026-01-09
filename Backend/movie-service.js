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

const Movie = sequelize.define('Movie', {
  title: DataTypes.STRING,
  genre: DataTypes.STRING,
  stock: DataTypes.INTEGER
}, { timestamps: false });

// Get All Movies
app.get('/movies/all', async (req, res) => {
  const movies = await Movie.findAll();
  res.json(movies);
});

const PORT = process.env.PORT || 3001; // Port cadangan jika running lokal
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Movie Service running on port ${PORT}`));
});
