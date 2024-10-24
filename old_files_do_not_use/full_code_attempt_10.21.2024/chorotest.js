async function fetchCategories() {
    const response = await fetch('filtered_restaurant_record2.json');
    const data = await response.json();

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
        "Canadian (New)",
        "Pakistani",
        "Irish",
        "Hawaiian"
    ];

    const dropdown = document.getElementById('categories-dropdown');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', async (event) => {
        const selectedCategory = event.target.value;
        const filteredData = data.filter(restaurant => 
            restaurant.categories.includes(selectedCategory)
        );
        const geoData = await fetchGeoData(); // Fetch geo data from the JSON file
        createChoroplethMap(filteredData, geoData);
    });
}

async function fetchGeoData() {
    const response = await fetch('uscities.json');
    const data = await response.json();
    return data; // Return the parsed JSON data
}

async function createChoroplethMap(choroplethData) {
    const cityCounts = {};
    choroplethData.forEach(restaurant => {
        const city = restaurant.city;
        cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    const cities = geoData.map(geo => ({
        city: geo.city,
        count: cityCounts[geo.city] || 0, // Use the count from the filtered data
        lat: geo.lat,
        lng: geo.lng
    }));

    const plot = Plot.plot({
        projection: "albers-usa",
        marks: [
            Plot.geo(cities, { 
                fill: d => d.count || 0, 
                title: d => `${d.city}: ${d.count} restaurants`, 
                stroke: "white"
            })
        ],
        color: {
            scheme: "viridis",
            domain: [0, Math.max(...cities.map(d => d.count))],
            legend: true,
            label: "Number of Restaurants"
        }
    });

    document.getElementById('choropleth').innerHTML = '';
    document.getElementById('choropleth').appendChild(plot);
}

async function initialize() {
    await fetchCategories();
}

// Load data when the script is first run
initialize();
