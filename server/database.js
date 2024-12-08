import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('rolimons.db');

// Create necessary tables
export function setupDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS items (
                id TEXT PRIMARY KEY,
                name TEXT,
                price INTEGER,
                image_url TEXT
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS item_of_the_day (
                id TEXT,
                name TEXT,
                price INTEGER,
                image_url TEXT,
                date TEXT UNIQUE
            );
        `);
        console.log('Database tables initialized.');
    });
}

// Function to fetch today's item of the day
export function selectItemOfTheDay() {
    const today = new Date().toISOString().slice(0, 10);
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM item_of_the_day WHERE date = ?", [today], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}
