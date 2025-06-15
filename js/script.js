const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipe = document.getElementById("recipe");

const modal = new bootstrap.Modal(document.getElementById("recipeModal"));
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("recipeModalLabel");
const modalDesc = document.getElementById("modalDesc");

const scrollTopBtn = document.getElementById("scrollTopBtn");

// Highlight matched keyword with yellow background
function highlightText(text, keyword) {
  if (!keyword) return text;

  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);

  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + keyword.length);
  const after = text.slice(index + keyword.length);

  return `${before}<span style="background-color: yellow;">${match}</span>${after}`;
}

// Fetch and show recipes
async function searchRecipes(foodName) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
  const res = await fetch(url);
  const data = await res.json();

  recipe.innerHTML = "";

  if (!data.meals) {
    recipe.innerHTML = `<p class="text-danger text-center">No recipes found for "${foodName}".</p>`;
    return;
  }

  data.meals.forEach((meal) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    const title = highlightText(meal.strMeal, foodName);
    const description = highlightText(
      meal.strInstructions.substring(0, 100),
      foodName
    );

    col.innerHTML = `
      <div class="card h-100">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${description}...</p>
          <div class="d-flex justify-content-end mt-auto"><button class="btn btn-warning  view-btn" data-id="${meal.idMeal}">
            View Recipe
          </button> </div>
        </div>
      </div>
    `;

    recipe.appendChild(col);
  });

  // Handle modal view
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await res.json();
      const meal = data.meals[0];

      modalImg.src = meal.strMealThumb;
      modalTitle.textContent = meal.strMeal;
      modalDesc.textContent = meal.strInstructions;
      modal.show();
    });
  });
}

// Search button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  searchRecipes(query);
});

// Live typing search
searchInput.addEventListener("keyup", () => {
  const query = searchInput.value.trim();
  searchRecipes(query);
});

// Load default recipes on page load
searchRecipes("");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

// Scroll smoothly to top when clicked
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
