const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// Conectar a la base de datos
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nauticpass'
});

// Función para hashear las contraseñas
const hashPasswords = async () => {
    pool.query('SELECT id, password FROM usuarios', async (err, results) => {
        if (err) throw err;

        for (const user of results) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, user.id], (updateErr) => {
                if (updateErr) throw updateErr;
                console.log(`Password updated for user ${user.id}`);
            });
        }
    });
};

hashPasswords();
