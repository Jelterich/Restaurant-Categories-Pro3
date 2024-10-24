let map;
let heatLayer;

// Initialize the map and set its view to a default location
function initMap() {
    map = L.map('map').setView([39.8283, -98.5795], 4);  // Centered on the USA

    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Initialize the heat layer (will be added when data is fetched)
    heatLayer = L.heatLayer([], { 
        radius: 25, 
        blur: 15, 
        maxZoom: 17 
    }).addTo(map);
}

// Function to update heat map based on new data
function updateHeatMap(locations) {
    // Remove the old heat layer
    if (heatLayer) {
        heatLayer.setLatLngs(locations);  // Update the heatmap with new data
    }
}

// Initialize map when the page loads
document.addEventListener("DOMContentLoaded", () => {
    console.log('Initializing map');
    initMap();
});

// Fetch the list of categories from Flask API and populate the dropdown
fetch('/categories')
    .then(response => response.json())
    .then(data => {
        const categories = data.strict_restaurant_categories;
        const dropdown = document.getElementById('category-dropdown');

        // Add each category as an option to the dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            dropdown.appendChild(option);
        });
    });

// Add event listener for dropdown change
document.getElementById('category-dropdown').addEventListener('change', function() {
    const selectedCategory = this.value;

    // Fetch the restaurants for the selected category
    fetch(`/query_restaurants/${selectedCategory}`)
        .then(response => response.json())
        .then(data => {
            // Process the data and prepare it for the chart
            const cityCount = {};
            const locations = [];

            // Count the number of restaurants per city and collect lat/lng data
            data.forEach(restaurant => {
                const city = restaurant.city;
                const lat = restaurant.latitude;
                const lng = restaurant.longitude;

                // Push the coordinates to the locations array for the heatmap
                if (lat && lng) {
                    locations.push([lat, lng]);
                }

                // Count cities for charting
                if (cityCount[city]) {
                    cityCount[city] += 1;
                } else {
                    cityCount[city] = 1;
                }
            });

            // Convert the cityCount object into an array of [city, count] and sort it by count (descending)
            const sortedCityCount = Object.entries(cityCount).sort((a, b) => b[1] - a[1]);

            // Get the top 10 cities from the sorted list
            const top10Cities = sortedCityCount.slice(0, 10);

            // Separate cities and counts into separate arrays
            const cities = top10Cities.map(item => item[0]);
            const counts = top10Cities.map(item => item[1]);

            // Safely destroy the old chart if it exists and is a Chart.js instance
            if (window.myChart instanceof Chart) {
                window.myChart.destroy();
            }

            // Create the top ten cities chart
            const ctx1 = document.getElementById('TopCitiesChart').getContext('2d');
            window.myChart1 = new Chart(ctx1, {
                type: 'bar', 
                data: {
                    labels: cities, // Top 10 cities as labels
                    datasets: [{
                        label: `# of ${selectedCategory} restaurants`,
                        data: counts, // Top 10 restaurant counts
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            const ctx2 = document.getElementById('TopCitiesChart2').getContext('2d');
            window.myChart2 = new Chart(ctx2, {
                type: 'bar', 
                data: {
                    labels: cities, // Top 10 cities as labels
                    datasets: [{
                        label: `# of ${selectedCategory} restaurants`,
                        data: counts, // Top 10 restaurant counts
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            const ctx3 = document.getElementById('TopCitiesChart3').getContext('2d');
            window.myChart3 = new Chart(ctx3, {
                type: 'bar', 
                data: {
                    labels: cities, // Top 10 cities as labels
                    datasets: [{
                        label: `# of ${selectedCategory} restaurants`,
                        data: counts, // Top 10 restaurant counts
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            const ctx4 = document.getElementById('TopCitiesChart4').getContext('2d');
            window.myChart4 = new Chart(ctx4, {
                type: 'bar', 
                data: {
                    labels: cities, // Top 10 cities as labels
                    datasets: [{
                        label: `# of ${selectedCategory} restaurants`,
                        data: counts, // Top 10 restaurant counts
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            

            // Update the heatmap with the new locations
            console.log(locations);  // Check what coordinates are being sent to the heatmap
            updateHeatMap(locations);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});


