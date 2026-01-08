const { Sequelize } = require('sequelize');

// Koneksi ke Database Railway Anda
const sequelize = new Sequelize('mysql://root:EyuPGVRitFScKqqCdVmdXrUtjAYtjmLJ@mainline.proxy.rlwy.net:49790/railway');

async function hapusTabelLama() {
    try {
        console.log("Menghubungkan ke Railway...");
        
        // Perintah SQL untuk menghapus tabel
        // Foreign Key Check di-disable sementara agar tidak error saat menghapus tabel yang saling berelasi
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        
        console.log("Menghapus tabel 'books'...");
        await sequelize.query('DROP TABLE IF EXISTS books;');
        
        console.log("Menghapus tabel 'loans'...");
        await sequelize.query('DROP TABLE IF EXISTS loans;');
        
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        console.log("✅ Berhasil! Tabel 'books' dan 'loans' telah dihapus.");
        process.exit();
    } catch (error) {
        console.error("❌ Gagal menghapus tabel:", error.message);
        process.exit(1);
    }
}

hapusTabelLama();