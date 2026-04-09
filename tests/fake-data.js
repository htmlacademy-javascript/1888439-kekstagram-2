import { getRandomInt, keepNumberInRange } from '../js/utils.js';

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

/**
 * @typedef {import('../js/api.js').Comment} Comment
 */
/**
 * @typedef {import('../js/api.js').Photo} Photo
 */

/**
 * Generate fake photo path by id
 *
 * @param {number} photoId - Fake photo id
 * @returns {string}
 */
export const getFakePhotoPath = (photoId) => {
  const limitedPhotoId = keepNumberInRange(photoId, FAKE_PHOTOS_COUNT);
  return `photos/${limitedPhotoId}.jpg`;
};

/**
 * Generate fake avatar path by id
 *
 * @param {number} avatarId - Fake avatar id
 * @returns {string}
 */
export const getFakeAvatarPath = (avatarId) => {
  const restrictiveAvatarId = keepNumberInRange(avatarId, FAKE_AVATARS_COUNT);
  return `img/avatar-${restrictiveAvatarId}.svg`;
};

/**
 * Generates fake user comment message
 *
 * @returns {string}
 */
export const generateFakeMessage = () => {
  const remainingMessages = Array.from(FAKE_USER_MESSAGES);
  const countOfSentences = getRandomInt(MAX_SENTENCES_IN_FAKE_COMMENT_MESSAGE) + 1;
  const sentences = Array(countOfSentences);

  for (let i = 0; i < countOfSentences && remainingMessages.length > 0; ++i) {
    const messageIdx = getRandomInt(remainingMessages.length);
    sentences[i] = remainingMessages[messageIdx];
    remainingMessages.splice(messageIdx, 1);
  }

  return sentences.join(' ');
};

/**
 * Generates fake comment by id
 *
 * @param {number} id
 * @returns {Comment}
 */
export const generateFakeComment = (id) => ({
  id,
  message: generateFakeMessage(),
  name: FAKE_USER_NAMES[getRandomInt(FAKE_USER_NAMES.length)],
  avatar: getFakeAvatarPath(getRandomInt(FAKE_AVATARS_COUNT) + 1),
});

/**
 * Generate fake post by id
 *
 * @param {number} id
 * @return {Photo}
 */
export const generateFakePost = (id) => {
  const comments = Array.from(
    { length: getRandomInt(0, MAX_FAKE_COMMENTS_PER_PHOTO + 1) },
    (_, idx) => generateFakeComment(idx + MIN_FAKE_COMMENT_ID),
  );

  return {
    id,
    url: getFakePhotoPath(id),
    description: FAKE_PHOTO_COMMENTS[id - 1] ?? '',
    likes: getRandomInt(FakeLikes.Min, FakeLikes.Max),
    comments,
  };
};

/**
 * Generate specified count of fake posts
 *
 * @param {number} count - Count of fake posts
 * @return {Photo[]}
 */
export const generateFakePosts = (count = FAKE_PHOTOS_COUNT) => (
  Array.from({ length: count }, (_, idx) => generateFakePost(idx + MIN_FAKE_PHOTO_ID))
);
