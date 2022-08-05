//Create cards of selected recipes
async function displayrecipesData(recipesData) {
    const recipesSection = document.querySelector(".recipes")
    recipesSection.innerHTML = ''

    for (recette of recipesData.recipes) {
        const recipe = document.createElement('article')
        recipe.classList.add('recipe')
        const image = document.createElement('img')
        image.setAttribute("src", "assets/food.jpeg")
        recipe.appendChild(image)
        const informations = document.createElement('div')
        informations.classList.add('informations')
        const header = document.createElement('div')
        header.classList.add('header')
        const title = document.createElement('p')
        title.innerText = recette.name
        const time = document.createElement('p')
        time.innerText = recette.time + 'min'
        header.appendChild(title)
        header.appendChild(time)
        const details = document.createElement('div')
        details.classList.add('details')
        const ingredients = document.createElement('ul')
        for (ingredient of recette.ingredients) {
            const liste = document.createElement('li')
            for (property in ingredient) {
                liste.innerText += ingredient[property] + ' '
            }
            ingredients.appendChild(liste)
        }
        const instructions = document.createElement('p')
        instructions.classList.add('instructions')
        instructions.innerText = recette.description
        details.appendChild(ingredients)
        details.appendChild(instructions)
        informations.appendChild(header)
        informations.appendChild(details)
        recipe.appendChild(informations)
        recipesSection.appendChild(recipe)
    }
}