import { getPhotos } from './api.js';
import { showDownloadErrorAlert } from './components/alert/download-alert.js';
import { handleUploadImgInput } from './components/photo-form.js';
import { fillDocumentWithPhotos } from './components/photos.js';

(async () => {
  const imgUploadElement = document.querySelector('.img-upload__input');
  imgUploadElement.addEventListener('change', handleUploadImgInput);

  /** @type {import('./api.js').Photo[] | null} */
  let photos = null;
  try {
    photos = await getPhotos();
  } catch {
    showDownloadErrorAlert();
    return;
  }
  fillDocumentWithPhotos(photos);
})();
