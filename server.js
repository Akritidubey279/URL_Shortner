const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            original_url TEXT NOT NULL,
            short_code TEXT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Helper function to generate a random short code
function generateShortCode(length = 6) {
    return crypto.randomBytes(Math.ceil(length * 3 / 4))
        .toString('base64')
        .replace(/\+/g, '0')
        .replace(/\//g, '1')
        .replace(/=/g, '')
        .substring(0, length);
}

// Routes
// POST /api/shorten
app.post('/api/shorten', (req, res) => {
    const { original_url } = req.body;

    if (!original_url) {
        return res.status(400).json({ error: 'Missing original_url' });
    }

    try {
        new URL(original_url); // Validate URL format
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Check if the URL already exists in the database
    const selectQuery = 'SELECT short_code FROM urls WHERE original_url = ?';
    db.get(selectQuery, [original_url], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (row) {
            // URL already exists, return the existing short code
            return res.json({ original_url, short_code: row.short_code });
        }

        // Generate a new short code and insert
        const shortCode = generateShortCode();
        const insertQuery = 'INSERT INTO urls (original_url, short_code) VALUES (?, ?)';
        
        db.run(insertQuery, [original_url, shortCode], function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to insert into database' });
            }
            res.status(201).json({ original_url, short_code: shortCode });
        });
    });
});

// GET /:code
app.get('/:code', (req, res) => {
    const { code } = req.params;

    const query = 'SELECT original_url FROM urls WHERE short_code = ?';
    db.get(query, [code], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal server error');
        }

        if (row) {
            return res.redirect(row.original_url);
        } else {
            return res.status(404).send('URL not found');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
