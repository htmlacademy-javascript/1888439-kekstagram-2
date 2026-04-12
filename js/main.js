import { getPhotos } from './api.js';
import { showDownloadErrorAlert } from './components/alert/download-alert.js';
import { handleUploadImgInput } from './components/photo-form.js';
import { fillDocumentWithPhotos } from './components/photos.js';
import { getElement } from './element-cache.js';

const imgUploadElement = getElement('.img-upload__input');
imgUploadElement.addEventListener('change', handleUploadImgInput);

try {
  /** @type {import('./api.js').Photo[] | null} */
  const photos = await getPhotos();
  fillDocumentWithPhotos(photos);
} catch {
  showDownloadErrorAlert();
}
