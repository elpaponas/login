const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const database = require('./database'); // Asegúrate de tener configurada tu conexión a la base de datos

router.post('/api/login', async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    const query = 'SELECT * FROM usuarios WHERE usuario = ?';
    database.query(query, [usuario], async (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = results[0];

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Enviar el rol del usuario como respuesta
        res.json({ role: user.role });
    });
});

module.exports = router;
