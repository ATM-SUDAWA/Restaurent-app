// import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  Bookmarks: [],
};

const creatRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    publisher: recipe.publisher,
    image: recipe.image_url,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    ingredients: recipe.ingredients,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    // Creating our nicely formatted recipe object base on the recipe object that we have

    state.recipe = creatRecipeObject(data);
    console.log(state.recipe);
    if (state.Bookmarks.some(boomark => boomark.id === id))
      state.recipe.Bookmarked = true;
    else state.recipe.Bookmarked = false;
  } catch (err) {
    console.error(err);
    throw Error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        title: rec.title,
        id: rec.id,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw Error;
  }
};

export const getSearchResultParPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQT = (oldQT * newServing) / oldServing;
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmark = () => {
  try {
    localStorage.setItem('Bookmark', JSON.stringify(state.Bookmarks));
  } catch (err) {
    console.error('Something went wrong');
  }
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.Bookmarks.push(recipe);

  // markCurrent recipe as Bookmark
  if (recipe.id === state.recipe.id) state.recipe.Bookmarked = true;

  persistBookmark();
};

export const deleteBookmark = function (id) {
  // Delete bookmarked
  const index = state.Bookmarks.findIndex(el => el.id === id);
  state.Bookmarks.splice(index, 1);

  // mark Current recipe as not Bookmark
  if (id === state.recipe.id) state.recipe.Bookmarked = false;
  persistBookmark();
};

const init = () => {
  const storage = localStorage.getItem('Bookmark');
  if (storage) state.Bookmarks = JSON.parse(storage);
};
console.log(state.Bookmarks);
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! pls use the correct format :)'
          );

        [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = creatRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
