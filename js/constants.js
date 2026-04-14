export const API_BASE_PATH = 'https://31.javascript.htmlacademy.pro/kekstagram';
export const ApiPath = Object.freeze({
  Photos: '/data',
  UploadPhoto: '/',
});

export const DEFAULT_ALERT_TIMEOUT = 5000; // 5000ms
export const AlertType = Object.freeze({
  PhotoUploadSuccess: 'success',
  PhotoUploadError: 'error',
  PhotosLoadError: 'data-error',
});
export const UploadAlertType = Object.freeze({
  Success: 'success',
  Error: 'error',
});

export const HIDE_ELEMENT_CLASS = 'hidden';
export const MODAL_OPEN_CLASS = 'modal-open';

export const LOAD_MORE_INCREMENT = 5;

export const SCALE_PERCENT_INCREMENT = 25;
export const MIN_SCALE_PERCENT = 25;

export const HASHTAG_MAX_LENGTH = 20;
export const HASHTAG_MAX_COUNT = 5;
export const HASHTAG_SEPARATOR = /\s+/;
export const HASHTAG_REG_EXP = /^#[a-zа-яё0-9]+$/i;
export const HashtagErrorMessage = Object.freeze({
  AllowedChars: 'Хэштеги после решётки должны состоять букв, чисел и разделяться пробелами!',
  Duplications: 'Один и тот же хэштег не может быть использован дважды!',
  MaxCount: `Нельзя указать больше ${HASHTAG_MAX_COUNT} хэштегов!`,
  MaxLength: `Максимальная длина одного хэштега должна быть ${HASHTAG_MAX_LENGTH} символов, включая решётку!`,
});

export const SUPPORTED_UPLOADING_PHOTO_FORMATS = Object.freeze(['jpg', 'jpeg', 'png']);
export const PhotoFilter = Object.freeze({
  Chrome: Object.freeze({
    FillTemplate: (value) => `grayscale(${value})`,
    Min: 0,
    Max: 1,
    Step: 0.1,
  }),
  Sepia: Object.freeze({
    FillTemplate: (value) => `sepia(${value})`,
    Min: 0,
    Max: 1,
    Step: 0.1,
  }),
  Marvin: Object.freeze({
    FillTemplate: (value) => `invert(${value}%)`,
    Min: 0,
    Max: 100,
    Step: 1,
  }),
  Phobos: Object.freeze({
    FillTemplate: (value) => `blur(${value}px)`,
    Min: 0,
    Max: 3,
    Step: 0.1,
  }),
  Heat: Object.freeze({
    FillTemplate: (value) => `brightness(${value})`,
    Min: 1,
    Max: 3,
    Step: 0.1,
  }),
});

export const PHOTO_DESCRIPTION_MAX_LENGTH = 140;
export const INVALID_PHOTO_DESCRIPTION_MESSAGE = `Длина комментария должна быть меньше ${PHOTO_DESCRIPTION_MAX_LENGTH} символов!`;

export const USER_COMMENT_MAX_LENGTH = 140;

export const FilterVariant = Object.freeze({
  Default: 'filter-default',
  Random: 'filter-random',
  Discussed: 'filter-discussed',
});
export const MAX_RANDOM_FILTER_PHOTOS = 10;
export const FILTER_CHANGE_DEBOUNCE_TIMEOUT = 500; // 500ms
