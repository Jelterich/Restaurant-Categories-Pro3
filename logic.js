// Global variables for data storage
let restaurantData = {};
let map;
let cityCategoryBarChart;
let cityPieChart;
let topCitiesBarChart;

// Step 1: Fetch the JSON data from a local file
function getData() {
    let selectedCategories = [];
    document.querySelectorAll('input[name="category"]:checked').forEach((checkbox) => {
        selectedCategories.push(checkbox.value);
    });

    if (selectedCategories.length !== 5) {
        alert('Please select exactly 5 categories');
        return;
    }

    // Fetch data from the local JSON file
    fetch('filtered_restaurant_record2.json')
    .then(response => response.json())
    .then(data => {
        console.log("Data loaded:", data);  // Log the data to verify
        restaurantData = data;
        processYelpData(selectedCategories);  // Process based on categories
        setupMap(restaurantData);  // Setup map with all restaurants
    })
    .catch(error => console.error('Error loading the JSON file:', error));
}

// Step 2: Process Yelp data to get top 15 cities and restaurant counts for chart
function processYelpData(categories) {
    let citiesData = {};  // { city: {category: count, ...}, ... }

    // Process the restaurant data by categories and cities
    restaurantData.forEach(business => {
        if (business.categories.includes("Restaurant")) {
            let city = business.city;
            let businessCategories = business.categories.split(', ');

            businessCategories.forEach(category => {
                if (categories.includes(category)) {
                    if (!citiesData[city]) citiesData[city] = {};
                    citiesData[city][category] = (citiesData[city][category] || 0) + 1;
                }
            });
        }
    });

    let topCities = getTopCities(citiesData);
    populateCitySelect(topCities);  // Populate the city dropdown with the top 15 cities
    setupCityCategoryBarChart(topCities[0].city, citiesData[topCities[0].city]);  // Initialize the chart with the first city
}

// Function to get the top 15 cities by restaurant count
function getTopCities(citiesData) {
    let cityRestaurantCounts = Object.keys(citiesData).map(city => {
        let totalCount = Object.values(citiesData[city]).reduce((acc, count) => acc + count, 0);
        return { city: city, count: totalCount };
    });

    cityRestaurantCounts.sort((a, b) => b.count - a.count);

    return cityRestaurantCounts.slice(0, 15);
}

