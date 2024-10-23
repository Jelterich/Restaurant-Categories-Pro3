let map;
let heatLayer;

// Initialize the map
function initMap() {
    map = L.map('map').setView([39.8283, -98.5795], 4);  // Centered on the USA

    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Initialize the heat layer
    heatLayer = L.heatLayer([], { 
        radius: 35, 
        blur: 8, 
        maxZoom: 50 
    }).addTo(map);
}

// Function to update heat map based on new data
function updateHeatMap(locations) {
    // Remove the old heat layer
    if (heatLayer) {
        map.removeLayer(heatLayer);  // Remove old layer first
    }
    heatLayer = L.heatLayer(locations, { 
        radius: 25, 
        blur: 15, 
        maxZoom: 17 
    }).addTo(map);
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

// Event listener for dropdown changes
document.getElementById('category-dropdown').addEventListener('change', function() {
    const selectedCategory = this.value;
    function updatePieChart(data, selectedCity, selectedCategory) {
        // Get the state of the selected city
        const cityState = data.find(r => r.city === selectedCity).state;
        
        // Get all restaurants in the selected city
        const cityRestaurants = data.filter(r => r.city === selectedCity);
    
        // Count all categories in the city
        const categoryCount = {};
        cityRestaurants.forEach(restaurant => {
            const categories = restaurant.categories.split(', ');
            categories.forEach(category => {
                if (categoryCount[category]) {
                    categoryCount[category] += 1;
                } else {
                    categoryCount[category] = 1;
                }
            });
        });
    
        // Get the top 5 categories
        const top5Categories = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        const topCategories = top5Categories.map(item => item[0]);
        const categoryCounts = top5Categories.map(item => item[1]);
    
        // Destroy old pie chart if it exists so it recreates on city click
        if (window.myChart2 instanceof Chart) {
            window.myChart2.destroy();
        }
    
        // Create new pie chart
        const ctx2 = document.getElementById('pieChart').getContext('2d');
        window.myChart2 = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: topCategories,
                datasets: [{
                    data: categoryCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    title: {
                        display: true,
                        text: `Top 5 Categories in ${selectedCity}, ${cityState}`
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: "'Helvetica Neue', 'Arial', sans-serif"
                            }
                        }
                    }
                }
            }
        });
    }
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
                const lat = parseFloat(restaurant.latitude);  // Convert to number
                const lng = parseFloat(restaurant.longitude);

                // Push the coordinates to the locations array for the heatmap
                if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                    locations.push([lat, lng, 1]);  // Add intensity value
                    console.log(`Added location: ${lat}, ${lng}`);  // Debug log
                }

                // Count cities for charting
                if (cityCount[city]) {
                    cityCount[city] += 1;
                } else {
                    cityCount[city] = 1;
                }
            });

            // Original top 10 cities calculation
            const sortedCityCount = Object.entries(cityCount).sort((a, b) => b[1] - a[1]);
            const top10Cities = sortedCityCount.slice(0, 10);
            const cities = top10Cities.map(item => item[0]);
            const counts = top10Cities.map(item => item[1]);

            // New calculation for top 5 categories in the city with most restaurants
            const topCity = cities[0]; // We already have the city with most restaurants
            const topCityState = data.find(r => r.city === topCity).state;
            const topCityRestaurants = data.filter(r => r.city === topCity);

            // Count all categories in top city
            const categoryCount = {};
            topCityRestaurants.forEach(restaurant => {
                const categories = restaurant.categories.split(', ');
                categories.forEach(category => {
                    if (categoryCount[category]) {
                        categoryCount[category] += 1;
                    } else {
                        categoryCount[category] = 1;
                    }
                });
            });

            // Get top 5 categories
            const top5Categories = Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
            const topCategories = top5Categories.map(item => item[0]);
            const categoryCounts = top5Categories.map(item => item[1]);

            // Delete any existing charts so they wull refresh on reselection
            if (window.myChart1 instanceof Chart) {
                window.myChart1.destroy();
            }
            if (window.myChart2 instanceof Chart) {
                window.myChart2.destroy();
            }
            
            // Create all charts
            const ctx1 = document.getElementById('TopCitiesChart').getContext('2d');
            window.myChart1 = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: cities,
                    datasets: [{
                        label: `# of ${selectedCategory} restaurants`,
                        data: counts,
                        backgroundColor: 'rgba(98, 182, 239, 0.8)',
                        borderColor: 'rgba(98, 182, 239, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    family: "'Helvetica Neue', 'Arial', sans-serif"
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false
                            }
                        }
                    },
                    onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const selectedCity = cities[index];
                            updatePieChart(data, selectedCity, selectedCategory);
                        }
                    }
                }
            });

            // top 5 categories in the city with the most restaurants of the selected category
            const ctx2 = document.getElementById('pieChart').getContext('2d');
            window.myChart2 = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: topCategories,
                    datasets: [{
                        data: categoryCounts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio:2,
                    plugins: {
                        title: {
                            display: true,
                            text: `Top 5 Categories in ${topCity}, ${topCityState}`
                        },
                        legend: {
                            position: 'right',
                                labels: {
                                    font: {
                                        family: "'Helvetica Neue', 'Arial', sans-serif"
                                    }
                                }
                            }
                        }
                }    }   
            );
            // Update the heatmap
            console.log(locations);
            updateHeatMap(locations);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});