# %%
import pandas as pd
from pymongo import MongoClient
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import webbrowser
import os


# %%
app = Flask(__name__)
CORS(app)

# %%
client = MongoClient(port=27017)
db = client['yelp_database']
collection = db['businesses']

# %%

# Read JSON file into a pandas DataFrame. Use lines=true because of the json format being a serie of jsons, one on each line.
df = pd.read_json('yelp_academic_dataset_business.json', lines=True)

# %%
df.head()

# %%
df['categories'] = df['categories'].astype(str)

# %%
# Filter dataframe down to only businesses with restaurant in their categories
df_restaurants = df[df['categories'].str.contains('Restaurants', case=False, na=False)]

# %%
len(df_restaurants)


# %%
## list unique restaurant categories ##

# Step 1: Split the categories and create a flat list
all_categories = df_restaurants['categories'].str.split(', ').explode()

# Step 2: Get unique values and sort them
unique_categories = sorted(all_categories.unique())

# Step 3: Print the list of unique categories
print("Unique categories:")
for category in unique_categories:
    print(category)

# If you want to know the total number of unique categories:
print(f"\nTotal number of unique categories: {len(unique_categories)}")

# %%

# Step 1: Split the categories and create a flat list
all_categories = df_restaurants['categories'].str.split(', ').explode()

# Step 2: Count the occurrences of each category
category_counts = all_categories.value_counts().sort_values()

# Step 3: Print the results
print("Unique categories and their counts (from smallest to largest):")
for category, count in category_counts.items():
    print(f"{category}: {count}")

# Print total number of unique categories
print(f"\nTotal number of unique categories: {len(category_counts)}")

# %%
# search categories
search_term = "station"
zoo_businesses = df_restaurants[df_restaurants['categories'].str.contains(search_term, case=False, na=False)]

# Display the results
print(f"Number of businesses with {search_term} in their category: {len(zoo_businesses)}")

# Display the first few rows of the results
print(zoo_businesses[['name', 'city', 'state', 'categories']].head())

# If you want to see all unique category combinations that include the searched category
zoo_categories = zoo_businesses['categories'].unique()
print(f"\nUnique category combinations including {search_term}:")
for categories in zoo_categories:
    print(categories)

# %%
strict_restaurant_categories = [
    "Restaurants", "American (Traditional)", "American (New)", "Italian", 
    "Mexican", "Chinese", "Japanese", "Thai", "Vietnamese", "Indian", "Korean", 
    "Mediterranean", "Greek", "French", "Spanish", "German", "Irish", "British", 
    "Seafood", "Steakhouses", "Pizza", "Burgers", "Sushi Bars", 
    "Barbeque", "Asian Fusion", "Diners", "Breakfast & Brunch", 
    "Buffets", "Comfort Food", "Soul Food", "Southern", 
    "Tex-Mex", "Cajun/Creole", "Latin American", "Middle Eastern", "African", 
    "Caribbean", "Brazilian", "Peruvian", "Cuban", "Tapas Bars", "Gastropubs",
    "Izakaya", "Ramen", "Poke", "Hot Pot", "Dim Sum", "Fondue",
    "Fish & Chips", "Bistros", "Brasseries",
    "Donairs", "Kebab", "Falafel", "Tacos", "Cheesesteaks"
]


food_related_categories = [
    "Food", "Sandwiches", "Cafes", "Fast Food", "Pubs", 
    "Halal", "Kosher", "Vegan", "Vegetarian",
    "Gluten-Free", "Organic", "Farm-to-table", "Food Trucks", "Food Stands",
    "Creperies", "Delis", "Noodles", "Soup", "Salad", "Chicken Wings",
    "Chicken Shop", "Hot Dogs", "Waffles", "Pancakes", "Donuts", "Bagels",
    "Food", "Specialty Food", "Caterers", "Bakeries", "Desserts", "Juice Bars & Smoothies",
    "Ice Cream & Frozen Yogurt", "Gelato", "Coffee & Tea"
]

# %%
 # Select relevant columns
df_restaurants_clean = df_restaurants[['business_id', 'name', 'city', 'state', 'latitude', 'longitude', 'categories', 'stars']]
df_restaurants_clean.head()

# %%
# Connect to MongoDB
if collection.count_documents({}) == 0:
    records = df_restaurants_clean.to_dict('records')
    collection.insert_many(records)
    print("Data loaded into MongoDB successfully.")
else:
    print("Data already exists in MongoDB.")

# %%
# Setup flask api routes
@app.route('/categories', methods=['GET'])
def get_categories():
    return jsonify({
        'strict_restaurant_categories': strict_restaurant_categories,
        'food_related_categories': food_related_categories
    })

@app.route('/query_restaurants', methods=['POST'])
def query_restaurants():
    query_params = request.json
    query = {}
    
    # Handle different query parameters
    if 'category' in query_params:
        query['categories'] = {'$regex': query_params['category'], '$options': 'i'}
    if 'city' in query_params:
        query['city'] = query_params['city']
    if 'state' in query_params:
        query['state'] = query_params['state']
    if 'min_stars' in query_params:
        query['stars'] = {'$gte': query_params['min_stars']}
    results = list(collection.find(query))
    # Convert ObjectId to string for JSON serialization
    for result in results:
        result['_id'] = str(result['_id'])
    return jsonify(results)

# open HTML file        webbroweser.open needs the full path of the .html to work. os.path.abspath will provide the full path to the folder that the python script is in. 
def open_html_file():
    # Get the absolute path to the HTML file
    html_path = os.path.abspath('index copy.html')
    # Open the HTML file
    webbrowser.open(html_path)
if __name__ == '__main__':
    open_html_file()
    app.run(debug=True)
    



