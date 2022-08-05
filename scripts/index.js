import { recipes } from './recipes.js'

//API call to get data from json and return the recipes data
async function getRecipesData(input, tags) {
    var data = await fetch('assets/recipes.json').then(res => res.json()).catch(err => console.log("Error retrieving data", err))


    if (input) {
        const dataSearch = data
        data = { recipes: [] }
        for (recipe of dataSearch.recipes) {
            if (recipe.name.toLowerCase().includes(input.toLowerCase())) {
                data.recipes.push(recipe)
            }
        }
    }

    return data
}

//Initialisation function
async function init(input, tags) {
    const recipesData = await getRecipesData(input, tags);
    console.log(recipesData)
    displayrecipesData(recipesData)
};

init();

document.querySelector('.form-control').addEventListener('input', function (e) {
    if (e.target.value.length > 1) {
        init(e.target.value)
    } else {
        init()
    }
})

console.log(recipes)