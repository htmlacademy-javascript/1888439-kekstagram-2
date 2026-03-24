import {
  HASHTAG_MAX_COUNT,
  HASHTAG_MAX_LENGTH,
  HASHTAG_REG_EXP,
  HASHTAG_SEPARATOR,
  HashtagErrorMessage,
  HIDE_ELEMENT_CLASS,
  MODAL_OPEN_CLASS,
  PhotoFilter
} from '../constants.js';
import { getElement } from '../element-cache.js';
import { capitalize, interceptEscInsideInput, trimAndSplit } from '../utils.js';

let validator = null;

/** @type {[validator: (value: string) => boolean, message: string][]} */
const hashtagValidators = [
  [
    (hashtagsStr) => {
      const hashtags = trimAndSplit(hashtagsStr, HASHTAG_SEPARATOR);
      return hashtags.every((hashtag) => (HASHTAG_REG_EXP).test(hashtag));
    },
    HashtagErrorMessage.AllowedChars
  ],
  [
    (hashtagsStr) => {
      const hashtags = trimAndSplit(hashtagsStr, HASHTAG_SEPARATOR);
      return hashtags.every((hashtag) => hashtag.length <= HASHTAG_MAX_LENGTH);
    },
    HashtagErrorMessage.MaxLength
  ],
  [
    (hashtagsStr) => {
      const hashtags = trimAndSplit(hashtagsStr, HASHTAG_SEPARATOR);
      return hashtags.length <= HASHTAG_MAX_COUNT;
    },
    HashtagErrorMessage.MaxCount
  ],
  [
    (hashtagsStr) => {
      const normalizedHashtags = trimAndSplit(hashtagsStr, HASHTAG_SEPARATOR)
        .map((hashtag) => hashtag.toLowerCase());
      const hashtagCounter = new Set(normalizedHashtags);

      return normalizedHashtags.length === hashtagCounter.size;
    },
    HashtagErrorMessage.Duplications
  ],
];

/**
 *
 * @param {SubmitEvent} evt
 */
const handleFormSubmit = (evt) => {
  evt.preventDefault();
  if (validator.validate()) {
    evt.target.submit();
  }
};

/**
 *
 * @param {ChangeEvent} evt
 */
const handleChangeFilter = (evt) => {
  const target = evt.target;

  if (!(target instanceof HTMLInputElement && target.type === 'radio')) {
    return;
  }

  const effectLevelElement = getElement('.img-upload__effect-level .effect-level__value');
  const photoPreviewElement = getElement('.img-upload__preview img');
  let styles = '';
  const filter = PhotoFilter[capitalize(target.value)];

  if (filter) {
    const mean = (filter.Min + filter.Max) / 2;
    effectLevelElement.step = filter.Step;
    effectLevelElement.value = mean;
    styles = filter.Template(mean);
  }

  photoPreviewElement.style.filter = styles;
};

export const openPhotoForm = () => {
  const uploadFormElement = getElement('#upload-select-image');
  const formOverlayElement = getElement('.img-upload__overlay');
  const formFiltersElement = getElement('.img-upload__effects', formOverlayElement);
  const hashtagsFieldElement = getElement('.text__hashtags', formOverlayElement);
  const closeFormButton = getElement('.img-upload__cancel', formOverlayElement);

  validator = new Pristine(uploadFormElement, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--error',
  });

  hashtagValidators.forEach((hashtagValidator) => {
    validator.addValidator(hashtagsFieldElement, ...hashtagValidator);
  });

  formFiltersElement.addEventListener('change', handleChangeFilter);
  closeFormButton.addEventListener('click', handleCloseClick);
  uploadFormElement.addEventListener('keydown', interceptEscInsideInput);
  uploadFormElement.addEventListener('submit', handleFormSubmit);
  window.addEventListener('keydown', handleEscKeydown);

  formOverlayElement.classList.remove(HIDE_ELEMENT_CLASS);
  document.body.classList.add(MODAL_OPEN_CLASS);
};

export const closePhotoForm = () => {
  const uploadFormElement = getElement('#upload-select-image');
  const formOverlayElement = getElement('.img-upload__overlay');
  const closeFormButton = getElement('.img-upload__cancel', formOverlayElement);
  const formFiltersElement = getElement('.img-upload__effects', formOverlayElement);
  const effectLevelElement = getElement('.img-upload__effect-level .effect-level__value');
  const photoPreviewElement = getElement('.img-upload__preview img');

  validator.destroy();
  validator = null;

  uploadFormElement.reset();
  effectLevelElement.step = 'any';
  effectLevelElement.value = '';
  photoPreviewElement.style.filter = '';

  formFiltersElement.removeEventListener('change', handleChangeFilter);
  closeFormButton.removeEventListener('click', handleCloseClick);
  uploadFormElement.removeEventListener('keydown', interceptEscInsideInput);
  uploadFormElement.removeEventListener('submit', handleFormSubmit);
  window.removeEventListener('keydown', handleEscKeydown);

  formOverlayElement.classList.add(HIDE_ELEMENT_CLASS);
  document.body.classList.remove(MODAL_OPEN_CLASS);
};

/**
 * Handles close button click event when photo viewer is open
 *
 * @param {MouseEvent} evt
 */
function handleCloseClick(evt) {
  evt.preventDefault();
  closePhotoForm();
}

/**
  * Handles escape keydown event when photo viewer is open
  *
  * @param {KeyboardEvent} evt
  */
function handleEscKeydown(evt) {
  if (evt.code === 'Escape') {
    closePhotoForm();
  }
}

/**
 * Handle change event on input[type='file'] element
 * and opens form for uploading image
 *
 * @param {ChangeEvent} evt
 */
export const handleUploadImgInput = (evt) => {
  evt.preventDefault();
  openPhotoForm();
};
