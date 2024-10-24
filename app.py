import pandas as pd
from pymongo import MongoClient
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import webbrowser
import os

app = Flask(__name__)
CORS(app)

client = MongoClient(port=27017)
db = client['yelp_database']
collection = db['businesses']


df = pd.read_json('yelp_academic_dataset_business.json', lines=True)


df['categories'] = df['categories'].astype(str)
df_restaurants = df[df['categories'].str.contains('Restaurants', case=False, na=False)]

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

df_restaurants_clean = df_restaurants[['business_id', 'name', 'city', 'state', 'latitude', 'longitude', 'categories', 'stars']]
# Create a proper copy first
df_restaurants_clean = df_restaurants[['business_id', 'name', 'city', 'state', 'latitude', 'longitude', 'categories', 'stars']].copy()

# Function to clean categories
def clean_categories(categories_str):
    if isinstance(categories_str, str):
        categories_list = [cat.strip() for cat in categories_str.split(',')]
        categories_list = [cat for cat in categories_list if cat not in ['Restaurant', 'Restaurants', 'Food']]
        return ', '.join(categories_list) if categories_list else None
    return None
df_restaurants_clean['categories'] = df_restaurants_clean['categories'].apply(clean_categories)
collection.delete_many({})

if collection.count_documents({}) == 0:
    records = df_restaurants_clean.to_dict('records')
    collection.insert_many(records)
    print("Data loaded into MongoDB successfully.")
else:
    print("Data already exists in MongoDB.")

@app.route('/categories', methods=['GET'])
def get_categories():
    return jsonify({
        'strict_restaurant_categories': strict_restaurant_categories
    })


@app.route('/query_restaurants/<category>', methods=['GET'])
def query_restaurants(category):
    query = {"categories": {'$regex': category, '$options': 'i'}}

    results = list(collection.find(query))

    for result in results:
        result['_id'] = str(result['_id'])

    return jsonify(results)


base_dir = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def serve_html():
    return send_from_directory(base_dir, 'index.html')


@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory(base_dir, path)


webbrowser.open('http://localhost:5000/')
if __name__ == '__main__':
    app.run(debug=True)



