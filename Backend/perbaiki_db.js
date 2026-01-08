const { Sequelize } = require('sequelize');

// Gunakan URL koneksi Railway Anda
const sequelize = new Sequelize('mysql://root:EyuPGVRitFScKqqCdVmdXrUtjAYtjmLJ@mainline.proxy.rlwy.net:49790/railway');

async function fixDatabase() {
    try {
        console.log("Sedang memperbaiki struktur tabel...");
        
        // Perintah untuk mengaktifkan Auto Increment
        await sequelize.query("ALTER TABLE users MODIFY COLUMN id INT AUTO_INCREMENT;");
        await sequelize.query("ALTER TABLE books MODIFY COLUMN id INT AUTO_INCREMENT;");
        await sequelize.query("ALTER TABLE loans MODIFY COLUMN id INT AUTO_INCREMENT;");
        
        console.log("✅ BERHASIL! Sekarang kolom ID sudah otomatis (Auto Increment).");
        console.log("Silakan coba Register kembali di browser.");
    } catch (error) {
        console.error("❌ GAGAL:", error.message);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

fixDatabase();