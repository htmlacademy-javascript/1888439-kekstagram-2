import { HIDE_ELEMENT_CLASS } from '../constants.js';
import { createFragmentWith, selectOrThrow } from '../utils.js';

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
 * Fills socials section with comments
 *
 * @param {HTMLElement} rootEl
 * @param {import('../fake-data.js').Photo} photo
 */
export const fillSocial = (rootEl, photo) => {
  const descriptionEl = rootEl.querySelector('.social__caption');
  const likesCountEl = rootEl.querySelector('.likes-count');
  const commentsCountEl = rootEl.querySelector('.social__comment-count');
  const shownCommentsEl = commentsCountEl.querySelector('.social__comment-shown-count');
  const totalCommentsEl = commentsCountEl.querySelector('.social__comment-total-count');
  const commentsContainer = rootEl.querySelector('.social__comments');
  const commentsLoaderBtn = rootEl.querySelector('.social__comments-loader');

  descriptionEl.textContent = photo.description;
  likesCountEl.textContent = photo.likes;
  shownCommentsEl.textContent = photo.comments.length;
  totalCommentsEl.textContent = photo.comments.length;
  commentsCountEl.classList.add(HIDE_ELEMENT_CLASS);
  commentsContainer.replaceChildren(createFragmentWithComments(photo.comments));
  commentsLoaderBtn.classList.add(HIDE_ELEMENT_CLASS);
};
