const { Sequelize, DataTypes } = require('sequelize');

// Gunakan URL Railway Anda
const sequelize = new Sequelize('mysql://root:EyuPGVRitFScKqqCdVmdXrUtjAYtjmLJ@mainline.proxy.rlwy.net:49790/railway');

async function migrate() {
    try {
        console.log("Sedang mengubah database...");

        // Membuat Tabel Movies (Pengganti Books)
        const Movie = sequelize.define('Movie', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            title: { type: DataTypes.STRING, allowNull: false },
            genre: { type: DataTypes.STRING, allowNull: false },
            stock: { type: DataTypes.INTEGER, allowNull: false }
        }, { tableName: 'movies', timestamps: false });

        // Membuat Tabel Rentals (Pengganti Loans)
        const Rental = sequelize.define('Rental', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            movie_id: { type: DataTypes.INTEGER, allowNull: false },
            customer_name: { type: DataTypes.STRING, allowNull: false },
            rental_date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
        }, { tableName: 'rentals', timestamps: false });

        // Eksekusi (force: true akan menghapus tabel lama jika namanya sama)
        await sequelize.sync({ force: true }); 
        
        console.log("✅ Database Berhasil Diubah ke Tema Rental CD Film!");
        process.exit();
    } catch (error) {
        console.error("❌ Gagal migrasi:", error);
    }
}

migrate();