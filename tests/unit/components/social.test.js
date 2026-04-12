import { getByTestId, queryByAltText, queryByText } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { createFragmentWithComments, fillComment, fillSocial } from '../../../js/components/social.js';
import { HIDE_ELEMENT_CLASS, LOAD_MORE_INCREMENT } from '../../../js/constants.js';
import { generateFakeComment, generateFakePost, MIN_FAKE_COMMENT_ID, MIN_FAKE_PHOTO_ID} from '../../fake-data.js';
import { resetCache } from '../../../js/element-cache.js';

const createCommentTemplate = () => {
  const commentTemplate = document.createElement('template');
  commentTemplate.id = 'comment';
  commentTemplate.innerHTML = `
    <li class="social__comment">
      <img class="social__picture" src="img/avatar-4.svg" alt="Аватар комментатора фотографии" width="35" height="35">
      <p class="social__text">Мега фото! Просто обалдеть. Как вам так удалось?</p>
    </li>
  `;
  return commentTemplate;
};

describe('should fillComment function return DocumentFragment filled width comment data', () => {
  afterEach(() => {
    resetCache();
  });

  test('when it gets data', () => {
    const fakeComment = generateFakeComment(MIN_FAKE_COMMENT_ID);
    const commentTemplate = createCommentTemplate();
    const fragment = fillComment(commentTemplate.content, fakeComment);
    const container = document.createElement('div');
    container.append(fragment);

    const avatarImg = queryByAltText(container, fakeComment.name);
    expect(avatarImg).not.toBeNull();
    expect(avatarImg).toHaveAttribute('src', fakeComment.avatar);

    expect(queryByText(container, fakeComment.message)).not.toBeNull();
  });
});

describe('should createFragmentWithComments function has deterministic behaviour', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    resetCache();
  });

  test('when it gets data', () => {
    document.body.append(createCommentTemplate());
    const commentsCount = 3;
    const fakeComments = Array.from(
      { length: commentsCount },
      (_, idx) => generateFakeComment(MIN_FAKE_COMMENT_ID + idx),
    );

    const commentsFragment = createFragmentWithComments(fakeComments);

    expect(commentsFragment).instanceOf(DocumentFragment);
    expect(commentsFragment.childElementCount).toBe(commentsCount);
  });

  test('when template not found', () => {
    const fakeComment = generateFakeComment(MIN_FAKE_COMMENT_ID);

    expect(() => createFragmentWithComments([fakeComment]))
      .toThrowError(/not found/);
  });
});

describe('should fillSocial function has deterministic behaviour', () => {
  const shownCountTestId = 'shown-count';
  const totalCountTestId = 'total-count';
  const showMoreTestId = 'show-more';
  let socialElement;

  const getPhotoWithComments = (commentsCount) => {
    const fakePhoto = generateFakePost(MIN_FAKE_PHOTO_ID);
    fakePhoto.comments = Array.from(
      { length: commentsCount },
      (_, idx) => {
        const newComment = generateFakeComment(idx + MIN_FAKE_COMMENT_ID);
        newComment.message = `Message ${idx + 1}`;
        return newComment;
      }
    );

    return fakePhoto;
  };

  beforeEach(() => {
    socialElement = document.createElement('div');
    socialElement.classList.add('big-picture__social', 'social');
    socialElement.innerHTML = `
      <div class="social__header">
        <img class="social__picture" src="img/avatar-1.svg" alt="Аватар автора фотографии" width="35" height="35">
        <p class="social__caption">Тестим новую камеру! =)</p>
        <p class="social__likes">Нравится <span class="likes-count">356</span></p>
      </div>

      <div class="social__comment-count"><span class="social__comment-shown-count" data-testid="${shownCountTestId}">5</span> из <span class="social__comment-total-count" data-testid="${totalCountTestId}">125</span> комментариев</div>
      <ul class="social__comments">
      </ul>

      <button type="button" class="social__comments-loader  comments-loader" data-testid="${showMoreTestId}">Загрузить еще</button>

      <div class="social__footer">
        <img class="social__picture" src="img/avatar-6.svg" alt="Аватар комментатора фотографии" width="35" height="35">
        <input type="text" class="social__footer-text" placeholder="Ваш комментарий...">
        <button type="button" class="social__footer-btn" name="button">Отправить</button>
      </div>
    `;

    document.body.append(createCommentTemplate());
  });

  afterEach(() => {
    document.body.innerHTML = '';
    resetCache();
  });

  test(`when it gets photo with LOAD_MORE_INCREMENT(${LOAD_MORE_INCREMENT}) comments`, () => {
    const fakePhoto = getPhotoWithComments(LOAD_MORE_INCREMENT);
    const shownCountElement = getByTestId(socialElement, shownCountTestId);
    const totalCountElement = getByTestId(socialElement, totalCountTestId);
    const showMoreButton = getByTestId(socialElement, showMoreTestId);

    fillSocial(socialElement, fakePhoto);

    expect(queryByText(socialElement, fakePhoto.description)).not.toBeNull();
    expect(queryByText(socialElement, fakePhoto.likes)).not.toBeNull();
    expect(shownCountElement).toHaveTextContent(LOAD_MORE_INCREMENT);
    expect(totalCountElement).toHaveTextContent(fakePhoto.comments.length);
    expect(showMoreButton).toHaveClass(HIDE_ELEMENT_CLASS);

    const commentElements = fakePhoto.comments.map(
      (comment) => queryByText(socialElement, comment.message),
    );
    expect(commentElements.every((element) => element !== null)).toBe(true);
  });

  test(`when it gets photo with LOAD_MORE_INCREMENT + 1(${LOAD_MORE_INCREMENT + 1}) comments`, () => {
    const fakePhoto = getPhotoWithComments(LOAD_MORE_INCREMENT + 1);
    const shownCountElement = getByTestId(socialElement, shownCountTestId);
    const showMoreButton = getByTestId(socialElement, showMoreTestId);

    fillSocial(socialElement, fakePhoto);

    expect(shownCountElement).toHaveTextContent(LOAD_MORE_INCREMENT);
    expect(showMoreButton).not.toHaveClass(HIDE_ELEMENT_CLASS);

    const commentElements = fakePhoto.comments.map(
      (comment) => queryByText(socialElement, comment.message),
    );
    expect(commentElements.some((element) => element === null)).toBe(true);
  });

  test('when it gets photo with 0 comments', () => {
    const fakePhoto = getPhotoWithComments(0);
    const showMoreButton = getByTestId(socialElement, showMoreTestId);

    fillSocial(socialElement, fakePhoto);

    expect(showMoreButton).toHaveClass(HIDE_ELEMENT_CLASS);
  });

  test('when user click show more button', async () => {
    const user = userEvent.setup();
    const fakePhoto = getPhotoWithComments(LOAD_MORE_INCREMENT + 1);
    const showMoreButton = getByTestId(socialElement, showMoreTestId);

    fillSocial(socialElement, fakePhoto);

    expect(showMoreButton).not.toHaveClass(HIDE_ELEMENT_CLASS);

    await user.click(showMoreButton);

    expect(showMoreButton).toHaveClass(HIDE_ELEMENT_CLASS);

    const commentElements = fakePhoto.comments.map(
      (comment) => queryByText(socialElement, comment.message),
    );
    expect(commentElements.every((element) => element !== null)).toBe(true);
  });
});
