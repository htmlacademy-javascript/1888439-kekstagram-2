/**
 * Fills photo template element with data
 *
 * @param {HTMLElement} photoTemplate
 * @param {import('../fake-data.js').Photo} photo
 * @returns {HTMLElement}
 */
export const fillPhotoTemplate = (photoTemplate, photo) => {
  const photoElement = photoTemplate.cloneNode(true);

  /** @type {HTMLImageElement} */
  const imgEl = photoElement.querySelector('.picture__img');
  /** @type {HTMLSpanElement} */
  const commentEl = photoElement.querySelector('.picture__comments');
  /** @type {HTMLSpanElement} */
  const likesEl = photoElement.querySelector('.picture__likes');

  imgEl.src = photo.url;
  imgEl.alt = photo.description;
  commentEl.textContent = photo.comments.length;
  likesEl.textContent = photo.likes;

  return photoElement;
};

/**
 * Create a DocumentFragment from an array of photos
 *
 * @param {import('../fake-data.js').Photo[]} photos
 * @returns {DocumentFragment}
 */
export const createFragmentWithPhotos = (photos) => {
  const fragment = document.createDocumentFragment();

  /** @type {HTMLTemplateElement | null} */
  const photoTemplate = document.querySelector('#picture');

  if (!photoTemplate) {
    throw new Error('Selected element #picture does not found!');
  }

  photos.forEach((photo) => {
    fragment.append(fillPhotoTemplate(photoTemplate.content, photo));
  });

  return fragment;
};

/**
 * Fills document with created picture elements
 *
 * @param {import('../fake-data.js').Photo[]} photos
 * @return {void}
 */
export const fillDocumentWithPhotos = (photos) => {
  const picturesEl = document.querySelector('.pictures');

  if (!picturesEl) {
    throw new Error('Selected element .pictures does not found!');
  }

  const fragmentWithPhotos = createFragmentWithPhotos(photos);
  picturesEl.append(fragmentWithPhotos);
};
