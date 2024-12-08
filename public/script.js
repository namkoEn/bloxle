async function fetchItemOfTheDay() {
    try {
        const response = await fetch('/item-of-the-day'); // Relative URL to backend
        const item = await response.json();
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
fetchItemOfTheDay();
