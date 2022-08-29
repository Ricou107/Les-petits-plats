import { recipes } from './recipes.js'
import { displayrecipesData } from './factory.js'

// Input field for the search
var input = ''

// Tags selected by the user to filter recipes
var tags = {
    ingredients: [],
    appliances: [],
    ustensils: []
}

// Tags available for filtering accordingly to the recipes displayed
var availableTags = {
    ingredients: [],
    appliances: [],
    ustensils: []
}

//Initialisation function
async function init() {
    let recipesToDIsplay = recipes
    availableTags = {
        ingredients: [],
        appliances: [],
        ustensils: []
    }

    // if there is an input, compute with the search
    if (input) {
        recipesToDIsplay = []
        for (let recipe of recipes) {
            if (recipe.name.toLowerCase().includes(input.toLowerCase())) {
                recipesToDIsplay.push(recipe)
            } else if (recipe.description.toLowerCase().includes(input.toLowerCase())) {
                recipesToDIsplay.push(recipe);
            } else for (let ingredients of recipe.ingredients) {
                if (ingredients.ingredient.toLowerCase().includes(input.toLowerCase())) {
                    recipesToDIsplay.push(recipe);
                }
            }
        }
    }

    // Is there any ingredient selected?
    if (tags.ingredients.length > 0) {
        let newRecipesToDisplay = []
        for (let i = 0; i < recipesToDIsplay.length; i++) {
            if (tags.ingredients.every(ingredient => { return JSON.stringify(recipesToDIsplay[i].ingredients).toLowerCase().includes(ingredient.toLowerCase()) })) {
                newRecipesToDisplay.push(recipesToDIsplay[i])
            }
        }
        recipesToDIsplay = newRecipesToDisplay
    }

    // Is there any appliance selected?
    if (tags.appliances.length > 0) {
        let newRecipesToDisplay = []
        for (let i = 0; i < recipesToDIsplay.length; i++) {
            if (tags.appliances.every(appliance => { return JSON.stringify(recipesToDIsplay[i].appliance).toLowerCase().includes(appliance.toLowerCase()) })) {
                newRecipesToDisplay.push(recipesToDIsplay[i])
            }
        }
        recipesToDIsplay = newRecipesToDisplay
    }

    // Is there any ustensil selected?
    if (tags.ustensils.length > 0) {
        let newRecipesToDisplay = []
        for (let i = 0; i < recipesToDIsplay.length; i++) {
            if (tags.ustensils.every(ustensil => { return JSON.stringify(recipesToDIsplay[i].ustensils).toLowerCase().includes(ustensil.toLowerCase()) })) {
                newRecipesToDisplay.push(recipesToDIsplay[i])
            }
        }
        recipesToDIsplay = newRecipesToDisplay
    }



    // Compute the new avaialble tags
    if (recipesToDIsplay.length > 0) {
        for (let recipe of recipesToDIsplay) {
            for (let ingredient of recipe.ingredients) {
                if (!availableTags.ingredients.includes(ingredient.ingredient) && !tags.ingredients.includes(ingredient.ingredient)) {
                    availableTags.ingredients.push(ingredient.ingredient)
                }
            }
            if (!availableTags.appliances.includes(recipe.appliance) && !tags.appliances.includes(recipe.appliance)) {
                availableTags.appliances.push(recipe.appliance)
            }
            for (let ustensil of recipe.ustensils) {
                if (!availableTags.ustensils.includes(ustensil) && !tags.ustensils.includes(ustensil)) {
                    availableTags.ustensils.push(ustensil)
                }
            }
        }

        console.log('recipesToDIsplay', recipesToDIsplay)
        console.log('availableTags', availableTags)
        console.log('tags', tags)

        // Compute the display of tags
        searchIngredientTag()
        searchApplianceTag()
        searchUstensilTag()

        // Display the recipes accordingly to the search
        displayrecipesData(recipesToDIsplay)


    } else {
        // If no recipes correspond to the search, an error message appear
        const recipesSection = document.querySelector(".recipes")
        recipesSection.innerHTML = 'Il n\'y a pas de recettes qui correspondent à votre recherche, dommage!'

        // Compute the display of tags
        searchIngredientTag()
        searchApplianceTag()
        searchUstensilTag()
    }

}

// Initial content
init();

// Input to search from string
document.querySelector('.form-control').addEventListener('input', function (e) {
    console.log(e.target.value, e.target.value.length)
    const tags = document.querySelector('.alertSection')
    tags.innerHTML = ''
    if (e.target.value.length > 2) {
        input = e.target.value
        init()
    } else if ((e.target.value.length == 1) || (e.target.value.length == 2)) {
        const tags = document.querySelector('.alertSection')
        const alert = document.createElement('div')
        alert.innerText = 'Entrez au moins trois caractères.'
        alert.classList.add('alert')
        alert.classList.add('alert-danger')
        tags.appendChild(alert)
    } else {
        input = ''
        init()
    }
})

