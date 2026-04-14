import { FILTER_CHANGE_DEBOUNCE_TIMEOUT } from '../constants.js';
import { getElement } from '../element-cache.js';
import { debounce } from '../utils.js';

let activeFilterElement = null;
let filterChangeHandler = null;

/** @typedef {typeof import('../constants.js').FilterVariant} FilterVariant */
/**
 * Sets filter state
 *
 * @param {FilterVariant[keyof FilterVariant]} filterVariant
 */
const setFilter = (filterVariant) => {
  const filterElement = getElement(`#${filterVariant}`);

  activeFilterElement.classList.remove('img-filters__button--active');
  filterElement.classList.add('img-filters__button--active');

  activeFilterElement = filterElement;
};

/**
 * Handles click on filter element
 *
 * @param {MouseEvent} evt
 */
const filterClickHandler = (evt) => {
  evt.preventDefault();
  const targetClasses = evt.target.classList;

  if (!targetClasses.contains('img-filters__button') || targetClasses.contains('img-filters__button--active')) {
    return;
  }

  const newFilter = evt.target.id;
  setFilter(newFilter);
  filterChangeHandler(newFilter);
};

/**
 * Initializes the filter element for operations
 *
 * @param {(filterVariant: FilterVariant[keyof FilterVariant]) => void} changeAction
 */
const initFilters = (changeAction) => {
  const filters = getElement('.img-filters');
  const filtersForm = getElement('.img-filters__form', filters);
  activeFilterElement = filtersForm.querySelector('.img-filters__button--active');

  filters.classList.remove('img-filters--inactive');
  filtersForm.addEventListener('click', filterClickHandler);

  filterChangeHandler = debounce(changeAction, FILTER_CHANGE_DEBOUNCE_TIMEOUT);
};

export { initFilters };
