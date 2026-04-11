import { DEFAULT_ALERT_TIMEOUT } from '../../constants.js';
import { getElement } from '../../element-cache.js';

/** @type {HTMLElement | null} */
let alertElement = null;
/** @type {ReturnType<typeof setTimeout> | null} */
let timeoutId = null;

/**
 * Closes error message about downloading photos
 */
const closeDownloadErrorAlert = () => {
  alertElement?.remove();
  alertElement = null;
  timeoutId = null;
};

/**
 * Shows error message about downloading photos
 *
 * @param {number} [timeout]
 */
const showDownloadErrorAlert = (timeout = DEFAULT_ALERT_TIMEOUT) => {
  if (alertElement) {
    clearTimeout(timeoutId);
    closeDownloadErrorAlert();
  }

  const alertTemplate = getElement('#data-error');
  alertElement = alertTemplate.content.cloneNode(true).firstElementChild;
  document.body.append(alertElement);
  timeoutId = setTimeout(closeDownloadErrorAlert, timeout);
};

export { showDownloadErrorAlert };
