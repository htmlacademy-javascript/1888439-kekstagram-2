import { UploadAlertType } from '../../constants.js';
import { getElement } from '../../element-cache.js';
import { isContainsSomeClass } from '../../utils.js';

/**
 * @typedef {typeof import('../../constants.js').UploadAlertType} UploadAlertType
 */

/** @type {HTMLElement | null} */
let alertElement = null;
/** @type {UploadAlertType[keyof UploadAlertType] | null} */
let alertType = null;
/** @type {() => void} */
let handlePostClose = () => {};

/**
 * Closes message element about uploading photos
 */
const closeUploadAlert = () => {
  alertElement?.remove();
  window.removeEventListener('keydown', handleEscKeydown);
  document.removeEventListener('click', handleClick);
  handlePostClose();

  alertElement = null;
  alertType = null;
  handlePostClose = () => {};
};

/**
 * Shows message element about uploading photos
 *
 * @param {UploadAlertType[keyof UploadAlertType]} type
 * @param {() => void} [postCloseAction]
 */
const showUploadAlert = (type, postCloseAction = (() => {})) => {
  if (alertElement) {
    closeUploadAlert();
  }

  const alertTemplate = getElement(`#${type}`);
  alertElement = alertTemplate
    .content
    .cloneNode(true)
    .firstElementChild;
  alertType = type;
  handlePostClose = postCloseAction;

  document.body.append(alertElement);
  window.addEventListener('keydown', handleEscKeydown);
  document.addEventListener('click', handleClick);
};

/**
 * Handles escape keydown event
 *
 * @param {KeyboardEvent} evt
 */
function handleEscKeydown(evt) {
  if (evt.code === 'Escape') {
    closeUploadAlert();
  }
}

/**
 *
 * @param {MouseEvent} evt
 */
function handleClick(evt) {
  evt.preventDefault();
  const buttonClasses = Object.values(UploadAlertType).map(
    (type) => `${type}__button`
  );

  const target = evt.target;
  if (!target.closest(`.${alertType}__inner`) || isContainsSomeClass(target, buttonClasses)) {
    closeUploadAlert();
  }
}

export { showUploadAlert };
