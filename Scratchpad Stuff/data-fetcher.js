// data-fetcher.js

// Replace with your actual API key
const API_KEY = 'AIzaSyBOj0AOw1d8VH0yKfU97fDx7bNr1lYOhGo';

async function fetchPlacesData(location, radius, type) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return processPlacesData(data.results);
    } catch (error) {
        console.error('Error fetching places data:', error);
        return null;
    }
}

function processPlacesData(places) {
    // Define color categories based on place types or other criteria
    const colorCategories = {
        'red': ['restaurant', 'cafe'],
        'blue': ['school', 'university'],
        'green': ['park', 'zoo'],
        'yellow': ['museum', 'art_gallery'],
        'purple': ['night_club', 'bar']
    };

    const colorCounts = {
        'red': 0, 'blue': 0, 'green': 0, 'yellow': 0, 'purple': 0
    };

    places.forEach(place => {
        for (const [color, types] of Object.entries(colorCategories)) {
            if (types.some(type => place.types.includes(type))) {
                colorCounts[color]++;
                break;
            }
        }
    });

    return {
        labels: Object.keys(colorCounts),
        data: Object.values(colorCounts),
        markers: places.map(place => ({
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            name: place.name,
            types: place.types
        }))
    };
}

async function updateDashboard() {
    const location = '40.7128,-74.0060'; // New York City coordinates
    const radius = 5000; // 5km radius
    const type = 'point_of_interest'; // General type to get various places

    const placesData = await fetchPlacesData(location, radius, type);

    if (placesData) {
        updateCharts(placesData);
        updateMap(placesData.markers);
    }
}

function updateCharts(data) {
    // Update your charts here using the data
    // Example:
    updateChart('barChart1', {
        labels: data.labels,
        datasets: [{
            label: 'Place Types',
            data: data.data,
            backgroundColor: data.labels // Using color names as background colors
        }]
    });

    // Repeat for other charts...
}

function updateMap(markers) {
    // Clear existing markers
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add new markers
    markers.forEach(marker => {
        L.marker([marker.lat, marker.lng])
            .addTo(map)
            .bindPopup(`${marker.name}<br>Types: ${marker.types.join(', ')}`);
    });

    // Adjust map view to fit all markers
    const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
    map.fitBounds(bounds);
}

// Call this function to update the dashboard with real data
updateDashboard();