// Search an ingredient from the list
document.querySelector('.ingredientInput').addEventListener('input', function (e) {
    searchIngredientTag(e.target.value)
})

// Enter a ingredient mandatory when pressing enter
document.querySelector('.ingredientInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.value.length > 1) {
        document.querySelector('.alertSection').innerHTML = ''
        addIngredientTag(e.target.value)
    }
});

// Function to add the mandatory ingredient
function addIngredientTag(tagIngredientToAdd) {
    const tagsAlert = document.querySelector('.alertSection')
    if (JSON.stringify(availableTags.ingredients).toLowerCase().includes(tagIngredientToAdd.toLowerCase())) {
        const ingredientSelected = availableTags.ingredients.find(ingredient => ingredient.toLowerCase() === tagIngredientToAdd.toLowerCase())
        if (ingredientSelected !== undefined) {
            const selectedTags = document.querySelector('.selectedTags')
            const newTag = document.createElement('button')
            newTag.setAttribute('type', 'button')
            newTag.classList.add('btn')
            newTag.classList.add('btn-primary')
            newTag.innerHTML = ingredientSelected + '        <i class="fas fa-times-circle"></i>'
            newTag.addEventListener('click', function () {
                selectedTags.removeChild(newTag)
                tags.ingredients.splice(tags.ingredients.indexOf(ingredientSelected), 1)
                init();
            })
            selectedTags.appendChild(newTag)
            tags.ingredients.push(ingredientSelected)
            const input = document.querySelector('.ingredientInput')
            input.value = ''
            tagsAlert.innerHTML = ''
            init();
        } else {
            const tags = document.querySelector('.alertSection')
            const alert = document.createElement('div')
            alert.innerText = 'Cet ingredient n\'est pas disponible dans la liste actuelle !'
            alert.classList.add('alert')
            alert.classList.add('alert-danger')
            tagsAlert.appendChild(alert)
        }
    } else {
        const tags = document.querySelector('.alertSection')
        const alert = document.createElement('div')
        alert.innerText = 'Cet ingredient n\'est pas disponible dans la liste actuelle !'
        alert.classList.add('alert')
        alert.classList.add('alert-danger')
        tagsAlert.appendChild(alert)
    }
}

// Function to display the list of ingredient depdending of the input
function searchIngredientTag(tagIngredientToSearch) {
    let liste = document.querySelector('.ingredientInputList')
    liste.innerHTML = ''

    let tagToDisplay = []

    if (tagIngredientToSearch !== undefined) {
        for (let ingredient of availableTags.ingredients) {
            if (ingredient.toLowerCase().includes(tagIngredientToSearch.toLowerCase())) {
                tagToDisplay.push(ingredient)
            }
        }
    } else {
        tagToDisplay = availableTags.ingredients
    }

    for (let ingredient of tagToDisplay) {
        let newIngredient = document.createElement('div')
        newIngredient.innerHTML = ingredient
        newIngredient.addEventListener('click', function () {
            addIngredientTag(ingredient)
        })
        liste.appendChild(newIngredient)
    }

    if (tagToDisplay.length === 0) {
        let error = document.createElement('p')
        error.innerText = 'Il n\'y a pas/plus d\'ingredient disponible :('
        liste.appendChild(error)
    }
}

// Search an appliance from the list
document.querySelector('.applianceInput').addEventListener('input', function (e) {
    searchApplianceTag(e.target.value)
})

// Enter an appliance mandatory when pressing enter
document.querySelector('.applianceInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.querySelector('.alertSection').innerHTML = ''
        addIngredientTag(e.target.value)
    }
});

// Function to add the mandatory appliance
function addApplianceTag(tagApplianceToAdd) {
    const tagsAlert = document.querySelector('.alertSection')
    if (JSON.stringify(availableTags.appliances).toLowerCase().includes(tagApplianceToAdd.toLowerCase())) {
        const applianceSelected = availableTags.appliances.find(appliance => appliance.toLowerCase() === tagApplianceToAdd.toLowerCase())
        if (applianceSelected !== undefined) {
            const selectedTags = document.querySelector('.selectedTags')
            const newTag = document.createElement('button')
            newTag.setAttribute('type', 'button')
            newTag.classList.add('btn')
            newTag.classList.add('btn-appliance')
            newTag.innerHTML = applianceSelected + '       <i class="fas fa-times-circle"></i>'
            newTag.addEventListener('click', function () {
                selectedTags.removeChild(newTag)
                tags.appliances.splice(tags.appliances.indexOf(applianceSelected), 1)
                init();
            })
            selectedTags.appendChild(newTag)
            tags.appliances.push(applianceSelected)
            const input = document.querySelector('.applianceInput')
            input.value = ''
            tagsAlert.innerHTML = ''
            init();
        }
        else {
            const alert = document.createElement('div')
            alert.innerText = 'Cet appliance n\'est pas disponible dans la liste actuelle !'
            alert.classList.add('alert')
            alert.classList.add('alert-danger')
            tagsAlert.appendChild(alert)
        }
    } else {
        const alert = document.createElement('div')
        alert.innerText = 'Cet appliance n\'est pas disponible dans la liste actuelle !'
        alert.classList.add('alert')
        alert.classList.add('alert-danger')
        tagsAlert.appendChild(alert)
    }
}

