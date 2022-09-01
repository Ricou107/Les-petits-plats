import { recipes } from "./recipes.js";
import { displayRecipesData } from "./factory.js";

// Input field for the search
var input = "";

// Tags selected by the user to filter recipes
var tags = {
  ingredients: [],
  appliance: [],
  ustensils: [],
};

// Tags available for filtering accordingly to the recipes displayed
var availableTags = {
  ingredients: [],
  appliance: [],
  ustensils: [],
};

//Initialisation function
async function init() {
  let recipesToDisplay = recipes;
  availableTags = {
    ingredients: [],
    appliance: [],
    ustensils: [],
  };

  // if there is an input, compute with the search
    if (input) {
      recipesToDisplay = [];
      for (let recipe of recipes) {
        if (recipe.name.toLowerCase().includes(input.toLowerCase())) {
          recipesToDisplay.push(recipe);
        } else if (
          recipe.description.toLowerCase().includes(input.toLowerCase())
        ) {
          recipesToDisplay.push(recipe);
        } else
          for (let ingredients of recipe.ingredients) {
            if (
              ingredients.ingredient.toLowerCase().includes(input.toLowerCase())
            ) {
              recipesToDisplay.push(recipe);
            }
          }
      }
    }

  // Is there any ingredient, appliance or ustensil selected? If yes, filter the recipes to display
  Object.entries(tags).map((category) => {
    if (category[1].length > 0) {
      let newrecipesToDisplay = [];
      for (let i = 0; i < recipesToDisplay.length; i++) {
        if (
          category[1].every((item) => {
            return JSON.stringify(recipesToDisplay[i][category[0]])
              .toLowerCase()
              .includes(item.toLowerCase());
          })
        ) {
          newrecipesToDisplay.push(recipesToDisplay[i]);
        }
      }
      recipesToDisplay = newrecipesToDisplay;
    }
  });

  // Compute the new available tags
  if (recipesToDisplay.length > 0) {
    for (let recipe of recipesToDisplay) {
      for (let ingredient of recipe.ingredients) {
        if (
          !availableTags.ingredients.includes(ingredient.ingredient) &&
          !tags.ingredients.includes(ingredient.ingredient)
        ) {
          availableTags.ingredients.push(ingredient.ingredient);
        }
      }
      if (
        !availableTags.appliance.includes(recipe.appliance) &&
        !tags.appliance.includes(recipe.appliance)
      ) {
        availableTags.appliance.push(recipe.appliance);
      }
      for (let ustensil of recipe.ustensils) {
        if (
          !availableTags.ustensils.includes(ustensil) &&
          !tags.ustensils.includes(ustensil)
        ) {
          availableTags.ustensils.push(ustensil);
        }
      }
    }

    console.log("recipesToDisplay", recipesToDisplay);
    console.log("availableTags", availableTags);
    console.log("tags", tags);

    // Compute the display of tags
    for (let tag in tags) {
      searchTag(tag);
    }

    // Display the recipes accordingly to the search
    displayRecipesData(recipesToDisplay);
  } else {
    // If no recipes correspond to the search, an error message appear
    const recipesSection = document.querySelector(".recipes");
    recipesSection.innerHTML =
      "Il n'y a pas de recettes qui correspondent à votre recherche, dommage!";

    // Compute the display of tags
    for (let tag in tags) {
      searchTag(tag);
    }
  }
}

// Initial content
init();

// Input to search from string
document.querySelector(".form-control").addEventListener("input", function (e) {
  console.log(e.target.value, e.target.value.length);
  const tags = document.querySelector(".alertSection");
  tags.innerHTML = "";
  if (e.target.value.length > 2) {
    input = e.target.value;
    init();
  } else if (e.target.value.length == 1 || e.target.value.length == 2) {
    const tags = document.querySelector(".alertSection");
    const alert = document.createElement("div");
    alert.innerText = "Entrez au moins trois caractères.";
    alert.classList.add("alert");
    alert.classList.add("alert-danger");
    tags.appendChild(alert);
  } else {
    input = "";
    init();
  }
});

for (let tag in tags) {
  // Search an tag from the list
  document
    .querySelector(`.${tag}Input`)
    .addEventListener("input", function (e) {
      searchTag(tag, e.target.value);
    });

  // Enter a tag mandatory within a recipe when pressing enter
  document
    .querySelector(`.${tag}Input`)
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter" && e.target.value.length > 1) {
        document.querySelector(".alertSection").innerHTML = "";
        addTag(tag, e.target.value);
      }
    });
}

// Function to display the list of tag depdending of the input
function searchTag(tagType, tagToSearch) {
  let liste = document.querySelector(`.${tagType}InputList`);
  liste.innerHTML = "";

  let tagToDisplay = [];

  if (tagToSearch !== undefined) {
    for (let item of availableTags[tagType]) {
      if (item.toLowerCase().includes(tagToSearch.toLowerCase())) {
        tagToDisplay.push(item);
      }
    }
  } else {
    tagToDisplay = availableTags[tagType];
  }

  for (let item of tagToDisplay) {
    let newItem = document.createElement("div");
    newItem.innerHTML = item;
    newItem.addEventListener("click", function () {
      addTag(tagType, item);
    });
    liste.appendChild(newItem);
  }

  if (tagToDisplay.length === 0) {
    let error = document.createElement("p");
    error.innerText = "Cet élément n'est plus disponible :(";
    liste.appendChild(error);
  }
}

// Function to add the mandatory tag
function addTag(tagType, tagToAdd) {
  const tagsAlert = document.querySelector(".alertSection");
  if (
    JSON.stringify(availableTags[tagType])
      .toLowerCase()
      .includes(tagToAdd.toLowerCase())
  ) {
    const itemSelected = availableTags[tagType].find(
      (item) => item.toLowerCase() === tagToAdd.toLowerCase()
    );
    if (itemSelected !== undefined) {
      const selectedTags = document.querySelector(".selectedTags");
      const newTag = document.createElement("button");
      newTag.setAttribute("type", "button");
      newTag.classList.add("btn");
      newTag.classList.add("btn-primary");
      newTag.classList.add(`btn-${tagType}`);
      newTag.innerHTML =
        itemSelected + '        <i class="fas fa-times-circle"></i>';
      newTag.addEventListener("click", function () {
        selectedTags.removeChild(newTag);
        tags[tagType].splice(tags[tagType].indexOf(itemSelected), 1);
        init();
      });
      selectedTags.appendChild(newTag);
      tags[tagType].push(itemSelected);
      const input = document.querySelector(`.${tagType}Input`);
      input.value = "";
      tagsAlert.innerHTML = "";
      init();
    } else {
      const tags = document.querySelector(".alertSection");
      const alert = document.createElement("div");
      alert.innerText =
        "Cet élément n'est pas disponible dans la liste actuelle !";
      alert.classList.add("alert");
      alert.classList.add("alert-danger");
      tagsAlert.appendChild(alert);
    }
  } else {
    const tags = document.querySelector(".alertSection");
    const alert = document.createElement("div");
    alert.innerText =
      "Cet élément n'est pas disponible dans la liste actuelle !";
    alert.classList.add("alert");
    alert.classList.add("alert-danger");
    tagsAlert.appendChild(alert);
  }
}
