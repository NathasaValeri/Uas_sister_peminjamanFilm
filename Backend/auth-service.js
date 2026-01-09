const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
app.use(express.json());

// --- PERBAIKAN KONEKSI DATABASE ---
const sequelize = new Sequelize(
  'bwzvhs015jo4jophzplb',        
  process.env.DB_USER,           
  process.env.DB_PASSWORD,       
  {
    host: 'bwzvhs015jo4jophzplb-mysql.services.clever-cloud.com',
    dialect: 'mysql',
    port: 3306,
    logging: false,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  }
);

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING }
}, { timestamps: false });

// Endpoint Login (Contoh)
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, password } });
  if (user) res.json({ message: "Login Berhasil", user });
  else res.status(401).json({ message: "Email atau Password Salah" });
});

// --- PERBAIKAN PORT ---
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
});
