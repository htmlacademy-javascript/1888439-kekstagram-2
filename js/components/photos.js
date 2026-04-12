import { FilterVariant, MAX_RANDOM_FILTER_PHOTOS } from '../constants.js';
import { getElement } from '../element-cache.js';
import { createFragmentWith, selectOrThrow, shuffle } from '../utils.js';
import { initFilters } from './filters.js';
import { openPhotoViewer } from './photo-viewer.js';

/** @typedef {typeof import('../constants.js').FilterVariant} FilterVariant */
/** @typedef {import('../api.js').Photo} Photo */

/** @type {Photo[] | null} */
let cachedPhotos = null;

/** @type Record<FilterVariant[keyof FilterVariant], (photos: Photo[]) => Photo[]> */
const filters = {
  [FilterVariant.Default]: (photos) => photos,
  [FilterVariant.Random]: (photos) => shuffle(photos, MAX_RANDOM_FILTER_PHOTOS),
  [FilterVariant.Discussed]: (photos) => photos.slice().sort((a, b) => b.comments.length - a.comments.length),
};

/**
 * Handles click event on photo thumbnail
 *
 * @param {MouseEvent} evt
 * @param {Photo} photo
 */
const handlePhotoClick = (evt, photo) => {
  evt.preventDefault();
  openPhotoViewer(photo);
};

/**
 * Fills photo template element with data
 *
 * @param {HTMLElement} photoTemplate
 * @param {import('../api.js').Photo} photo
 * @returns {HTMLElement}
 */
const fillPhotoTemplate = (photoTemplate, photo) => {
  const photoElement = photoTemplate.cloneNode(true);

  /** @type {HTMLAnchorElement} */
  const anchorEl = photoElement.querySelector('.picture');
  /** @type {HTMLImageElement} */
  const imgEl = photoElement.querySelector('.picture__img');
  /** @type {HTMLSpanElement} */
  const commentsCountEl = photoElement.querySelector('.picture__comments');
  /** @type {HTMLSpanElement} */
  const likesCountEl = photoElement.querySelector('.picture__likes');

  anchorEl.href = photo.url;
  anchorEl.addEventListener('click', (evt) => handlePhotoClick(evt, photo));
  imgEl.src = photo.url;
  imgEl.alt = photo.description;
  commentsCountEl.textContent = photo.comments.length;
  likesCountEl.textContent = photo.likes;

  return photoElement;
};

/**
 * Create a DocumentFragment from an array of photos
 *
 * @param {Photo[]} photos
 * @returns {DocumentFragment}
 */
const createFragmentWithPhotos = (photos) => {
  /** @type {HTMLTemplateElement} */
  const photoTemplate = selectOrThrow('#picture');

  return createFragmentWith(
    photos,
    (photo) => fillPhotoTemplate(photoTemplate.content, photo),
  );
};

/**
 * Render photos on page
 *
 * @param {Photo[]} photos
 */
const renderPhotos = (photos) => {
  const picturesEl = getElement('.pictures');
  picturesEl.querySelectorAll('.picture').forEach((picture) => {
    picture.remove();
  });

  const fragmentWithPhotos = createFragmentWithPhotos(photos);
  picturesEl.append(fragmentWithPhotos);
};

/**
 * Handles filter changing
 *
 * @param {FilterVariant[keyof FilterVariant]} filterVariant
 */
const handleChangeFilter = (filterVariant) => {
  const photos = filters[filterVariant](cachedPhotos);
  renderPhotos(photos);
};

/**
 * Fills document with created picture elements
 *
 * @param {Photo[]} photos
 * @return {void}
 */
const fillDocumentWithPhotos = (photos) => {
  cachedPhotos = photos.slice();
  initFilters(handleChangeFilter);
  renderPhotos(cachedPhotos);
};

export { createFragmentWithPhotos, fillDocumentWithPhotos, fillPhotoTemplate };
