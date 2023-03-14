import icons from 'url:../../img/icons.svg'; // for parcel 2

import View from './View.js';
class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `We could'nt fine the result of your query. Pls try again later :)`;
  _succesMessage = '';

  _generataMarkup() {
    // console.log(this._data);
    return this._data.map(this._generataMarkupPreview).join('');
  }

  _generataMarkupPreview(results) {
    const id = window.location.hash.slice(1);
    return `

    <li class="preview">
      <a class="preview__link ${
        id === results.id ? 'preview__link--active' : ''
      }" href="#${results.id}">
        <figure class="preview__fig">
          <img src="${results.image}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${results.title}</h4>
          <p class="preview__publisher">${results.publisher}</p>
          <div class="preview__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
   </li>

  `;
  }
}

export default new resultsView();
