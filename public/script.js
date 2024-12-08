async function fetchItemOfTheDay() {
    try {
        const response = await fetch('/item-of-the-day'); // Request to backend
        const item = await response.json();
        
        // Update the page with the item details
        document.getElementById('item-of-the-day').innerHTML = `
            <h2>${item.name}</h2>
            <img src="${item.image_url}" alt="${item.name}" width="200">
            <p>Price: ${item.price}</p>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById('item-of-the-day').textContent = 'Error loading the item of the day.';
    }
}

// Run the function when the page loads
fetchItemOfTheDay();
