const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 3000;

// CORS middleware to allow requests from frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

// Endpoint to return top cities with restaurant counts
app.get('/top_cities', (req, res) => {
  const results = [];
  fs.createReadStream('filtered_restaurants2.csv')
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      // Group by city and count restaurants
      const cityCounts = results.reduce((acc, curr) => {
        const city = curr.city;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {});
      
      // Convert to array and sort by count
      const sortedCities = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, restaurant_count: count }))
        .sort((a, b) => b.restaurant_count - a.restaurant_count)
        .slice(0, 10); // Top 10 cities

      res.json(sortedCities);
    });
});

// Endpoint to return restaurant categories by city
app.get('/categories/:city', (req, res) => {
  const city = req.params.city;
  const results = [];

  fs.createReadStream('category_counts.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (data.city === city) {
        results.push({ category: data.category, count: data.count });
      }
    })
    .on('end', () => {
      if (results.length > 0) {
        const categories = results.reduce((acc, curr) => {
          acc[curr.category] = parseInt(curr.count, 10);
          return acc;
        }, {});

        res.json(categories);
      } else {
        res.status(404).json({ error: "City not found" });
      }
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});