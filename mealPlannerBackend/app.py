from flask import Flask, request, redirect, render_template, url_for
import random, json, os
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson import json_util

app = Flask(__name__, static_folder='../mealPlannerFrontend', static_url_path='')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# MongoDB setup
URI = os.environ.get("MONGODB_URI")
client = MongoClient(URI)
db = client['mealPlannerDB']
dishes_collection = db['dishes']




@app.route('/api/meal')
@cross_origin()
def menu():
    cuisine = request.args.get('cuisine')
    meal_type = request.args.get('meal_type')
    cooking_time = request.args.get('cooking_time')
    ingredients_str = request.args.get('ingredients', '')
    
    # Basic validation
    if not all([cuisine, meal_type, cooking_time]):
        return json.dumps({"error": "Cuisine, meal type, and cooking time are required."}), 400

    try:
        time_limit = int(cooking_time)
        user_ingredients = {i.strip() for i in ingredients_str.split(',') if i.strip()}
    except ValueError:
        return json.dumps({"error": "Invalid cooking time format."}), 400

    # Initial filtering based on cuisine, meal type, and time
    query = {
        'cuisine': cuisine,
        'meal_type': meal_type,
        'cooking_time': {'$lte': time_limit}
    }
    candidate_dishes = list(dishes_collection.find(query))

    if not candidate_dishes:
        return json.dumps({"error": "No dishes match your criteria of cuisine, meal type, and cooking time."}), 404

    # Find the best match based on ingredients, or suggest a random dish if no ingredients match.
    best_dishes = []
    max_match_count = -1 # Start with -1 to ensure any match is higher

    if candidate_dishes:
        for dish in candidate_dishes:
            dish_ingredients = set(dish.get('ingredients', []))
            match_count = len(user_ingredients.intersection(dish_ingredients))

            if match_count > max_match_count:
                max_match_count = match_count
                best_dishes = [dish]
            elif match_count == max_match_count:
                best_dishes.append(dish)

        # If no ingredients matched at all, suggest a random dish from the candidates
        if max_match_count == 0:
            suggested_dish = random.choice(candidate_dishes)
        else:
            suggested_dish = random.choice(best_dishes)
        
        # Identify missing ingredients
        dish_ingredients_set = set(suggested_dish.get('ingredients', []))
        missing_ingredients = list(dish_ingredients_set - user_ingredients)
        suggested_dish['missing_ingredients'] = missing_ingredients

        return json_util.dumps(suggested_dish)
    else:
        # This part is now only reached if the initial query for cuisine, meal_type, and time returns nothing.
        # To fulfill the "always suggest something" requirement, we can broaden the search.
        # For now, we'll just return the original error if the base criteria are not met.
        return json.dumps({"error": "No dishes match your criteria of cuisine, meal type, and cooking time."}), 404

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__=='__main__':
    app.run(debug=True)