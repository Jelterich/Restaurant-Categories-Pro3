let name = 'Top 10 Cities With Most Restaurant Categories';
let title = `${name}'s First Plotly Chart`;

// Data for the top 10 major cities and restaurant categories
let cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", 
              "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
let restaurantCategories = [150, 130, 120, 110, 105, 100, 95, 90, 85, 80]; // Example data

// Define the trace for the bar chart
let trace1 = {
    x: cities,            // x-axis: cities
    y: restaurantCategories, // y-axis: number of restaurant per categories
    type: 'bar'           // Bar chart type
};

let data = [trace1];

// Layout configuration
let layout = {
    title: title
};

// Render the plot in a div with id 'plot'
Plotly.newPlot("plot", data, layout);



let catigory = 'Top Restaurant Categories in Selected City';
let title2 = `${name} - New York`;  // Update dynamically when the city is selected

// Data for a selected city's restaurant categories
let restaurantCategories2 = ["Italian", "Chinese", "Mexican", "Japanese", "Indian", "Fast Food", "Seafood", "American", "French", "Vegan"];
let categoryCounts = [50, 30, 25, 20, 15, 10, 8, 5, 4, 3]; // Example data for New York

// Define the trace for the pie chart
let trace2 = {
    labels: restaurantCategories, // Labels for the pie chart (categories)
    values: categoryCounts,       // Values (number of restaurants for each category)
    type: 'pie'                   // Pie chart type
};

let data2 = [trace1];

// Layout configuration
let layout2 = {
    title: title
};

// Render the pie chart in a div with id 'plot'
Plotly.newPlot("plot2", data, layout);