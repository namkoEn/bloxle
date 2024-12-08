import sqlite3 from 'sqlite3';

// Open a connection to the database
const db = new sqlite3.Database('rolimons.db');

// Create the table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            name TEXT,
            price INTEGER,
            image_url TEXT
        )
    `);
    console.log("Database table 'items' created (or already exists).");
});

// Close the database connection
db.close();
