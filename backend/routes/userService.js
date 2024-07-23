// userService.js
const db = require('./db'); // Ajusta según tu configuración

const getUserByUsuario = async (usuario) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    return rows[0]; // Devuelve el primer usuario encontrado
};

module.exports = { getUserByUsuario };