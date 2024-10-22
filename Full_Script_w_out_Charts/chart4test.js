import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"; // Import D3

let cityData = [];

// Function to load the city data from CSV using D3
async function loadCityData() {
    cityData = await d3.csv('uscities.csv', d => ({
        city: d.city,
        state: d.state_name,
        lat: +d.lat, // Convert latitude to number
        lng: +d.lng  // Convert longitude to number
    }));
}

// Function to get region from coordinates using the loaded city data
function getRegionFromCoordinates(lat, lon) {
    const foundCity = cityData.find(city => 
        Math.abs(city.lat - lat) < 0.1 && Math.abs(city.lng - lon) < 0.1 // Adjust the threshold as needed
    );
    return foundCity ? `${foundCity.city}, ${foundCity.state}` : "Unknown Region";
}

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
        return processDensityData(data);
    } catch (error) {
        console.error('Error fetching restaurant density:', error);
        document.querySelector("#myplot").innerHTML = 'Error loading data.';
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

// Function to create the choropleth map
async function createChoroplethMap(category) {
    const densityData = await fetchRestaurantDensity(category);
    
    if (!densityData || densityData.length === 0) {
        document.querySelector("#myplot").innerHTML = 'No data available.';
        return;
    }

    const plot = Plot.plot({
        marks: [
            Plot.geoPath(densityData, {
                fill: d => d.value,
                stroke: "white",
                title: d => `${d.region}: ${d.value}`,
            })
        ],
        width: 800,
        height: 500,
        color: {
            type: "linear",
            domain: [0, Math.max(...densityData.map(d => d.value))],
            range: ["lightblue", "darkblue"]
        },
    });

    const div = document.querySelector("#myplot");
    div.innerHTML = ''; // Clear previous plot
    div.append(plot);
}

// Load the city data and create the initial map
async function init() {
    await loadCityData();
    const initialCategory = "Restaurants"; // Change this to dynamically select
    createChoroplethMap(initialCategory);
}

init();
