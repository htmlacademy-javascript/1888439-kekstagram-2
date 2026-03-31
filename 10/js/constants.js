export const HIDE_ELEMENT_CLASS = 'hidden';
export const MODAL_OPEN_CLASS = 'modal-open';

export const LOAD_MORE_INCREMENT = 5;

export const SCALE_PERCENT_INCREMENT = 25;
export const MIN_SCALE_PERCENT = 25;

export const HASHTAG_MAX_LENGTH = 20;
export const HASHTAG_MAX_COUNT = 5;
export const HASHTAG_SEPARATOR = /\s/;
export const HASHTAG_REG_EXP = /^#[a-zа-яё0-9]+$/i;
export const HashtagErrorMessage = Object.freeze({
  AllowedChars: 'Хэштеги после решётки должны состоять букв, чисел и разделяться пробелами!',
  Duplications: 'Один и тот же хэштег не может быть использован дважды!',
  MaxCount: `Нельзя указать больше ${HASHTAG_MAX_COUNT} хэштегов!`,
  MaxLength: `Максимальная длина одного хэштега должна быть ${HASHTAG_MAX_LENGTH} символов, включая решётку!`,
});

export const PhotoFilter = Object.freeze({
  Chrome: Object.freeze({
    Template: (value) => `grayscale(${value})`,
    Min: 0,
    Max: 1,
    Step: 0.1,
  }),
  Sepia: Object.freeze({
    Template: (value) => `sepia(${value})`,
    Min: 0,
    Max: 1,
    Step: 0.1,
  }),
  Marvin: Object.freeze({
    Template: (value) => `invert(${value}%)`,
    Min: 0,
    Max: 100,
    Step: 1,
  }),
  Phobos: Object.freeze({
    Template: (value) => `blur(${value}px)`,
    Min: 0,
    Max: 3,
    Step: 0.1,
  }),
  Heat: Object.freeze({
    Template: (value) => `brightness(${value})`,
    Min: 1,
    Max: 3,
    Step: 0.1,
  }),
});

export const PHOTO_DESCRIPTION_MAX_LENGTH = 140;
export const USER_COMMENT_MAX_LENGTH = 140;

export const FAKE_PHOTOS_COUNT = 25;
export const MIN_FAKE_PHOTO_ID = 1;
export const FAKE_AVATARS_COUNT = 6;
export const MAX_SENTENCES_IN_FAKE_COMMENT_MESSAGE = 2;
export const MAX_FAKE_COMMENTS_PER_PHOTO = 30;
export const MIN_FAKE_COMMENT_ID = 0;

export const FakeLikes = Object.freeze({
  Min: 15,
  Max: 250,
});

export const FAKE_USER_MESSAGES = Object.freeze([
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
]);

export const FAKE_PHOTO_COMMENTS = Object.freeze([
  'Прекрасный пляж! Интересно, сколько чаек нужно, чтобы унести все эти шезлонги?',
  'Не все дороги ведут в Рим, какие-то - на пляж',
  'Очередная, неоригинальная фотка камней на пляже',
  '#сказочноебали',
  'Уровень расслабленности: рисовый человечек в мясной подливке',
  'Волк не смотрит на спидометр, он чувствует мотор',
  'Кто-нибудь видел такие вилки с тремя зубцами? Где можно купить?',
  'Класная брага получится!',
  'Последняя фотография самолета, который оставил нас на необитаемом острове',
  'Кто-то снова спионерил тапки',
  'Долбаные лабиринты! Кое-как нашел дорогу на пляж',
  'Когда не хватило денег на BMW',
  'Огурчики, помидорчики - все свое, с огорода',
  'Не еш, подумой!',
  'Тапки железного человека',
  'Прекрасный вид, несмотря на то, что мой парашют не раскрылся',
  'Опять хор орет на дирижера',
  'Пацанский таз - радует глаз',
  'Тот момент, когда твои ноги наконец-то увидели светлое будущее (или хотя бы путь к бутербродам)',
  'Даже у пальм есть подсветка, а у нас в подъезде второй месяц не могут лампочку поменять',
  'Конечно, не оливьешка, но тоже не плохо',
  'Такой прекрасный закат не испортит даже тонущий человек',
  'Вы когда-нибудь просыпались утром с чувством, что вы - краб?',
  'Люди показывают cимволы Иллюминатов на концерте Rammstein!?',
  'Слышь, командир, мелочь есть? А если найду?!',
]);

export const FAKE_USER_NAMES = Object.freeze([
  'Артемий',
  'Даниил',
  'Егор',
  'Гордей',
  'Тимофей',
  'Руслан',
  'Марат',
  'Ярослав',
  'Родион',
  'Савелий',
  'Алёна',
  'Вероника',
  'Таисия',
  'Мирослава',
  'Кира',
  'Полина',
  'Варвара',
  'Злата',
  'Алина',
  'Евгения',
]);