// Step 3: Initialize the map with all restaurants
function setupMap(restaurantData) {
    map = L.map('map').setView([37.8, -96], 4);  // Center on US
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    restaurantData.forEach(restaurant => {
        let lat = restaurant.latitude;
        let lon = restaurant.longitude;

        if (lat && lon) {
            L.circleMarker([lat, lon], {
                radius: 5,
                fillColor: 'blue',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<b>${restaurant.name}</b><br>City: ${restaurant.city}`).addTo(map);
        }
    });
}

// Step 4: Populate the city dropdown with the top 15 cities
function populateCitySelect(topCities) {
    let citySelect = document.getElementById('citySelect');
    citySelect.innerHTML = "";  // Clear previous options

    topCities.forEach(cityObj => {
        let option = document.createElement('option');
        option.value = cityObj.city;
        option.textContent = cityObj.city;
        citySelect.appendChild(option);
    });

    citySelect.addEventListener('change', function() {
        let selectedCity = citySelect.value;
        setupCityCategoryBarChart(selectedCity, restaurantData.filter(restaurant => restaurant.city === selectedCity));
    });
}

// Step 5: Setup the bar chart for the selected city's category breakdown
function setupCityCategoryBarChart(city, cityData) {
    // cityData is already an object where keys are category names and values are counts
    let categoryNames = Object.keys(cityData);  // Get the category names
    let categoryCounts = Object.values(cityData);  // Get the corresponding counts

    let ctx = document.getElementById('cityCategoryBarChart').getContext('2d');

    // Destroy the previous chart instance if it exists
    if (cityCategoryBarChart) {
        cityCategoryBarChart.destroy();
    }

    // Create the new chart
    cityCategoryBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryNames,
            datasets: [{
                label: `Category Breakdown for ${city}`,
                data: categoryCounts,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}





// Step 6: Update the pie chart for the selected city
const excludedCategories = ['Restaurants', 'Food','Delis', 'Convenience Stores', 'Breakfast & Brunch', 
    'Chicken Wings', 'Fast Food', 'Caterers', 'Event Planning & Services', 'Party & Event Planning', 'Venues & Event Spaces',
    'Seafood', 'Food Delivery Services', 'Tacos', 'Sandwiches', 'Cafes', 'Bakeries', 'Specialty Food', 'Soup', 'Fruits & Veggies',
    'Wine Bars', 'Nightlife', 'Bars', 'Sushi Bars', 'Poke', 'Salad', 'Ethnic Food', 'Comfort Food', 'Coffee & Tea', 
    'Restaurant Supplies', 'Professional Services', 'Wholesalers', 'Desserts', 'Burgers', 'Kebab', 'Sports Bars', 'Pool Halls',
    'Bar Crawl', 'Dive Bars', 'Tapas/Small Plates', 'Cocktail Bars', 'Gluten-Free', 'Gastropubs', 'Ramen', 'Buffets', 'Dim Sum',
    'Steakhouses', 'Patisserie/Cake Shop', 'Macarons', 'Cheesesteaks', 'Grocery', 'Hot Dogs', 'Vegatiran', 'Beer', 'Wine & Spirits',
    'Brasseries', 'Juice Bars & Smoothies', 'Beer Bar', 'Bubble Tea', 'Seafood Markets', 'Cheese Shops', 'Pasta Shops', 'Breweries',
    'Imported Food', 'Wraps', 'Ice Cream & Frozen Yogurt', 'Vegan', 'Pizza', 'American (New)', 'Barbeque', 'Cantonese', 
    'Tex-Mex', 'Lebanese', 'American (Traditional)', 'Asian Fusion', 'Halal', 'Arabic', 'Moroccan', 'Kosher', 'Venezuelan', 
    'Portuguese', 'Peruvian', 'Laotian', 'Roman', 'Szechuan', 'Egyptian', 'Salvadoran', 'Vegetarian', 'Nicaraguan', 'Soul Food',
    'Do-It-Yourself Food', 'Diners', 'Photography Stores & Services', 'Shopping', 'Noodles', 'Lounges', 'Hookah Bars', 
    'Chicken Shop', 'Cafeteria', 'International', 'New Mexican Cuisine', 'Teppanyaki', 'Basque', 'Tapas Bars', 'Falafel', 
    'Colombian', 'Live/Raw Food', 'Empanadas', 'Food Trucks', 'Internet Cafes', 'Bagels', 'Butcher', 'Farmers Market', 
    'Beer Gardens', 'Local Flavor', 'Street Vendors', 'Food Court', 'Persian/Iranian', 'Art Galleries', 'Arts & Entertainment',
    'Gelato', 'Flowers & Gifts', 'Creperies', 'Comedy Clubs', 'Tiki Bars', 'Personal Chefs', 'Modern European', 'Shanghainese',
    'Karaoke', 'Cupcakes', 'Trinidian', 'Pubs', 'Irish Pub', 'Sardinian', 'Health Markets', 'Music Venues', 'Pan Asian', 
    'Food Stands', 'Hainan', 'Active Life', 'Parks', 'Dominican', 'Afghan', 'Beverage Store', 'Dance Clubs', 'Beaches',
    'Pop-Up Restaurants', 'Business Consulting', 'Party Equipment Rentals', 'Swimming Pools', 'Hotels & Travel', 'Tours',
    'Cooking Classes', 'Arts & Crafts', 'Donuts', 'Wedding Planning', 'Iberian', 'Meat Shops', 'Mongolian', 'Hot Pot', 
    'Izakaya', 'Fish & Chips', 'Food Banks', 'Local Services', 'Community Service/Non-Profit', 'African', 'Print Media', 
    'Mass Media', 'Japanese Curry', 'Casinos', 'Tea Rooms', 'Chocolatiers & Shops', 'International Grocery', 'Filipino',
    'Buddhist Temples', 'Himalayan/Nepalese', 'Religious Organizations', 'Herbs & Spices', 'Watches', 'Israeli', 'Argentine',
    'Turkish', 'Sicilian', 'Brazilian', 'Brewpubs', 'Uzbek', 'Hotels', 'Social Clubs', 'Ethnic Grocery', 'Ukranian', 'Fuzhou',
    'Coffee Roasteries', 'Polish', 'Pet Adoption'
]; // Replace with actual category names you want to exclude

function updatePieChart() {
    let selectedCity = document.getElementById('citySelect').value;
    let cityData = restaurantData.filter(restaurant => restaurant.city === selectedCity);

    if (cityData.length === 0) {
        alert('No data available for the selected city.');
        return;
    }

    let categories = {};
    cityData.forEach(restaurant => {
        restaurant.categories.split(', ').forEach(category => {
            categories[category] = (categories[category] || 0) + 1;
        });
    });

    // Filter out excluded categories
    for (const category of excludedCategories) {
        delete categories[category];
    }

    let categoryNames = Object.keys(categories);
    let categoryCounts = Object.values(categories);

    let ctx = document.getElementById('cityPieChart').getContext('2d');

    if (cityPieChart) {
        cityPieChart.destroy();
    }

    // Generate colors dynamically
    const backgroundColors = categoryNames.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);

    cityPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categoryNames,
            datasets: [{
                data: categoryCounts,
                backgroundColor: backgroundColors,
            }]
        }
    });
}

// Step 7: Update the top 5 cities chart when a category is selected
function updateTopCitiesChart() {
    let selectedCategory = document.getElementById('categorySelect').value;
    let categoryCityData = [];

    Object.entries(restaurantData).forEach(([city, categories]) => {
        if (categories[selectedCategory]) {
            categoryCityData.push({ city, count: categories[selectedCategory] });
        }
    });

    categoryCityData.sort((a, b) => b.count - a.count);
    let top5 = categoryCityData.slice(0, 5);

    let cityNames = top5.map(item => item.city);
    let cityCounts = top5.map(item => item.count);

    let ctx = document.getElementById('topCitiesBarChart').getContext('2d');

    if (topCitiesBarChart) {
        topCitiesBarChart.destroy();
    }

    topCitiesBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cityNames,
            datasets: [{
                label: `Top 5 Cities for ${selectedCategory}`,
                data: cityCounts,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}