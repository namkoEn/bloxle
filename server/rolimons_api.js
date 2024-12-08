import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('rolimons.db');

class RolimonsAPI {
    constructor() {
        this.apiURL = "https://www.rolimons.com/itemapi/itemdetails";
        this.thumbnailAPI = "https://www.roblox.com/item-thumbnails?params=";
        this.db = new sqlite3.Database('rolimons.db');
    }

    async fetchItems() {
        try {
            // Fetch item data from Rolimons API
            const response = await fetch(this.apiURL);
            if (!response.ok) {
                throw new Error('Failed to fetch items from the Rolimons API');
            }
            const data = await response.json();
            console.log("Data fetched from Rolimons API:", data); // Debugging: Check API data

            const items = this.processData(data);
            console.log("Processed items:", items); // Debugging: Check processed items

            // Save items to the database
            for (const item of items) {
                // Get the image URL from the Asset Thumbnails API
                const imageUrl = await this.getItemImageUrl(item.id);
                console.log(`Saving item: ${item.name}, Image URL: ${imageUrl}`); // Debugging: Check each item
                // Save the item data to the database (including price and image URL)
                this.saveToDatabase({ ...item, imageUrl });
            }

            return items;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    processData(data) {
        const items = data.items;
        const processedItems = [];

        for (let itemID in items) {
            const item = items[itemID];
            // Here, we extract the necessary data: id, name, price
            processedItems.push({
                id: itemID,
                name: item[0], // Name of the item
                price: item[4], // Price of the item
                imageUrl: null  // This will be populated later from the Asset Thumbnails API
            });
        }

        return processedItems;
    }

    async getItemImageUrl(itemID) {
        try {
            // Construct the URL for the Asset Thumbnails API
            const url = `${this.thumbnailAPI}[{assetId:${itemID}}]`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch thumbnail from Asset Thumbnails API');
            }

            const data = await response.json();
            // Check if the thumbnail URL exists and return it
            if (data && data.length > 0 && data[0].thumbnailUrl) {
                return data[0].thumbnailUrl;
            } else {
                return 'Image not available'; // Fallback if no image is found
            }
        } catch (error) {
            console.error("Error fetching thumbnail:", error);
            return 'Error fetching image'; // Return error message
        }
    }

    saveToDatabase(item) {
        const { id, name, price, imageUrl } = item;
        this.db.run(
            `INSERT INTO items (id, name, price, image_url) VALUES (?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET 
             name=excluded.name, 
             price=excluded.price, 
             image_url=excluded.image_url`,
            [id, name, price, imageUrl],
            (err) => {
                if (err) {
                    console.error(`Error saving ${name} to database:`, err.message);
                } else {
                    console.log(`Item ${name} saved to database.`);
                }
            }
        );
    }

    closeDatabase() {
        this.db.close();
    }
}

// Fetch and save items from the APIs
(async () => {
    const rolimonsAPI = new RolimonsAPI();
    await rolimonsAPI.fetchItems();
})();