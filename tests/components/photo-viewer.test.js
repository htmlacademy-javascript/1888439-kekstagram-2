import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { closePhotoViewer, openPhotoViewer } from '../../js/components/photo-viewer';
import { fillSocial } from '../../js/components/social';
import { HIDE_ELEMENT_CLASS, MIN_FAKE_PHOTO_ID, MODAL_OPEN_CLASS } from '../../js/constants';
import { generateFakePost } from '../../js/fake-data';

vi.mock('../../js/components/social.js', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    fillSocial: vi.fn(),
  };
});

describe('should openPhotoViewer function opens photo viewer element inside document', () => {
  const mockedFillSocial = vi.mocked(fillSocial);

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  test('when it gets photo', () => {
    const containerId = 'big-picture';
    document.body.innerHTML = `
      <section class="big-picture overlay ${HIDE_ELEMENT_CLASS}" data-testid="${containerId}">
        <h2 class="big-picture__title  visually-hidden">Просмотр фотографии</h2>
        <div class="big-picture__preview">
          <div class="big-picture__img">
            <img src="img/logo-background-3.jpg" alt="Девушка в купальнике" width="600" height="600">
          </div>
          <button type="reset" class="big-picture__cancel  cancel" id="picture-cancel" data-testid="close-button">Закрыть</button>
        </div>
      </section>
    `;
    vi.spyOn(window, 'addEventListener').mockImplementationOnce();
    const closeButton = screen.getByTestId('close-button');
    vi.spyOn(closeButton, 'addEventListener').mockImplementationOnce();
    const fakePhoto = generateFakePost(MIN_FAKE_PHOTO_ID);

    openPhotoViewer(fakePhoto);

    const imgEl = screen.queryByAltText(fakePhoto.description);
    expect(imgEl).not.toBeNull();
    expect(imgEl).toHaveAttribute('src', fakePhoto.url);

    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);
    expect(screen.queryByTestId(containerId)).not.toHaveClass(HIDE_ELEMENT_CLASS);

    expect(mockedFillSocial).toBeCalled();
    expect(window.addEventListener).toBeCalled();
    expect(closeButton.addEventListener).toBeCalled();
  });
});

describe('should closePhotoViewer function closes photo viewer element inside document', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
    vi.restoreAllMocks();
  });

  test('when it called', () => {
    const containerId = 'big-picture';
    document.body.classList.add(MODAL_OPEN_CLASS);
    document.body.innerHTML = `
      <section class="big-picture overlay" data-testid="${containerId}">
        <h2 class="big-picture__title  visually-hidden">Просмотр фотографии</h2>
        <div class="big-picture__preview">
          <div class="big-picture__img">
            <img src="img/logo-background-3.jpg" alt="Девушка в купальнике" width="600" height="600">
          </div>
          <button type="reset" class="big-picture__cancel  cancel" id="picture-cancel" data-testid="close-button">Закрыть</button>
        </div>
      </section>
    `;
    vi.spyOn(window, 'removeEventListener').mockImplementationOnce();
    const closeButton = screen.getByTestId('close-button');
    vi.spyOn(closeButton, 'removeEventListener').mockImplementationOnce();

    closePhotoViewer();

    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);
    expect(screen.getByTestId(containerId)).toHaveClass(HIDE_ELEMENT_CLASS);

    expect(window.removeEventListener).toBeCalled();
    expect(closeButton.removeEventListener).toBeCalled();
  });
});

describe('should closing events be handled correctly', () => {
  const photoViewTestId = 'photo-view';

  beforeEach(() => {
    document.body.innerHTML = `
      <section class="big-picture overlay ${HIDE_ELEMENT_CLASS}" data-testid="${photoViewTestId}">
        <h2 class="big-picture__title  visually-hidden">Просмотр фотографии</h2>
        <div class="big-picture__preview">
          <div class="big-picture__img">
            <img src="img/logo-background-3.jpg" alt="Девушка в купальнике" width="600" height="600">
          </div>
          <button type="reset" class="big-picture__cancel  cancel" id="picture-cancel">Закрыть</button>
        </div>
      </section>
    `;
    const fakePhoto = generateFakePost(MIN_FAKE_PHOTO_ID);
    openPhotoViewer(fakePhoto);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
    vi.restoreAllMocks();
  });

  test('when user press to escape', async () => {
    const user = userEvent.setup();

    await user.keyboard('{Escape}');

    const photoViewEl = screen.getByTestId(photoViewTestId);
    expect(photoViewEl).toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);
  });

  test('when user click the close button', async () => {
    const user = userEvent.setup();
    const closeButtonEl = screen.getByRole('button', { value: 'Закрыть' });

    await user.click(closeButtonEl);

    const photoViewEl = screen.getByTestId(photoViewTestId);
    expect(photoViewEl).toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);
  });
});
