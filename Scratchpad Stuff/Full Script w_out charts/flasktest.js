async function fetchCategories() {
    try {
        // Fetch categories from Flask API
        let response = await fetch('http://127.0.0.1:5000/categories'); // Adjust port if necessary
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data = await response.json();

        // Populate the dropdown with categories
        populateCategoriesDropdown(data.strict_restaurant_categories, data.food_related_categories);
        
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Function to populate the dropdown
function populateCategoriesDropdown(restaurantCategories, foodCategories) {
    const dropdown = document.getElementById('categories-dropdown');
    dropdown.innerHTML = ''; // Clear previous options

    // Create an option for each strict restaurant category
    restaurantCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });

    // Create an option for each food-related category
    foodCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });
}

// Fetch categories when the page loads
window.onload = fetchCategories;




