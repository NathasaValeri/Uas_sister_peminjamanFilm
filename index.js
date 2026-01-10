// Menjalankan semua service sekaligus dalam satu proses
require('./api/auth-service.js');
require('./api/movie-service.js');
require('./api/rental-service.js');

console.log("Semua Microservices telah dijalankan di Clever Cloud!");