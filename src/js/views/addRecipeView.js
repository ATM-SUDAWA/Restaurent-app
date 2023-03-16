import View from './View.js';
import icons from 'url:../../img/icons.svg'; // for parcel 2
// import { getOwnPropertyNames } from 'core-js/core/object';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was succesfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  btnOpen = document.querySelector('.nav__btn--add-recipe');
  btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this._addHandlerShowModal();
    this._addHandlerCloseModal();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowModal(handler) {
    this.btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    // handler();
  }

  _addHandlerCloseModal(handler) {
    this.btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generataMarkup() {}
}

export default new addRecipeView();
