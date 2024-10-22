import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

// Function to fetch restaurant density data based on selected category
async function fetchRestaurantDensity(category) {
    try {
        const response = await fetch('http://127.0.0.1:5000/query_restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Process data to get density per region
        // Assuming your data has 'latitude' and 'longitude' fields for each restaurant
        const densityData = processDensityData(data);
        return densityData;
    } catch (error) {
        console.error('Error fetching restaurant density:', error);
    }
}

// Function to process density data
function processDensityData(data) {
    const densityMap = {};

    data.forEach(restaurant => {
        const region = getRegionFromCoordinates(restaurant.latitude, restaurant.longitude);
        if (densityMap[region]) {
            densityMap[region]++;
        } else {
            densityMap[region] = 1;
        }
    });

    return Object.entries(densityMap).map(([region, count]) => ({
        region,
        value: count
    }));
}

// Placeholder function to get region from coordinates (implement this based on your data)
function getRegionFromCoordinates(lat, lon) {
    // Replace this with actual logic to map coordinates to regions
    return "Region A"; // Example placeholder
}

// Function to create the choropleth map
async function createChoroplethMap(category) {
    const densityData = await fetchRestaurantDensity(category);

    // Create the choropleth map
    const plot = Plot.plot({
        marks: [
            Plot.geoPath(densityData, {
                fill: d => d.value,
                stroke: "white",
                title: d => `${d.region}: ${d.value}`,
            })
        ],
        width: 800,  // Adjust width as needed
        height: 500, // Adjust height as needed
        color: {
            type: "linear",
            domain: [0, Math.max(...densityData.map(d => d.value))], // Max value for scaling
            range: ["lightblue", "darkblue"]
        },
    });

    const div = document.querySelector("#myplot");
    div.innerHTML = ''; // Clear previous plot
    div.append(plot);
}

// Fetch and create the choropleth map when the page loads or category is selected
const selectedCategory = "Restaurants"; // Set this dynamically based on user selection
createChoroplethMap(selectedCategory);