// Function to display the list of appliance depdending of the input
function searchApplianceTag(tagApplianceToSearch) {
    let liste = document.querySelector('.applianceInputList')
    liste.innerHTML = ''

    let tagToDisplay = []

    if (tagApplianceToSearch !== undefined) {
        for (let appliance of availableTags.appliances) {
            if (appliance.toLowerCase().includes(tagApplianceToSearch.toLowerCase())) {
                tagToDisplay.push(appliance)
            }
        }
    } else {
        tagToDisplay = availableTags.appliances
    }

    for (let appliance of tagToDisplay) {
        let newAppliance = document.createElement('div')
        newAppliance.innerHTML = appliance
        newAppliance.addEventListener('click', function () {
            addApplianceTag(appliance)
        })
        liste.appendChild(newAppliance)
    }

    if (tagToDisplay.length === 0) {
        let error = document.createElement('p')
        error.innerText = 'Il n\'y a pas/plus d\'appareil disponible :('
        liste.appendChild(error)
    }
}


// Search an ustensil from the list
document.querySelector('.ustensilInput').addEventListener('input', function (e) {
    searchUstensilTag(e.target.value)
})

// Enter an ustensil mandatory when pressing enter
document.querySelector('.ustensilInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.querySelector('.alertSection').innerHTML = ''
        addIngredientTag(e.target.value)
    }
});

// Function to add the mandatory ustensil
function addUstensilTag(tagUstensilToAdd) {
    const tagsAlert = document.querySelector('.alertSection')
    if (JSON.stringify(availableTags.ustensils).toLowerCase().includes(tagUstensilToAdd.toLowerCase())) {
        const ustensilSelected = availableTags.ustensils.find(ustensil => ustensil.toLowerCase() === tagUstensilToAdd.toLowerCase())
        if (ustensilSelected !== undefined) {
            const selectedTags = document.querySelector('.selectedTags')
            const newTag = document.createElement('button')
            newTag.setAttribute('type', 'button')
            newTag.classList.add('btn')
            newTag.classList.add('btn-ustensil')
            newTag.innerHTML = ustensilSelected + '    <i class="fas fa-times-circle"></i>'
            newTag.addEventListener('click', function () {
                selectedTags.removeChild(newTag)
                tags.ustensils.splice(tags.ustensils.indexOf(ustensilSelected), 1)
                init();
            })
            selectedTags.appendChild(newTag)
            tags.ustensils.push(ustensilSelected)
            const input = document.querySelector('.ustensilInput')
            input.value = ''
            tagsAlert.innerHTML = ''
            init();
        } else {
            const tags = document.querySelector('.alertSection')
            const alert = document.createElement('div')
            alert.innerText = 'Cet ustensile n\'est pas disponible dans la liste actuelle !'
            alert.classList.add('alert')
            alert.classList.add('alert-danger')
            tagsAlert.appendChild(alert)
        }
    } else {
        const tags = document.querySelector('.alertSection')
        const alert = document.createElement('div')
        alert.innerText = 'Cet ustensile n\'est pas disponible dans la liste actuelle !'
        alert.classList.add('alert')
        alert.classList.add('alert-danger')
        tagsAlert.appendChild(alert)
    }
}

// Function to display the list of ustensil depdending of the input
function searchUstensilTag(tagUstensilToSearch) {
    let liste = document.querySelector('.ustensilInputList')
    liste.innerHTML = ''

    let tagToDisplay = []

    if (tagUstensilToSearch !== undefined) {
        for (let ustensil of availableTags.ustensils) {
            if (ustensil.toLowerCase().includes(tagUstensilToSearch.toLowerCase())) {
                tagToDisplay.push(ustensil)
            }
        }
    } else {
        tagToDisplay = availableTags.ustensils
    }

    for (let ustensil of tagToDisplay) {
        let newUstensil = document.createElement('div')
        newUstensil.innerHTML = ustensil
        newUstensil.addEventListener('click', function () {
            addUstensilTag(ustensil)
        })
        liste.appendChild(newUstensil)
    }

    if (tagToDisplay.length === 0) {
        let error = document.createElement('p')
        error.innerText = 'Il n\'y a pas/plus d\'ustensile disponible :('
        liste.appendChild(error)
    }
}