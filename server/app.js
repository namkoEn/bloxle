import express from 'express';
import { selectItemOfTheDay, setupDatabase } from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static('public'));

// API Routes
app.get('/item-of-the-day', async (req, res) => {
    try {
        const item = await selectItemOfTheDay();
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch item of the day' });
    }
});

// Start the server
app.listen(PORT, () => {
    setupDatabase(); // Initialize database
    console.log(`Server is running on http://localhost:${PORT}`);
});
