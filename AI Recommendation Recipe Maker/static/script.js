async function generateRecipe() {
    const recipeName = document.getElementById("recipe_name").value.trim();
    const ingredients = document.getElementById("ingredients").value.trim();
    const diet = document.getElementById("diet").value;
    const recipeDiv = document.getElementById("recipe");
    const loadingSpinner = document.getElementById("loading");

    if (!recipeName || !ingredients) {
        alert("Please enter a recipe name and ingredients!");
        return;
    }

    // Show loading spinner
    loadingSpinner.style.display = "block";
    recipeDiv.innerHTML = ""; // Clear previous recipe

    try {
        const response = await fetch("/generate_recipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipe_name: recipeName, ingredients: ingredients, diet: diet })
        });

        const data = await response.json();
        let formattedRecipe = formatRecipe(recipeName, data.recipe || "Error generating recipe.");
        recipeDiv.innerHTML = formattedRecipe;

    } catch (error) {
        recipeDiv.innerHTML = "<p style='color: red;'>Error fetching recipe.</p>";
    } finally {
        // Hide loading spinner after recipe is generated
        loadingSpinner.style.display = "none";
    }
}

// Function to format the AI-generated recipe text
function formatRecipe(recipeName, recipeText) {
    let formattedText = `<h1 class="recipe-title">${recipeName}</h1>`;

    // Highlight key sections
    formattedText += recipeText
        .replace(/\bYields:\b/gi, "<h3 class='highlight'>🔹 Yields:</h3>")
        .replace(/\bPrep Time:\b/gi, "<h3 class='highlight'>🔹 Prep Time:</h3>")
        .replace(/\bCook Time:\b/gi, "<h3 class='highlight'>🔹 Cook Time:</h3>")
        .replace(/\bTips and Variations:\b/gi, "<h3 class='highlight'>🔹 Tips & Variations:</h3>")
        .replace(/\bIngredients\b:/gi, "<h3 class='highlight'>🔹 Ingredients:</h3>")
        .replace(/\bInstructions\b:/gi, "<h3 class='highlight'>🔹 Instructions:</h3>")
        .replace(/\n/g, "<br>"); // Preserve line breaks

    // Convert ingredients & instructions into bullet points
    formattedText = formattedText.replace(/🔹 Ingredients:<br>([\s\S]*?)<br>🔹 Instructions:/gi, function(match, p1) {
        return "<h3 class='highlight'>🔹 Ingredients:</h3><ul class='recipe-list'>" + 
               p1.replace(/• /g, "<li>• ") + "</li></ul><h3 class='highlight'>🔹 Instructions:</h3>";
    });

    formattedText = formattedText.replace(/🔹 Instructions:<br>([\s\S]*)/gi, function(match, p1) {
        return "<h3 class='highlight'>🔹 Instructions:</h3><ol class='recipe-list'>" + 
               p1.replace(/• /g, "<li>• ") + "</li></ol>";
    });

    return formattedText;
}
