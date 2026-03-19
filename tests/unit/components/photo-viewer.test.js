import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { closePhotoViewer, openPhotoViewer } from '../../../js/components/photo-viewer.js';
import { fillSocial } from '../../../js/components/social.js';
import { HIDE_ELEMENT_CLASS, MIN_FAKE_PHOTO_ID, MODAL_OPEN_CLASS } from '../../../js/constants.js';
import { generateFakePost } from '../../../js/fake-data.js';

const photoViewTestId = 'big-picture';
const getPictureSectionHtml = (hidden) => `
  <section class="big-picture overlay ${hidden ? HIDE_ELEMENT_CLASS : ''}" data-testid="${photoViewTestId}">
    <h2 class="big-picture__title  visually-hidden">Просмотр фотографии</h2>
    <div class="big-picture__preview">
      <div class="big-picture__img">
        <img src="img/logo-background-3.jpg" alt="Девушка в купальнике" width="600" height="600">
      </div>
      <button type="reset" class="big-picture__cancel  cancel" id="picture-cancel">Закрыть</button>
    </div>
  </section>
`;

vi.mock('../../../js/components/social.js', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    fillSocial: vi.fn(),
  };
});

describe('should be correct DOM changes', () => {
  const mockedFillSocial = vi.mocked(fillSocial);

  beforeEach(() => {
    vi.spyOn(window, 'addEventListener').mockImplementationOnce();
    vi.spyOn(window, 'removeEventListener').mockImplementationOnce();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
    vi.restoreAllMocks();
  });

  test('when photo view modal is opens', () => {
    document.body.innerHTML = getPictureSectionHtml(true);
    const fakePhoto = generateFakePost(MIN_FAKE_PHOTO_ID);
    const closeButton = screen.getByRole('button', { value: 'Закрыть' });
    vi.spyOn(closeButton, 'addEventListener').mockImplementationOnce();

    openPhotoViewer(fakePhoto);

    const imgEl = screen.queryByAltText(fakePhoto.description);
    expect(imgEl).not.toBeNull();
    expect(imgEl).toHaveAttribute('src', fakePhoto.url);

    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);
    expect(screen.queryByTestId(photoViewTestId)).not.toHaveClass(HIDE_ELEMENT_CLASS);

    expect(mockedFillSocial).toBeCalled();
    expect(window.addEventListener).toBeCalled();
    expect(closeButton.addEventListener).toBeCalled();
  });

  test('when photo view modal is closes', () => {
    document.body.classList.add(MODAL_OPEN_CLASS);
    document.body.innerHTML = getPictureSectionHtml(false);
    const closeButton = screen.getByRole('button', { name: 'Закрыть' });
    vi.spyOn(closeButton, 'removeEventListener').mockImplementationOnce();

    closePhotoViewer();

    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);
    expect(screen.getByTestId(photoViewTestId)).toHaveClass(HIDE_ELEMENT_CLASS);

    expect(window.removeEventListener).toBeCalled();
    expect(closeButton.removeEventListener).toBeCalled();
  });
});

describe('should closing events be handled correctly', () => {
  beforeEach(() => {
    document.body.innerHTML = getPictureSectionHtml(true);
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
    const closeButtonEl = screen.getByRole('button', { name: 'Закрыть' });

    await user.click(closeButtonEl);

    const photoViewEl = screen.getByTestId(photoViewTestId);
    expect(photoViewEl).toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);
  });
});
