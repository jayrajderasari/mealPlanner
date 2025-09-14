console.log("Hello")

const ingredientsData = {
    vegetables: ['potato', 'onion', 'green chili', 'ginger', 'tomato', 'cauliflower', 'carrot', 'bell pepper', 'spinach', 'cabbage', 'peas', 'mushroom', 'broccoli'],
    flours: ['rice flour', 'urad dal', 'poha', 'semolina', 'idli rice', 'rajma', 'chickpea flour', 'whole wheat flour', 'all-purpose flour'],
    spices: ['mustard seeds', 'curry leaves', 'turmeric', 'cumin', 'coriander', 'red chili powder', 'garam masala', 'asafoetida', 'fenugreek seeds'],
    dairy: ['milk', 'yogurt', 'paneer', 'butter', 'ghee', 'cheese']
};

function populateCheckboxes() {
    const vegetablesContainer = document.getElementById('vegetables-checkboxes');
    const floursContainer = document.getElementById('flours-checkboxes');
    const spicesContainer = document.getElementById('spices-checkboxes');
    const dairyContainer = document.getElementById('dairy-checkboxes');

    ingredientsData.vegetables.forEach(item => {
        vegetablesContainer.innerHTML += `<div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" value="${item}" id="veg-${item}">
            <label class="form-check-label" for="veg-${item}">${item}</label>
        </div>`;
    });

    ingredientsData.flours.forEach(item => {
        floursContainer.innerHTML += `<div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" value="${item}" id="flour-${item}">
            <label class="form-check-label" for="flour-${item}">${item}</label>
        </div>`;
    });

    ingredientsData.spices.forEach(item => {
        spicesContainer.innerHTML += `<div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" value="${item}" id="spice-${item}">
            <label class="form-check-label" for="spice-${item}">${item}</label>
        </div>`;
    });

    ingredientsData.dairy.forEach(item => {
        dairyContainer.innerHTML += `<div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" value="${item}" id="dairy-${item}">
            <label class="form-check-label" for="dairy-${item}">${item}</label>
        </div>`;
    });
}

function setupSelectAll() {
    document.getElementById('select-all-vegetables').addEventListener('click', () => {
        document.querySelectorAll('#vegetables-checkboxes .form-check-input').forEach(box => box.checked = true);
    });
    document.getElementById('select-all-flours').addEventListener('click', () => {
        document.querySelectorAll('#flours-checkboxes .form-check-input').forEach(box => box.checked = true);
    });
    document.getElementById('select-all-spices').addEventListener('click', () => {
        document.querySelectorAll('#spices-checkboxes .form-check-input').forEach(box => box.checked = true);
    });
    document.getElementById('select-all-dairy').addEventListener('click', () => {
        document.querySelectorAll('#dairy-checkboxes .form-check-input').forEach(box => box.checked = true);
    });
}

function setupClearButtons() {
    document.getElementById('clear-vegetables').addEventListener('click', () => {
        document.querySelectorAll('#vegetables-checkboxes .form-check-input').forEach(box => box.checked = false);
    });
    document.getElementById('clear-flours').addEventListener('click', () => {
        document.querySelectorAll('#flours-checkboxes .form-check-input').forEach(box => box.checked = false);
    });
    document.getElementById('clear-spices').addEventListener('click', () => {
        document.querySelectorAll('#spices-checkboxes .form-check-input').forEach(box => box.checked = false);
    });
    document.getElementById('clear-dairy').addEventListener('click', () => {
        document.querySelectorAll('#dairy-checkboxes .form-check-input').forEach(box => box.checked = false);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateCheckboxes();
    setupSelectAll();
    setupClearButtons();
    document.getElementById('clearButton').addEventListener('click', () => {
        document.querySelectorAll('.form-check-input').forEach(box => box.checked = false);
        document.getElementById('cuisineInput').selectedIndex = 0;
        document.getElementById('mealTypeInput').selectedIndex = 0;
        document.getElementById('cookingTimeInput').value = '';
        document.getElementById('content-container').innerHTML = '';
    });
});


document.getElementById('submitButton').addEventListener('click', fetchData)

async function fetchData() {
    let cuisine = document.getElementById('cuisineInput').value
    let meal_type = document.getElementById('mealTypeInput').value
    let cooking_time = document.getElementById('cookingTimeInput').value
    
    let selectedIngredients = [];
    document.querySelectorAll('.form-check-input:checked').forEach(box => {
        selectedIngredients.push(box.value);
    });
    let ingredients = selectedIngredients.join(',');

    let url = `/api/meal?cuisine=${cuisine}&meal_type=${meal_type}&cooking_time=${cooking_time}&ingredients=${ingredients}`
    
    let res = await fetch(url)
    let res_json = await res.json()
    console.log(res_json)

    if (res_json.error) {
        document.getElementById('content-container').innerHTML = `<h3> ${res_json.error} </h3>`
    } else {
        let ingredientsHTML = res_json.ingredients.join(', ');
        let missingIngredientsHTML = '';

        if (res_json.missing_ingredients && res_json.missing_ingredients.length > 0) {
            missingIngredientsHTML = `
                <h5 class="text-danger">Ingredients to Buy:</h5>
                <p class="text-danger">${res_json.missing_ingredients.join(', ')}</p>
            `;
            
            // Highlight missing ingredients in the main list
            ingredientsHTML = res_json.ingredients.map(ing => {
                return res_json.missing_ingredients.includes(ing) 
                    ? `<strong class="text-danger">${ing}</strong>` 
                    : ing;
            }).join(', ');
        }

        document.getElementById('content-container').innerHTML = 
        `<h3> ${res_json.name} </h3>
        <img src="${res_json.image}" class="rounded mx-auto d-block" alt="...">
        <p class="mt-3">${res_json.description}</p>
        ${missingIngredientsHTML}
        <h5>Ingredients:</h5>
        <p>${ingredientsHTML}</p>
        <h5>Recipe:</h5>
        <p style="white-space: pre-wrap;">${res_json.recipe}</p>`
    }
}