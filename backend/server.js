const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());

// Configurar la conexión a la base de datos MySQL
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Reemplaza con tu contraseña si es necesario
    database: 'nauticpass' // Reemplaza con el nombre de tu base de datos
});

database.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Ruta para obtener todos los usuarios
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM usuarios';
    database.query(query, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ status: 'error', message: 'Error querying the database' });
        }
        res.json(results);
    });
});

// Ruta para obtener un usuario específico por ID
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    database.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ status: 'error', message: 'Error querying the database' });
        }
        if (results.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.json(results[0]);
    });
});

// Ruta para el inicio de sesión
app.post('/api/login', async (req, res) => {
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

// Ruta para agregar un nuevo usuario
app.post('/api/users', (req, res) => {
    const { numeroColega, nombres, apellidos, puesto, role, usuario, password } = req.body;

    if (!numeroColega || !nombres || !apellidos || !puesto || !role || !usuario || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Hashear la contraseña antes de guardarla
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ status: 'error', message: 'Error processing password' });
        }

        const query = 'INSERT INTO usuarios (numeroColega, nombres, apellidos, puesto, role, usuario, password, estado) VALUES (?, ?, ?, ?, ?, ?, ?, true)';
        database.query(query, [numeroColega, nombres, apellidos, puesto, role, usuario, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting into the database:', err);
                return res.status(500).json({ status: 'error', message: 'Error adding user to database' });
            }
            res.json({ status: 'success', message: 'User added successfully', id: result.insertId });
        });
    });
});

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
