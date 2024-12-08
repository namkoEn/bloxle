import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const db = new sqlite3.Database('rolimons.db'); // Your SQLite database

// Middleware to serve static files (e.g., your HTML, CSS, JS files)
app.use(express.static('public'));

// Route to fetch the item of the day
app.get('/item-of-the-day', (req, res) => {
    db.get('SELECT * FROM items ORDER BY RANDOM() LIMIT 1', [], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'No items found' });
            return;
        }
        res.json(row); // Send the item data as JSON
    });
});

// Route to fetch all items ordered by price (desc)
app.get('/items', (req, res) => {
    db.all("SELECT * FROM items ORDER BY price DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows); // Send all items as JSON
    });
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});