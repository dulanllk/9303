const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const secretKey = process.env.JWT_SECRET;

app.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const [result] = await pool.query('INSERT INTO users (name, password) VALUES (?, ?)', [name, hashedPassword]);
        res.status(200).send({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);

        if (users.length === 0) {
            return res.status(404).send({ message: 'User not found.' });
        }

        const passwordIsValid = await bcrypt.compare(password, users[0].password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null, message: 'Invalid password.' });
        }

        const token = jwt.sign({ id: users[0].id, role: users[0].role }, secretKey, { expiresIn: '1h' });

        res.status(200).send({
            auth: true,
            token: token,
            userId: users[0].id,
            role: users[0].role,
            name: users[0].name
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.post('/saveScore', async (req, res) => {
    try {
        const { name, score } = req.body;

        // Check if a record exists for the player
        const [existingRecord] = await pool.query('SELECT * FROM scores WHERE user = ?', [name]);

        if (existingRecord.length > 0) {
            // Update the existing record
            await pool.query('UPDATE scores SET score = ? WHERE user = ?', [score, name]);
            res.status(200).send({ message: 'Score updated successfully.' });
        } else {
            // Insert a new record
            await pool.query('INSERT INTO scores (user, score) VALUES (?, ?)', [name, score]);
            res.status(200).send({ message: 'Score saved successfully.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get('/topScores', async (req, res) => {
    try {
        const [scores] = await pool.query('SELECT user, score FROM scores ORDER BY score DESC LIMIT 10');
        res.status(200).send(scores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});