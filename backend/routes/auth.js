// auth.js
const express = require('express');
const router = express.Router();
const { getUserByUsuario } = require('./userService');
const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado

router.post('/users/login', async (req, res) => {
    const { usuario, password, role } = req.body;

    try {
        const user = await getUserByUsuario(usuario);
        console.log('User from DB:', user);

        if (user && await bcrypt.compare(password, user.password) && user.role === role) {
            res.json({ userRole: role });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
