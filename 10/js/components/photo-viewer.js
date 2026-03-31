import { HIDE_ELEMENT_CLASS, MODAL_OPEN_CLASS } from '../constants.js';
import { interceptEscInsideInput } from '../utils.js';
import { fillSocial } from './social.js';

/**
 * Opens photo viewer modal
 *
 * @param {import('../fake-data.js').Photo} photo
 */
export const openPhotoViewer = (photo) => {
  const photoViewerEl = document.querySelector('.big-picture');

  /** @type {HTMLImageElement} */
  const imgEl = photoViewerEl.querySelector('.big-picture__img img');
  const closeBtn = photoViewerEl.querySelector('.big-picture__cancel');
  const socialEl = photoViewerEl.querySelector('.social');

  fillSocial(socialEl, photo);

  imgEl.src = photo.url;
  imgEl.alt = photo.description;
  photoViewerEl.addEventListener('keydown', interceptEscInsideInput);
  photoViewerEl.classList.remove(HIDE_ELEMENT_CLASS);
  closeBtn.addEventListener('click', handleCloseClick);

  document.body.classList.add(MODAL_OPEN_CLASS);
  window.addEventListener('keydown', handleEscKeydown);
};

/**
 * Closes photo viewer modal
 */
export const closePhotoViewer = () => {
  const photoViewerEl = document.querySelector('.big-picture');
  const closeBtn = photoViewerEl.querySelector('.big-picture__cancel');


  photoViewerEl.removeEventListener('keydown', interceptEscInsideInput);
  photoViewerEl.classList.add(HIDE_ELEMENT_CLASS);
  closeBtn.removeEventListener('click', handleCloseClick);

  document.body.classList.remove(MODAL_OPEN_CLASS);
  window.removeEventListener('keydown', handleEscKeydown);
};

/**
 * Handles escape keydown event when photo viewer is open
 *
 * @param {KeyboardEvent} evt
 */
function handleEscKeydown(evt) {
  if (evt.code === 'Escape') {
    closePhotoViewer();
  }
}

/**
 * Handles close button click event when photo viewer is open
 *
 * @param {MouseEvent} evt
 */
function handleCloseClick(evt) {
  evt.preventDefault();
  closePhotoViewer();
}
