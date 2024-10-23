# Flavor Frontier Analysts

"Exploring Taste, Unlocking Insights" - A data visualization platform for restaurant insights across the United States.

## Overview

This web application analyzes and visualizes Yelp restaurant data, providing interactive visualizations to explore restaurant categories and their geographic distribution. The application features a heat map, category-specific bar charts, and interactive pie charts showing the distribution of restaurant categories across cities.

## Features

- **Interactive Heat Map**: Visualizes restaurant density across the United States (40% viewport height)
- **Top Cities Bar Chart**: Displays the top 10 cities for any selected restaurant category (30% viewport height)
- **Category Distribution Pie Chart**: Shows top 5 categories in selected cities (30% viewport height)
- **Interactive Features**: 
  - Category selection dropdown
  - Click-through functionality from bar chart to update pie chart
  - Responsive layout design

## Technology Stack

### Backend
- Python Flask server
- MongoDB database
- JSON data processing

### Frontend
- HTML5/CSS3
- JavaScript
- External Libraries:
  - Bootstrap 5.3.0 (UI framework)
  - Leaflet 1.7.1 (mapping)
  - Leaflet.heat (heat map visualization)
  - Leaflet-choropleth (geographic data visualization)
  - Chart.js (interactive charts)

## Running the Application

1. Ensure all files are in the same directory, and add the Yelp json file to the same directory.

2. Start the Flask server:
```bash
python app.py
```

## Usage

1. Select a restaurant category from the dropdown menu
2. Observe the heat map showing restaurant density
3. Review the bar chart showing top 10 cities for selected category
4. Click on any city in the bar chart to update the pie chart with that city's category distribution

## Data Flow

1. Backend server (app.py) reads and processes the Yelp dataset
2. Processed data is stored in MongoDB
3. Flask server provides two main endpoints:
   - GET /categories - Returns available restaurant categories
   - GET /restaurants - Returns restaurant data based on selected category
4. Frontend (flasktest2-1.js) handles:
   - User interactions
   - Data visualization updates
   - Chart interactions

## Directory Structure
FLAT
```

## Future Enhancements

- Additional filtering options
- More detailed restaurant information
- Expanded geographic analysis
- Time-based visualizations
- User preferences storage

## License

Apache

## Acknowledgments

- Yelp for providing the dataset
- Contributors and maintainers of the used libraries

## Contributions
- The team shared an equal workload accross the project.

---
For questions or support, please [create an issue](your-repo-issues-link) in the repository.