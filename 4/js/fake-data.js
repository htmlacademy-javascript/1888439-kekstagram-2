import {
  FAKE_AVATARS_COUNT,
  FAKE_PHOTO_COMMENTS,
  FAKE_PHOTOS_COUNT,
  FAKE_USER_MESSAGES,
  FAKE_USER_NAMES,
  FakeLikes,
  MAX_FAKE_COMMENTS_PER_PHOTO,
  MAX_SENTENCES_IN_FAKE_COMMENT_MESSAGE,
  MIN_FAKE_COMMENT_ID,
  MIN_FAKE_PHOTO_ID
} from './constants';
import { cycleNum, getRandomInt } from './utils';

/**
 * @typedef {Object} Comment
 * @property {number} id
 * @property {string} message
 * @property {string} name
 * @property {string} avatar
 */

/**
 * @typedef {Object} Post
 * @property {number} id
 * @property {string} url
 * @property {string} description
 * @property {number} likes
 * @property {Comment[]} comments
 */

/**
 * Generate fake photo path by id
 * @param {number} photoId - Fake photo id
 * @returns {string}
 */
export const getFakePhotoPath = (photoId) => {
  const limitedPhotoId = cycleNum(photoId, FAKE_PHOTOS_COUNT);
  return `photos/${limitedPhotoId}.jpg`;
};

/**
 * Generate fake avatar path by id
 * @param {number} avatarId - Fake avatar id
 * @returns {string}
 */
export const getFakeAvatarPath = (avatarId) => {
  const restrictiveAvatarId = cycleNum(avatarId, FAKE_AVATARS_COUNT);
  return `img/avatar-${restrictiveAvatarId}.svg`;
};

/**
 * Generates fake user comment message
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
 * @param {number} id
 * @return {Post}
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
 * @param {number} count - Count of fake posts
 * @return {Post[]}
 */
export const generateFakePosts = (count = FAKE_PHOTOS_COUNT) => (
  Array.from({ length: count }, (_, idx) => generateFakePost(idx + MIN_FAKE_PHOTO_ID))
);
