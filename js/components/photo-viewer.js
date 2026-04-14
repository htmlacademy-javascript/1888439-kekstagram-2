import { HIDE_ELEMENT_CLASS, MODAL_OPEN_CLASS } from '../constants.js';
import { getElement } from '../element-cache.js';
import { interceptEscInsideInput } from '../utils.js';
import { fillSocial } from './social.js';

/**
 * Opens photo viewer modal
 *
 * @param {import('../api.js').Photo} photo
 */
const openPhotoViewer = (photo) => {
  const photoViewerEl = getElement('.big-picture');

  /** @type {HTMLImageElement} */
  const imgEl = getElement('.big-picture__img img', photoViewerEl);
  const closeBtn = getElement('.big-picture__cancel', photoViewerEl);
  const socialEl = getElement('.social');

  fillSocial(socialEl, photo);

  imgEl.src = photo.url;
  imgEl.alt = photo.description;
  photoViewerEl.addEventListener('keydown', interceptEscInsideInput);
  photoViewerEl.classList.remove(HIDE_ELEMENT_CLASS);
  closeBtn.addEventListener('click', closeButtonClickHandler);

  document.body.classList.add(MODAL_OPEN_CLASS);
  window.addEventListener('keydown', windowEscKeydownHandler);
};

/**
 * Closes photo viewer modal
 */
const closePhotoViewer = () => {
  const photoViewerEl = getElement('.big-picture');
  const closeBtn = getElement('.big-picture__cancel', photoViewerEl);


  photoViewerEl.removeEventListener('keydown', interceptEscInsideInput);
  photoViewerEl.classList.add(HIDE_ELEMENT_CLASS);
  closeBtn.removeEventListener('click', closeButtonClickHandler);

  document.body.classList.remove(MODAL_OPEN_CLASS);
  window.removeEventListener('keydown', windowEscKeydownHandler);
};

/**
 * Handles escape keydown event when photo viewer is open
 *
 * @param {KeyboardEvent} evt
 */
function windowEscKeydownHandler(evt) {
  if (evt.code === 'Escape') {
    closePhotoViewer();
  }
}

/**
 * Handles close button click event when photo viewer is open
 *
 * @param {MouseEvent} evt
 */
function closeButtonClickHandler(evt) {
  evt.preventDefault();
  closePhotoViewer();
}

export { closePhotoViewer, openPhotoViewer };
