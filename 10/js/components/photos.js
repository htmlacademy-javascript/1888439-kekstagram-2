import { createFragmentWith, selectOrThrow } from '../utils.js';
import { openPhotoViewer } from './photo-viewer.js';

/**
 * Handles click event on photo thumbnail
 *
 * @param {MouseEvent} evt
 * @param {import('../fake-data.js').Photo} photo
 */
const handlePhotoClick = (evt, photo) => {
  evt.preventDefault();
  openPhotoViewer(photo);
};

/**
 * Fills photo template element with data
 *
 * @param {HTMLElement} photoTemplate
 * @param {import('../fake-data.js').Photo} photo
 * @returns {HTMLElement}
 */
export const fillPhotoTemplate = (photoTemplate, photo) => {
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
 * @param {import('../fake-data.js').Photo[]} photos
 * @returns {DocumentFragment}
 */
export const createFragmentWithPhotos = (photos) => {
  /** @type {HTMLTemplateElement} */
  const photoTemplate = selectOrThrow('#picture');
  const fragment = createFragmentWith(
    photos,
    (photo) => fillPhotoTemplate(photoTemplate.content, photo),
  );

  return fragment;
};

/**
 * Fills document with created picture elements
 *
 * @param {import('../fake-data.js').Photo[]} photos
 * @return {void}
 */
export const fillDocumentWithPhotos = (photos) => {
  const picturesEl = selectOrThrow('.pictures');

  const fragmentWithPhotos = createFragmentWithPhotos(photos);
  picturesEl.append(fragmentWithPhotos);
};
