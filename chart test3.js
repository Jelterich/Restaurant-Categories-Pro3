// // data-fetcher.js

// const API_KEY = 'AIzaSyBOj0AOw1d8VH0yKfU97fDx7bNr1lYOhGo';

// // Fetch data from Google Places API
// async function fetchPlacesData(location, radius, type) {
//     const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${API_KEY}`;
    
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return processPlacesData(data.results);
//     } catch (error) {
//         console.error('Error fetching places data:', error);
//         return null;
//     }
// }

// // Process fetched data for charts and map
// function processPlacesData(places) {
//     const colorCategories = {
//         'restaurant': 'rgba(255, 99, 132, 0.8)',
//         'cafe': 'rgba(54, 162, 235, 0.8)',
//         'park': 'rgba(75, 192, 192, 0.8)',
//         'museum': 'rgba(153, 102, 255, 0.8)',
//         'night_club': 'rgba(255, 206, 86, 0.8)'
//     };

//     const colorCounts = {
//         'restaurant': 0, 'cafe': 0, 'park': 0, 'museum': 0, 'night_club': 0
//     };

//     places.forEach(place => {
//         for (const type in colorCategories) {
//             if (place.types.includes(type)) {
//                 colorCounts[type]++;
//                 break;
//             }
//         }
//     });

//     return {
//         labels: Object.keys(colorCounts),
//         data: Object.values(colorCounts),
//         backgroundColors: Object.values(colorCategories),
//         markers: places.map(place => ({
//             lat: place.geometry.location.lat,
//             lng: place.geometry.location.lng,
//             name: place.name,
//             types: place.types
//         }))
//     };
// }

// // Update the dashboard: Bar chart, pie chart, and map
// async function updateDashboard() {
//     const location = '40.7128,-74.0060'; // New York City coordinates
//     const radius = 5000; // 5km radius
//     const type = 'point_of_interest';

//     const placesData = await fetchPlacesData(location, radius, type);

//     if (placesData) {
//         updateCharts(placesData);
//         updateMap(placesData.markers);
//     }
// }

// // Update the charts (both bar and pie charts)
// function updateCharts(data) {
//     // Bar chart
//     updateChart('barChart', {
//         labels: data.labels,
//         datasets: [{
//             label: 'Place Types',
//             data: data.data,
//             backgroundColor: data.backgroundColors,
//             borderColor: '#fff',
//             borderWidth: 2,
//             hoverBorderWidth: 3
//         }]
//     });

//     // Pie chart
//     updateChart('pieChart', {
//         labels: data.labels,
//         datasets: [{
//             label: 'Place Types Distribution',
//             data: data.data,
//             backgroundColor: data.backgroundColors,
//             borderColor: '#fff',
//             borderWidth: 2,
//             hoverOffset: 10
//         }]
//     });
// }

// // Update the map with new markers
// function updateMap(markers) {
//     // Clear existing markers
//     map.eachLayer((layer) => {
//         if (layer instanceof L.Marker) {
//             map.removeLayer(layer);
//         }
//     });

//     // Custom icons for different place types
//     const icons = {
//         'restaurant': L.icon({ iconUrl: 'https://img.icons8.com/color/48/restaurant.png' }),
//         'cafe': L.icon({ iconUrl: 'https://img.icons8.com/color/48/cafe.png' }),
//         'park': L.icon({ iconUrl: 'https://img.icons8.com/color/48/park.png' }),
//         'museum': L.icon({ iconUrl: 'https://img.icons8.com/color/48/museum.png' }),
//         'night_club': L.icon({ iconUrl: 'https://img.icons8.com/color/48/dj.png' })
//     };

//     // Add new markers to the map
//     markers.forEach(marker => {
//         const markerIcon = icons[marker.types.find(type => icons[type])] || L.Icon.Default;
//         L.marker([marker.lat, marker.lng], { icon: markerIcon })
//             .addTo(map)
//             .bindPopup(`<strong>${marker.name}</strong><br>Types: ${marker.types.join(', ')}`);
//     });

//     // Adjust the map view to fit all markers
//     const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
//     map.fitBounds(bounds);
// }

// // Update the chart with new data
// function updateChart(chartId, data) {
//     const ctx = document.getElementById(chartId).getContext('2d');
//     new Chart(ctx, {
//         type: chartId === 'pieChart' ? 'pie' : 'bar',
//         data: {
//             labels: data.labels,
//             datasets: data.datasets
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: {
//                     display: true,
//                     position: 'bottom',
//                     labels: {
//                         color: '#333',
//                         font: {
//                             size: 14,
//                             family: 'Roboto, sans-serif'
//                         }
//                     }
//                 },
//                 tooltip: {
//                     backgroundColor: 'rgba(0,0,0,0.7)',
//                     bodyFont: {
//                         size: 14,
//                         family: 'Roboto, sans-serif'
//                     }
//                 }
//             },
//             animation: {
//                 duration: 1000,
//                 easing: 'easeInOutQuart'
//             }
//         }
//     });
// }

// // Call this function to initialize and update the dashboard with real data
// updateDashboard();
// Test bar chart with static data
const testBarChartData = {
    labels: ['Restaurant', 'Cafe', 'Park'],
    datasets: [{
      label: 'Test Data',
      data: [12, 19, 3],
      backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)']
    }]
  };
  
  const ctx1 = document.getElementById('barChart').getContext('2d');
  new Chart(ctx1, {
    type: 'bar',
    data: testBarChartData
  });