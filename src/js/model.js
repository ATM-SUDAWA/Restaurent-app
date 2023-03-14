// import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

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

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    // Creating our nicely formatted recipe object base on the recipe object that we have
    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      cookingTime: recipe.cooking_time,
      publisher: recipe.publisher,
      image: recipe.image_url,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      ingredients: recipe.ingredients,
      title: recipe.title,
    };
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
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        title: rec.title,
        id: rec.id,
        publisher: rec.publisher,
        image: rec.image_url,
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
