import { uploadPhoto } from '../api.js';
import {
  HASHTAG_MAX_COUNT,
  HASHTAG_MAX_LENGTH,
  HASHTAG_REG_EXP,
  HASHTAG_SEPARATOR,
  HashtagErrorMessage,
  HIDE_ELEMENT_CLASS,
  MIN_SCALE_PERCENT,
  MODAL_OPEN_CLASS,
  PhotoFilter,
  SCALE_PERCENT_INCREMENT,
  SUPPORTED_UPLOADING_PHOTO_FORMATS,
  UploadAlertType
} from '../constants.js';
import { getElement } from '../element-cache.js';
import { capitalize, interceptEscInsideInput, isContainsSomeClass, trimAndSplit } from '../utils.js';
import { showUploadAlert } from './alert/upload-alert.js';

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

/** @typedef {typeof import('../constants.js').PhotoFilter} PhotoFilter */
/**
 * Handles photo filters slider update
 *
 * @param {number} state
 * @param {PhotoFilter[keyof PhotoFilter]} filter
 */
const handleSliderUpdate = (state, filter) => {
  const photoPreviewElement = getElement('.img-upload__preview img');
  const effectLevelElement = getElement('.img-upload__effect-level .effect-level__value');

  effectLevelElement.value = state;
  photoPreviewElement.style.filter = filter.Template(state);
};

/**
 * Handles change photo filter event
 *
 * @param {InputEvent} evt
 */
const handleChangeFilter = ({ target }) => {
  if (!(target instanceof HTMLInputElement && target.type === 'radio')) {
    return;
  }

  const effectLevelElement = getElement('.img-upload__effect-level .effect-level__value');
  const photoPreviewElement = getElement('.img-upload__preview img');
  const sliderElement = getElement('.img-upload__effect-level .effect-level__slider');
  const effectLevelFieldset = getElement('.img-upload__effect-level');
  const filter = PhotoFilter[capitalize(target.value)];

  sliderElement?.noUiSlider?.destroy();

  if (!filter) {
    effectLevelFieldset.classList.add(HIDE_ELEMENT_CLASS);
    effectLevelElement.step = 'any';
    effectLevelElement.value = '';
    photoPreviewElement.style.filter = '';
    return;
  }

  effectLevelFieldset.classList.remove(HIDE_ELEMENT_CLASS);
  effectLevelElement.step = filter.Step;

  noUiSlider.create(sliderElement, {
    start: filter.Max,
    range: {
      min: filter.Min,
      max: filter.Max,
    },
    step: filter.Step,
  });

  sliderElement.noUiSlider.on(
    'update',
    (state) => handleSliderUpdate(state, filter)
  );
};

/**
 * Handles change of scale input
 *
 * @param {MouseEvent} evt
 */
const handleScaleChange = ({ target, currentTarget }) => {
  const buttonClasses = [
    'scale__control--smaller',
    'scale__control--bigger',
  ];

  if (!isContainsSomeClass(target, buttonClasses)) {
    return;
  }

  const scaleInput = getElement('.scale__control--value', currentTarget);
  const photoPreviewImg = getElement('.img-upload__preview img');
  const currentScale = parseInt(scaleInput.value, 10);
  const isIncrease = target.classList.contains('scale__control--bigger');
  const changedScale = currentScale + (isIncrease ? SCALE_PERCENT_INCREMENT : -SCALE_PERCENT_INCREMENT);
  const normalizedScale = Math.max(MIN_SCALE_PERCENT, Math.min(changedScale, 100));

  scaleInput.value = `${normalizedScale}%`;
  photoPreviewImg.style.transform = `scale(${normalizedScale / 100})`;
};

/**
 * Opens photo upload form
 */
