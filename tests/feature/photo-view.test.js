import { getByTestId, queryByAltText, queryByText, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { readFile } from 'node:fs/promises';
import { URL as NodeURL } from 'node:url';
import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { closePhotoViewer } from '../../js/components/photo-viewer.js';
import { fillDocumentWithPhotos } from '../../js/components/photos.js';
import { HIDE_ELEMENT_CLASS, LOAD_MORE_INCREMENT, MODAL_OPEN_CLASS } from '../../js/constants.js';
import { getRandomInt } from '../../js/utils.js';
import { FAKE_PHOTOS_COUNT, generateFakeComment, generateFakePosts, MIN_FAKE_COMMENT_ID } from '../fake-data.js';

describe('should photo view component has correct behaviour', () => {
  /** @type {import('../../js/fake-data.js').Photo[]} */
  let fakePhotos = [];
  let html = '';

  beforeAll(async () => {
    const pathToTemplate = new NodeURL('./index-page.template.html', import.meta.url);
    html = await readFile(pathToTemplate, { encoding: 'utf-8' });
  });

  beforeEach(() => {
    fakePhotos = generateFakePosts(FAKE_PHOTOS_COUNT).map((photo) => ({
      ...photo,
      comments: Array.from(
        { length: LOAD_MORE_INCREMENT + 1 },
        (_, idx) => ({
          ...generateFakeComment(idx + MIN_FAKE_COMMENT_ID),
          message: `Message ${idx + 1}`,
        })),
    }));

    document.body.innerHTML = html;
  });

  afterEach(() => {
    closePhotoViewer();
    document.body.classList = '';
    document.body.innerHTML = '';
  });

  test('when user click on random photo thumbnail', async () => {
    const user = userEvent.setup();

    fillDocumentWithPhotos(fakePhotos);

    const photoThumbnails = fakePhotos.map(
      (photo) => screen.queryByRole(
        'link',
        { name: (name) => name.includes(photo.description) }
      ),
    );
    expect(photoThumbnails.every(Boolean)).toBeTruthy();

    const photoViewElement = screen.getByTestId('photo-view');
    expect(photoViewElement).toBeDefined();
    expect(photoViewElement).toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);

    const randomPhotoIdx = getRandomInt(photoThumbnails.length);
    const randomPhoto = fakePhotos[randomPhotoIdx];
    const randomThumbnailEl = photoThumbnails[randomPhotoIdx];

    await user.click(randomThumbnailEl);
    expect(photoViewElement).not.toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);

    const photoElement = queryByAltText(photoViewElement, randomPhoto.description);
    expect(photoElement).not.toBeNull();

    const shownCommentsEl = queryByText(photoViewElement, LOAD_MORE_INCREMENT);
    expect(shownCommentsEl).not.toBeNull();

    const totalCommentsEl = queryByText(photoViewElement, randomPhoto.comments.length);
    expect(totalCommentsEl).not.toBeNull();

    let commentElements = randomPhoto.comments.map(
      (comment) => queryByText(photoViewElement, comment.message)
    );
    expect(commentElements.some((element) => element === null)).toBe(true);

    const showMoreButton = getByTestId(photoViewElement, 'load-more');
    expect(showMoreButton).not.toHaveClass(HIDE_ELEMENT_CLASS);

    await user.click(showMoreButton);
    expect(shownCommentsEl).toHaveTextContent(randomPhoto.comments.length);
    commentElements = randomPhoto.comments.map(
      (comment) => queryByText(photoViewElement, comment.message)
    );
    expect(commentElements.every((comment) => comment !== null)).toBe(true);
    expect(showMoreButton).toHaveClass(HIDE_ELEMENT_CLASS);

    const commentInputEl = screen.getByTestId('add-comment-input');
    await user.click(commentInputEl);
    await user.keyboard('{Escape}');
    expect(photoViewElement).not.toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);

    const closePhotoViewButton = getByTestId(photoViewElement, 'close-photo-view');
    await user.click(closePhotoViewButton);
    expect(photoViewElement).toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);
  });
});
