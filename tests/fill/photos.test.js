import { queryByAltText, queryByText, screen } from '@testing-library/dom';
import { afterEach, describe, expect, test } from 'vitest';
import { FAKE_PHOTOS_COUNT, MIN_FAKE_PHOTO_ID } from '../../js/constants';
import { generateFakePost, generateFakePosts } from '../../js/fake-data';
import { createFragmentWithPhotos, fillDocumentWithPhotos, fillPhotoTemplate } from '../../js/fill/photos';

describe('should fillPhoto function return DocumentFragment filled width photo data', () => {
  const pictureTemplate = document.createElement('template');
  pictureTemplate.innerHTML = `
    <a href="#" class="picture">
      <img class="picture__img" src="" width="182" height="182" alt="Случайная фотография">
      <p class="picture__info">
        <span class="picture__comments"></span>
        <span class="picture__likes"></span>
      </p>
    </a>
  `;

  test('when it gets data', () => {
    const generatedPhoto = generateFakePost(MIN_FAKE_PHOTO_ID);
    const fragment = fillPhotoTemplate(pictureTemplate.content, generatedPhoto);
    const container = document.createElement('div');
    container.append(fragment);

    const imgEl = queryByAltText(container, generatedPhoto.description);
    expect(imgEl).not.toBeNull();
    expect(imgEl).toHaveAttribute('src', generatedPhoto.url);

    expect(queryByText(container, generatedPhoto.likes)).not.toBeNull();
    expect(queryByText(container, generatedPhoto.comments.length)).not.toBeNull();
  });
});

describe('should createFragmentWithPhotos function has deterministic behaviour', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('when it gets data', () => {
    document.body.innerHTML = `
      <template id="picture">
        <a href="#" class="picture">
          <img class="picture__img" src="" width="182" height="182" alt="Случайная фотография">
          <p class="picture__info">
            <span class="picture__comments"></span>
            <span class="picture__likes"></span>
          </p>
        </a>
      </template>
    `;
    const generatedPhotos = generateFakePosts(FAKE_PHOTOS_COUNT);

    const photosFragment = createFragmentWithPhotos(generatedPhotos);

    expect(photosFragment).instanceOf(DocumentFragment);
    expect(photosFragment.childElementCount).toBe(FAKE_PHOTOS_COUNT);
  });

  test('when template not found', () => {
    const generatedPhotos = generateFakePosts(1);

    expect(() => createFragmentWithPhotos(generatedPhotos))
      .toThrowError(/'#picture' not found/);
  });
});

describe('should fillDocumentWithPhotos function has deterministic behaviour', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('when it gets data', () => {
    document.body.innerHTML = `
      <section class="pictures"></section>
      <template id="picture">
        <a href="#" class="picture">
          <img class="picture__img" src="" width="182" height="182" alt="Случайная фотография">
          <p class="picture__info">
            <span class="picture__comments"></span>
            <span class="picture__likes"></span>
          </p>
        </a>
      </template>
    `;
    const generatedPhotos = generateFakePosts(FAKE_PHOTOS_COUNT);

    fillDocumentWithPhotos(generatedPhotos);

    const photoElements = generatedPhotos.map((photo) => screen.queryByAltText(photo.description));
    expect(photoElements.every((element) => element !== null)).toBe(true);
  });

  test('when container not found', () => {
    document.body.innerHTML = `
      <template id="picture">
        <a href="#" class="picture">
          <img class="picture__img" src="" width="182" height="182" alt="Случайная фотография">
          <p class="picture__info">
            <span class="picture__comments"></span>
            <span class="picture__likes"></span>
          </p>
        </a>
      </template>
    `;
    const generatedPhotos = generateFakePosts(1);

    expect(() => fillDocumentWithPhotos(generatedPhotos))
      .toThrowError(/'\.pictures' not found/);
  });
});
