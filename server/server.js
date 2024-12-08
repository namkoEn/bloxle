import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const db = new sqlite3.Database('rolimons.db');

app.get('/items', (req, res) => {
    db.all("SELECT * FROM items ORDER BY price DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

