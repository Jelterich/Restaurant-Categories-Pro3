
  // Global variables for data storage
  let restaurantData = {};
  let map;
  let cityCategoryBarChart;
  let cityPieChart;
  let topCitiesBarChart;
  let selectedCategory = [];

//  Pre-Step: Populate the drop-down menu for users to select a category
// Create the categories
const categories = [
    "Mexican",
    "Italian",
    "Chinese",
    "Japanese",
    "Mediterranean",
    "Southern",
    "Thai",
    "Cajun",
    "Creole",
    "Vietnamese",
    "Indian",
    "Latin American",
    "Greek",
    "Caribbean",
    "Middle Eastern",
    "French",
    "Korean",
    "Spanish",
    "Cuban",
    "Canadien (New)",
    "Pakistani",
    "Irish",
    "Hawaiian"
];

// Populate dropdown on page load
const dropdown = document.getElementById('categories-dropdown');
categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    dropdown.appendChild(option);
});

    
// Fetch data from the local JSON file
async function fetchData(selectedCategory) {
    fetch('filtered_restaurant_record2.json')
    .then(response => response.json())
    .then(data => {
        console.log("Data loaded:", data);  // Log the data to verify
        restaurantData = data;
        processYelpData(selectedCategory);  // Process based on categories
        createChoroplethMap();  // Create choropleth map
    })
    .catch(error => console.error('Error loading the JSON file:', error));
}

// Step 2: Process Yelp data to get top 10 cities and restaurant counts for chart
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

// Function to get the top 10 cities by restaurant count
function getTopCities(citiesData) {
    let cityRestaurantCounts = Object.keys(citiesData).map(city => {
        let totalCount = Object.values(citiesData[city]).reduce((acc, count) => acc + count, 0);
        return { city: city, count: totalCount };
    });

    cityRestaurantCounts.sort((a, b) => b.count - a.count);

    return cityRestaurantCounts.slice(0, 10);
}


//SAVING TO COME BACK TO LATER
// Function to fetch data based on selected category
async function fetchData(selectedCategory) {
    // Replace this with your actual data fetching logic
    // Example: fetch(`/api/data?category=${selectedCategory}`)
    // const response = await fetch(...);
    // const data = await response.json();
    
    // Return mock data for demonstration
    return {
        chartData1: { /* ... */ },
        chartData2: { /* ... */ },
        choroplethData: { /* ... */ }
    };
}

// Function to create/update charts and choropleth map
async function updateVisualizations(selectedCategory) {
    const data = await fetchData(selectedCategory);
    
    // Update charts
    createChart('barChart1', 'bar', data.chartData1, 'Chart Title 1');
    createChart('barChart2', 'bar', data.chartData2, 'Chart Title 2');
    
    // Update choropleth map
    createChoroplethMap(data.choroplethData);
}

// Add event listener to dropdown
dropdown.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    updateVisualizations(selectedCategory); // Update visualizations based on selection
});

// Initial setup (optional)
updateVisualizations(categories[0]); // Initialize with the first category

//SAVING TO COME BACK TO LATER
// Function to load JSON data
async function loadJSONData() {
    const response = await fetch('filtered_restaurant_record2.json');
    const data = await response.json();
    return data;
}

// Function to load CSV data
async function loadCSVData() {
    const response = await fetch('uscities.csv');
    const text = await response.text();
    
    // Convert CSV text to array of objects
    const rows = text.split('\n').slice(1); // Skip header
    const citiesData = rows.map(row => {
        const columns = row.split(',');
        return {
            city: columns[0],
            state_id: columns[1],
            state_name: columns[2],
            latitude: parseFloat(columns[6]),
            longitude: parseFloat(columns[7]),
            population: parseInt(columns[8], 10),
            // Add other fields as necessary
        };
    });
    return citiesData;
}

// Global variables to hold data
let restaurantData = [];
let citiesData = [];

// Load data on initial page load
async function loadData() {
    restaurantData = await loadJSONData();
    citiesData = await loadCSVData();
    populateDropdown(); // Populate dropdown after data is loaded
}

// Populate dropdown with categories from restaurantData
function populateDropdown() {
    const categories = new Set(); // Use a Set to avoid duplicates
    restaurantData.forEach(restaurant => {
        const categoryList = restaurant.categories.split(','); // Assuming categories are comma-separated
        categoryList.forEach(category => {
            categories.add(category.trim());
        });
    });

    const dropdown = document.getElementById('categories-dropdown');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });
}

// Fetch data relevant to selected category
async function fetchData(selectedCategory) {
    const filteredRestaurants = restaurantData.filter(restaurant => 
        restaurant.categories.includes(selectedCategory)
    );

    // For choropleth: get city names of filtered restaurants
    const cityCounts = {};
    filteredRestaurants.forEach(restaurant => {
        const city = restaurant.city; // Use the city from the restaurant data
        if (cityCounts[city]) {
            cityCounts[city]++;
        } else {
            cityCounts[city] = 1;
        }
    });

    // Convert to an array and sort to get the top 10 cities
    const topCities = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Get top 10

    // Prepare choropleth data with unique city names
    const choroplethData = filteredRestaurants.map(restaurant => ({
        city: restaurant.city
    }));

    return { choroplethData, topCities };
}

// Update visualizations when the dropdown selection changes
document.getElementById('categories-dropdown').addEventListener('change', async (event) => {
    const selectedCategory = event.target.value;
    const { choroplethData, topCities } = await fetchData(selectedCategory);

    // Update choropleth map
    createChoroplethMap(choroplethData);
    
    // Update bar chart with top cities data
    createBarChart('barChart1', topCities);
});

// Call loadData on initial page load
loadData();
