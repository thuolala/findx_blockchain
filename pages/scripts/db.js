const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blockchain_final',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function connectToDatabase() {
  const connection = await pool.getConnection();
  return connection;
}

module.exports = { connectToDatabase };
