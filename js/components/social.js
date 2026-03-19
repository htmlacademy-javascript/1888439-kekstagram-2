import { HIDE_ELEMENT_CLASS, LOAD_MORE_INCREMENT } from '../constants.js';
import { createFragmentWith, selectOrThrow } from '../utils.js';

/** @type {import('../fake-data.js').Comment[]} */
let currentComments = [];
let shownCommentsPosition = 0;

/**
 * Fills photo template element with comment data
 *
 * @param {HTMLElement} commentTemplate
 * @param {import('../fake-data.js').Comment} comment
 * @return {HTMLElement}
 */
export const fillComment = (commentTemplate, comment) => {
  const commentEl = commentTemplate.cloneNode(true);
  /** @type {HTMLImageElement} */
  const avatarEl = commentEl.querySelector('.social__picture');
  /** @type {HTMLParagraphElement} */
  const messageEl = commentEl.querySelector('.social__text');

  avatarEl.src = comment.avatar;
  avatarEl.alt = comment.name;
  messageEl.textContent = comment.message;

  return commentEl;
};

/**
 * Creates a DocumentFragment with comment elements
 *
 * @param {import('../fake-data.js').Comment[]} comments
 * @returns {DocumentFragment}
 */
export const createFragmentWithComments = (comments) => {
  /** @type {HTMLTemplateElement} */
  const commentTemplate = selectOrThrow('#comment');
  const fragment = createFragmentWith(
    comments,
    (comment) => fillComment(commentTemplate.content, comment),
  );

  return fragment;
};

/**
 * Extracts the next batch of comments from currentComments
 * of size LOAD_MORE_INCREMENT
 *
 * @returns {import('../fake-data.js').Comment[]}
 */
const getNextComments = () => {
  const previousCommentsPosition = shownCommentsPosition;
  shownCommentsPosition = shownCommentsPosition + LOAD_MORE_INCREMENT;

  return currentComments.slice(previousCommentsPosition, shownCommentsPosition);
};

/**
 * Appends the next batch of comments to the comments container element
 *
 * @param {HTMLElement} rootEl
 */
const appendComments = (rootEl) => {
  const commentsCountEl = rootEl.querySelector('.social__comment-count');
  const shownCommentsEl = commentsCountEl.querySelector('.social__comment-shown-count');
  const commentsContainer = rootEl.querySelector('.social__comments');
  const commentsLoaderBtn = rootEl.querySelector('.social__comments-loader');

  commentsContainer.append(
    createFragmentWithComments(getNextComments()),
  );
  shownCommentsEl.textContent = Math.min(shownCommentsPosition, currentComments.length);

  if (shownCommentsPosition >= currentComments.length) {
    commentsLoaderBtn.removeEventListener('click', handleClickMoreButton);
    commentsLoaderBtn.classList.add(HIDE_ELEMENT_CLASS);
  }
};

/**
 * Fills socials section with comments
 *
 * @param {HTMLElement} rootEl
 * @param {import('../fake-data.js').Photo} photo
 */
export const fillSocial = (rootEl, photo) => {
  const descriptionEl = rootEl.querySelector('.social__caption');
  const likesCountEl = rootEl.querySelector('.likes-count');
  const commentsCountEl = rootEl.querySelector('.social__comment-count');
  const totalCommentsEl = commentsCountEl.querySelector('.social__comment-total-count');
  const shownCommentsEl = commentsCountEl.querySelector('.social__comment-shown-count');
  const commentsContainer = rootEl.querySelector('.social__comments');
  const commentsLoaderBtn = rootEl.querySelector('.social__comments-loader');

  currentComments = photo.comments.slice();
  shownCommentsPosition = 0;

  totalCommentsEl.textContent = currentComments.length;
  commentsContainer.replaceChildren(
    createFragmentWithComments(getNextComments()),
  );
  shownCommentsEl.textContent = Math.min(shownCommentsPosition, currentComments.length);
  descriptionEl.textContent = photo.description;
  likesCountEl.textContent = photo.likes;

  if (shownCommentsPosition < currentComments.length) {
    commentsLoaderBtn.classList.remove(HIDE_ELEMENT_CLASS);
    commentsLoaderBtn.addEventListener('click', handleClickMoreButton);
    return;
  }

  commentsLoaderBtn.classList.add(HIDE_ELEMENT_CLASS);
};

/**
 * Handles click on show more comments button
 *
 * @param {MouseEvent} evt
 */
function handleClickMoreButton(evt) {
  evt.preventDefault();
  const socialEl = evt.target.closest('.social');
  appendComments(socialEl);
}
