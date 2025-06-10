from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Set up Google Gemini AI API Key (Replace with your actual key)
genai.configure(api_key="AIzaSyDrkzsvbTU03fESOGxPYAWMe56dJpNS6L4")

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/generate_recipe', methods=['POST'])
def generate_recipe():
    data = request.json
    recipe_name = data.get('recipe_name', '')
    ingredients = data.get('ingredients', '')
    diet = data.get('diet', 'any')

    if not recipe_name or not ingredients:
        return jsonify({"error": "Please enter a recipe name and ingredients."}), 400

    prompt = f"Create a {diet} recipe for {recipe_name} using {ingredients}. Provide step-by-step instructions."

    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        return jsonify({"recipe": response.text})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
