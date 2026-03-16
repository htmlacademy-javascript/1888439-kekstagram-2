import { queryByAltText, queryByAttribute, queryByText, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { closePhotoViewer } from '../../js/components/photo-viewer';
import { createFragmentWithPhotos, fillDocumentWithPhotos, fillPhotoTemplate } from '../../js/components/photos';
import { FAKE_PHOTOS_COUNT, HIDE_ELEMENT_CLASS, MIN_FAKE_PHOTO_ID, MODAL_OPEN_CLASS } from '../../js/constants';
import { generateFakePost, generateFakePosts } from '../../js/fake-data';

vi.mock('../../js/components/social.js', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    fillSocial: vi.fn(),
  };
});

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
    expect(queryByAttribute('href', container, generatedPhoto.url)).not.toBeNull();
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

describe('should display photo viewer', () => {
  const photoViewTestId = 'photo-view';
  const fakePhoto = generateFakePost(MIN_FAKE_PHOTO_ID);

  beforeEach(() => {
    document.body.innerHTML = `
      <section class="pictures"></section>

      <section class="big-picture overlay ${HIDE_ELEMENT_CLASS}" data-testid="${photoViewTestId}">
        <h2 class="big-picture__title  visually-hidden">Просмотр фотографии</h2>
        <div class="big-picture__preview">
          <div class="big-picture__img">
            <img src="img/logo-background-3.jpg" alt="Девушка в купальнике" width="600" height="600">
          </div>
          <button type="reset" class="big-picture__cancel  cancel" id="picture-cancel">Закрыть</button>
        </div>
      </section>

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

    fillDocumentWithPhotos([fakePhoto]);
  });

  afterEach(() => {
    closePhotoViewer();
    document.body.innerHTML = '';
    document.body.className = '';
  });

  test('when user clicked on photo preview', async () => {
    const user = userEvent.setup();
    const previewElement = screen.getByRole(
      'link',
      { name: new RegExp(fakePhoto.description) }
    );

    await user.click(previewElement);

    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);
    expect(screen.getByTestId(photoViewTestId)).not.toHaveClass(HIDE_ELEMENT_CLASS);
  });
});