const openPhotoForm = () => {
  const uploadFormElement = getElement('#upload-select-image');
  const formOverlayElement = getElement('.img-upload__overlay');
  const formFiltersElement = getElement('.img-upload__effects', formOverlayElement);
  const hashtagsFieldElement = getElement('.text__hashtags', formOverlayElement);
  const closeFormButton = getElement('.img-upload__cancel', formOverlayElement);
  const scaleFieldElement = getElement('.img-upload__scale', formOverlayElement);
  const uploadFileInput = getElement('#upload-file');
  const photoPreviewElement = getElement('.img-upload__preview img');

  photoPreviewElement.src = URL.createObjectURL(uploadFileInput.files[0]);

  validator = new Pristine(uploadFormElement, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper--error',
  });

  hashtagValidators.forEach((hashtagValidator) => {
    validator.addValidator(hashtagsFieldElement, ...hashtagValidator);
  });

  formFiltersElement.addEventListener('change', handleChangeFilter);
  closeFormButton.addEventListener('click', handleCloseClick);
  uploadFormElement.addEventListener('keydown', interceptEscInsideInput);
  uploadFormElement.addEventListener('submit', handleFormSubmit);
  scaleFieldElement.addEventListener('click', handleScaleChange);
  window.addEventListener('keydown', handleEscKeydown);

  formOverlayElement.classList.remove(HIDE_ELEMENT_CLASS);
  document.body.classList.add(MODAL_OPEN_CLASS);
};

/**
 * Closes photo upload form
 */
const closePhotoForm = () => {
  const uploadFormElement = getElement('#upload-select-image');
  const formOverlayElement = getElement('.img-upload__overlay');
  const closeFormButton = getElement('.img-upload__cancel', formOverlayElement);
  const formFiltersElement = getElement('.img-upload__effects', formOverlayElement);
  const effectLevelFieldset = getElement('.img-upload__effect-level');
  const effectLevelInput = getElement('.img-upload__effect-level .effect-level__value');
  const photoPreviewElement = getElement('.img-upload__preview img');
  const uploadFileInput = getElement('#upload-file');
  const sliderElement = getElement('.img-upload__effect-level .effect-level__slider');
  const scaleFieldElement = getElement('.img-upload__scale', formOverlayElement);
  const scaleInput = getElement('.scale__control--value', scaleFieldElement);

  validator?.destroy();
  validator = null;

  uploadFormElement.reset();
  uploadFileInput.value = '';
  effectLevelInput.step = 'any';
  effectLevelInput.value = '';
  photoPreviewElement.style.filter = '';
  photoPreviewElement.style.transform = '';
  scaleInput.value = '100%';
  sliderElement?.noUiSlider?.destroy();

  formFiltersElement.removeEventListener('change', handleChangeFilter);
  closeFormButton.removeEventListener('click', handleCloseClick);
  uploadFormElement.removeEventListener('keydown', interceptEscInsideInput);
  uploadFormElement.removeEventListener('submit', handleFormSubmit);
  scaleFieldElement.removeEventListener('click', handleScaleChange);
  window.removeEventListener('keydown', handleEscKeydown);

  effectLevelFieldset.classList.add(HIDE_ELEMENT_CLASS);
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
 * Handles photo upload form submit event
 *
 * @param {SubmitEvent} evt
 */
async function handleFormSubmit(evt) {
  evt.preventDefault();

  if (!validator.validate()) {
    return;
  }

  const formData = new FormData(evt.target);

  window.removeEventListener('keydown', handleEscKeydown);
  const addWindowEscKeydownHandler = () => {
    window.addEventListener('keydown', handleEscKeydown);
  };

  try {
    await uploadPhoto(formData);
  } catch {
    showUploadAlert(UploadAlertType.Error, addWindowEscKeydownHandler);
    return;
  }

  showUploadAlert(UploadAlertType.Success);
  closePhotoForm();
}

/**
 * Handle change event on input[type='file'] element
 * and opens form for uploading image
 *
 * @param {InputEvent} evt
 */
const handleUploadImgInput = (evt) => {
  evt.preventDefault();

  const file = evt.target.files[0];
  const fileName = file.name.toLowerCase();

  if (!SUPPORTED_UPLOADING_PHOTO_FORMATS.some((type) => fileName.endsWith(type))) {
    evt.target.value = '';
    return;
  }

  openPhotoForm();
};

export { closePhotoForm, handleUploadImgInput, openPhotoForm };
