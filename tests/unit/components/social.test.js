import { queryAllByText, queryByAltText, queryByText } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { createFragmentWithComments, fillComment, fillSocial } from '../../../js/components/social.js';
import { MIN_FAKE_COMMENT_ID, MIN_FAKE_PHOTO_ID } from '../../../js/constants.js';
import { generateFakeComment, generateFakePost } from '../../../js/fake-data.js';

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

describe('should fillSocial function fill root of social element with given photo data', () => {
  let socialElement;

  beforeEach(() => {
    socialElement = document.createElement('div');
    socialElement.classList.add('big-picture__social', 'social');
    socialElement.innerHTML = `
      <div class="social__header">
        <img class="social__picture" src="img/avatar-1.svg" alt="Аватар автора фотографии" width="35" height="35">
        <p class="social__caption">Тестим новую камеру! =)</p>
        <p class="social__likes">Нравится <span class="likes-count">356</span></p>
      </div>

      <div class="social__comment-count"><span class="social__comment-shown-count">5</span> из <span class="social__comment-total-count">125</span> комментариев</div>
      <ul class="social__comments">
      </ul>

      <button type="button" class="social__comments-loader  comments-loader">Загрузить еще</button>

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
  });

  test('when it gets data', () => {
    const fakePhoto = generateFakePost(MIN_FAKE_PHOTO_ID);
    fakePhoto.comments = Array.from(
      { length: 3 },
      (_, idx) => {
        const newComment = generateFakeComment(idx + MIN_FAKE_COMMENT_ID);
        newComment.message = `Message ${idx + 1}`;
        return newComment;
      }
    );

    fillSocial(socialElement, fakePhoto);

    const descriptionElement = queryByText(socialElement, fakePhoto.description);
    expect(descriptionElement).not.toBeNull();

    const likesElement = queryByText(socialElement, fakePhoto.likes);
    expect(likesElement).not.toBeNull();

    const commentsCountElement = queryAllByText(socialElement, fakePhoto.comments.length);
    expect(commentsCountElement.length).toBe(2);

    const commentElements = fakePhoto.comments.map(
      (comment) => queryByText(socialElement, comment.message),
    );
    expect(commentElements.every((element) => element !== null)).toBe(true);
  });
});
