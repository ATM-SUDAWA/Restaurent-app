import View from './View.js';
import icons from 'url:../../img/icons.svg'; // for parcel 2
// import { getOwnPropertyNames } from 'core-js/core/object';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generataMarkupButton(btnType) {
    const currentPage = this._data.page;
    const next = `
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;

    const prev = `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
         <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
          </svg>
         <span>Page ${currentPage - 1}</span>
       </button>
    `;

    if (btnType === 'next') return next;
    if (btnType === 'prev') return prev;
    if (btnType === 'both') return prev + next;
  }
  _generataMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    console.log(numPages);
    console.log(currentPage);

    // 1. page one and their are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generataMarkupButton('next');
    }

    // 2. last page
    if (currentPage === numPages && numPages > 1) {
      return this._generataMarkupButton('prev');
    }
    // 3. other pages
    if (currentPage < numPages) {
      return this._generataMarkupButton('both');
    }
    // 4. page one and their are no other pages
    if (currentPage === 1 && numPages === 1) {
      return '';
    }
  }
}

export default new paginationView();
