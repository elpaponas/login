const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Usuario de MySQL
  password: '', // Contraseña de MySQL (deja en blanco si no has configurado una)
  database: 'nauticpass' // Nombre de la base de datos creada en MySQL
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});

module.exports = connection;
