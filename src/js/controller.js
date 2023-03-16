// import { async } from 'regenerator-runtime';
import * as model from './model.js';
// import 'regenerator-runtime/runtime';

// import icon from '../img/icons.svg'; // for parcel 1
// import 'core-js/stable';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import PreviewView from './views/previewView.js';
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
// 316039cc-bf7e-498e-b8dc-45c8dc11037f  API key

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0) result view to mark selected serch result
    resultsView.update(model.getSearchResultParPage());
    bookmarksView.update(model.state.Bookmarks);

    // 1).  rendering spinnner
    recipeView.renderSpinner();

    // 2). loading recipe
    await model.loadRecipe(id);

    // 3). rendering recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  resultsView.renderSpinner();

  // 1. get seach query
  const query = searchView.getQuery();
  if (!query) return;

  // 2.laod serch result
  await model.loadSearchResult(query);

  // 3. Render search result
  console.log(model.getSearchResultParPage(1));
  // console.log(model.state.search.results);
  resultsView.render(model.getSearchResultParPage());

  // 4. Render the initial pagination buttons
  paginationView.render(model.state.search);
};

const constrolPagination = function (gotoPage) {
  // 3. Render search result
  resultsView.render(model.getSearchResultParPage(gotoPage));

  // 4. Render the updated pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // update the recipe servings  (in state)
  model.updateServings(newServing);

  //
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add and remove bookmark
  if (!model.state.recipe.Bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.Bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.Bookmarks);
};

const controllAddrecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render the new recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderSucces();

    // Render bookmarkView
    bookmarksView.render(model.state.Bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `${model.state.recipe.id}`);
    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
    console.log(model.state.recipe);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSerch(controlSearchResult);
  paginationView.addHandlerClick(constrolPagination);
  addRecipeView.addHandlerUpload(controllAddrecipe);
};
init();
