import { Plot } from 'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.1.2/dist/plot.umd.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.6.0/dist/d3.min.js';

async function fetchCategories() {
    const response = await fetch('http://localhost:5000/categories');
    const data = await response.json();
    return [...data.strict_restaurant_categories, ...data.food_related_categories];
}

async function fetchRestaurants(category) {
    const response = await fetch('http://localhost:5000/query_restaurants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category })
    });
    return await response.json();
}

async function loadCityData() {
    const response = await d3.csv('uscities.csv');
    return response.map(d => ({
        city: d.city,
        state: d.state_name,
        lat: +d.lat,
        lng: +d.lng,
        // Other fields can be added if needed
    }));
}

async function createMap(restaurants, cityData) {
    // Count the number of restaurants per city
    const cityCounts = restaurants.reduce((acc, restaurant) => {
        const cityKey = `${restaurant.city}, ${restaurant.state}`;
        acc[cityKey] = (acc[cityKey] || 0) + 1;
        return acc;
    }, {});

    // Create an array of city data with counts
    const cityCountsArray = cityData.map(city => {
        const cityKey = `${city.city}, ${city.state}`;
        return {
            ...city,
            count: cityCounts[cityKey] || 0 // Default to 0 if not found
        };
    });

    // Define a color scale based on restaurant counts (0 to 700)
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
                         .domain([0, 700]); // Adjust domain as needed

    // Create the choropleth map
    const plot = Plot.plot({
        projection: "albers-usa", // Geographic projection
        marks: [
            Plot.geo(cityCountsArray, {
                fill: d => colorScale(d.count), // Use the color scale based on count
                title: d => `${d.city}: ${d.count} restaurants` // Tooltip on hover
            })
        ],
        color: {
            scheme: "blues", // Color scheme
            unknown: "#ddd", // Color for unknown values
            type: "linear", // Linear scale for color progression
            legend: true, // Show the legend
            label: "Number of Restaurants", // Legend label
            domain: [0, 700] // Domain for the color scale
        },
        width: 800,
        height: 500,
        margin: 40,
    });

    document.getElementById('myplot').innerHTML = ''; // Clear previous plot
    document.getElementById('myplot').appendChild(plot);
}

document.addEventListener('DOMContentLoaded', async () => {
    const categories = await fetchCategories();
    const cityData = await loadCityData();
    const categorySelect = document.createElement('select');

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    document.body.prepend(categorySelect); // Add select to the top of the page

    categorySelect.addEventListener('change', async (event) => {
        const category = event.target.value;
        const restaurants = await fetchRestaurants(category);
        await createMap(restaurants, cityData);
    });

    // Trigger the initial map load with the first category
    if (categories.length > 0) {
        categorySelect.value = categories[0];
        const initialRestaurants = await fetchRestaurants(categories[0]);
        await createMap(initialRestaurants, cityData);
    }
});
