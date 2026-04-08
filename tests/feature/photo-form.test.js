import { readFile } from 'node:fs/promises';
import { URL as NodeURL } from 'node:url';
import { getAllByRole, queryByText, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { closePhotoForm, handleUploadImgInput } from '../../js/components/photo-form.js';
import {
  HASHTAG_MAX_COUNT,
  HASHTAG_MAX_LENGTH,
  HashtagErrorMessage,
  HIDE_ELEMENT_CLASS,
  MODAL_OPEN_CLASS,
  PhotoFilter,
  SCALE_PERCENT_INCREMENT,
  USER_COMMENT_MAX_LENGTH
} from '../../js/constants.js';
import { resetCache } from '../../js/element-cache.js';
import { capitalize, getRandomInt } from '../../js/utils.js';
import { getScript } from '../helpers.js';
import { uploadPhoto } from '../../js/api.js';

vi.mock('../../js/api.js', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    uploadPhoto: vi.fn(),
  };
});

describe('should upload photo form component has correct behaviour', () => {
  let html = '';
  let pristineElement = null;
  let noUiSliderElement = null;
  const photoFile = new File(['content'], 'photo.jpg', { type: 'image/jpeg' });
  const mockedUploadPhoto = vi.mocked(uploadPhoto);

  beforeAll(async () => {
    const pathToTemplate = new NodeURL('./index-page.template.html', import.meta.url);
    html = await readFile(pathToTemplate, { encoding: 'utf-8' });
    const pathToPristineSrc = new NodeURL('../../vendor/pristine/pristine.min.js', import.meta.url);
    pristineElement = await getScript(pathToPristineSrc);
    const pathToNoUiSlider = new NodeURL('../../vendor/nouislider/nouislider.js', import.meta.url);
    noUiSliderElement = await getScript(pathToNoUiSlider);
  });

  beforeEach(() => {
    document.head.append(pristineElement);
    document.head.append(noUiSliderElement);
    document.body.innerHTML = html;
    const uploadInput = screen.getByTestId('photo-upload-input');
    uploadInput.addEventListener('change', handleUploadImgInput);
    window.Pristine = window.jsdom.window.Pristine;
    window.noUiSlider = window.jsdom.window.noUiSlider;
  });

  afterEach(() => {
    closePhotoForm();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.body.className = '';
    vi.resetAllMocks();
    resetCache();
    delete window.Pristine;
    delete window.noUiSlider;
  });

  test('when user tries to upload photo', async () => {
    const user = userEvent.setup();

    const uploadInput = screen.getByTestId('photo-upload-input');
    const overlayElement = screen.getByTestId('overlay');

    await user.upload(uploadInput, photoFile);
    expect(overlayElement).not.toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);

    const scaleInput = screen.getByTestId('scale-input');
    expect(scaleInput).toHaveValue('100%');

    const scaleDecreaseButton = screen.getByTestId('scale-decrease');
    await user.click(scaleDecreaseButton);
    expect(scaleInput).toHaveValue(`${100 - SCALE_PERCENT_INCREMENT}%`);

    const scaleIncreaseButton = screen.getByTestId('scale-increase');
    await user.click(scaleIncreaseButton);
    expect(scaleInput).toHaveValue('100%');

    const effectsContainerElement = screen.getByTestId('photo-effects');
    const effectLevelElement = screen.getByTestId('effect-level');
    const photoPreviewElement = screen.getByTestId('photo-preview');
    const effectElements = getAllByRole(effectsContainerElement, 'radio');
    const effectsWithoutNone = effectElements.filter((element) => element.value !== 'none');
    const randomEffectIdx = getRandomInt(0, effectsWithoutNone.length);
    const randomEffect = effectsWithoutNone[randomEffectIdx];
    const filter = PhotoFilter[capitalize(randomEffect.value)];

    expect(effectLevelElement).not.toHaveValue();
    expect(effectLevelElement).toHaveAttribute('step', 'any');
    expect(photoPreviewElement.style.filter).toBe('');

    await user.click(randomEffect);
    expect(effectLevelElement).toHaveValue(filter.Max);
    expect(effectLevelElement).not.toHaveAttribute('step', filter.Step);
    expect(photoPreviewElement.style.filter).not.toBe(filter.Template(filter.Max));

    const noneEffect = effectElements.find((element) => element.value === 'none');
    await user.click(noneEffect);
    expect(effectLevelElement).not.toHaveValue();
    expect(effectLevelElement).toHaveAttribute('step', 'any');
    expect(photoPreviewElement.style.filter).toBe('');

    const hashtagsInputElement = screen.getByTestId('hashtags-field');
    await user.click(hashtagsInputElement);
    await user.keyboard('{Escape}');
    expect(overlayElement).not.toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);

    const textFieldset = screen.getByTestId('photo-upload-text-fieldset');
    const validHashtag = '#HashTag';
    const tooManyHashtags = `${validHashtag} `.repeat(HASHTAG_MAX_COUNT + 1);
    const duplicateHashtag = validHashtag.toLowerCase();
    const tooLongHashtag = `#${'a'.repeat(HASHTAG_MAX_LENGTH)}`;
    const invalidCharsHashtag = `${validHashtag};`;
    await user.clear(hashtagsInputElement);
    await user.type(hashtagsInputElement, `${tooManyHashtags} ${duplicateHashtag} ${tooLongHashtag} ${invalidCharsHashtag}`);
    Object.values(HashtagErrorMessage).forEach((message) => {
      expect(queryByText(textFieldset, (text) => text.includes(message))).toBeInTheDocument();
    });

    await user.clear(hashtagsInputElement);
    await user.type(hashtagsInputElement, validHashtag);
    Object.values(HashtagErrorMessage).forEach((message) => {
      expect(queryByText(textFieldset, (text) => text.includes(message))).not.toBeInTheDocument();
    });

    const commentInputElement = screen.getByTestId('photo-upload-comment');
    await user.click(commentInputElement);
    await user.keyboard('{Escape}');
    expect(overlayElement).not.toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);

    const validComment = 'a'.repeat(USER_COMMENT_MAX_LENGTH);
    await user.type(commentInputElement, validComment);
    expect(commentInputElement).toHaveValue(validComment);
    await user.clear(commentInputElement);
    await user.type(commentInputElement, `${validComment}b`);
    expect(commentInputElement.value).toHaveLength(USER_COMMENT_MAX_LENGTH);
    expect(commentInputElement).toHaveValue(validComment);

    const submitButton = screen.getByTestId('photo-upload-submit');
    await user.click(submitButton);
    expect(mockedUploadPhoto).toBeCalledTimes(1);
  }, { timeout: 10_000 });

  test('when user opens and closes form', async () => {
    const user = userEvent.setup();

    const uploadInput = screen.getByTestId('photo-upload-input');
    const overlayElement = screen.getByTestId('overlay');

    await user.upload(uploadInput, photoFile);
    expect(overlayElement).not.toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);

    const scaleInput = screen.getByTestId('scale-input');
    const scaleDecreaseButton = screen.getByTestId('scale-decrease');
    await user.click(scaleDecreaseButton);
    expect(scaleInput).toHaveValue(`${100 - SCALE_PERCENT_INCREMENT}%`);

    const effectsContainerElement = screen.getByTestId('photo-effects');
    const effectLevelElement = screen.getByTestId('effect-level');
    const photoPreviewElement = screen.getByTestId('photo-preview');
    const effectElements = getAllByRole(effectsContainerElement, 'radio');
    const effectsWithoutNone = effectElements.filter((element) => element.value !== 'none');
    const randomEffectIdx = getRandomInt(0, effectsWithoutNone.length);
    const randomEffect = effectsWithoutNone[randomEffectIdx];

    await user.click(randomEffect);
    expect(effectLevelElement).toHaveValue();
    expect(effectLevelElement).not.toHaveAttribute('step', 'any');
    expect(photoPreviewElement.style.filter).not.toBe('');

    const hashtagsInputElement = screen.getByTestId('hashtags-field');
    const textFieldset = screen.getByTestId('photo-upload-text-fieldset');
    const validHashtag = '#HashTag';
    await user.type(hashtagsInputElement, validHashtag);
    Object.values(HashtagErrorMessage).forEach((message) => {
      expect(queryByText(textFieldset, (text) => text.includes(message))).not.toBeInTheDocument();
    });

    const commentInputElement = screen.getByTestId('photo-upload-comment');
    const validComment = 'a'.repeat(USER_COMMENT_MAX_LENGTH);
    await user.type(commentInputElement, validComment);
    expect(commentInputElement).toHaveValue(validComment);

    const closeButton = screen.getByTestId('upload-close-button');
    await user.click(closeButton);
    expect(overlayElement).toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);

    await user.upload(uploadInput, photoFile);
    expect(overlayElement).not.toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);
    const noneEffect = effectElements.find((element) => element.value === 'none');
    expect(noneEffect).toBeChecked();
    expect(effectLevelElement).not.toHaveValue();
    expect(effectLevelElement).toHaveAttribute('step', 'any');
    expect(hashtagsInputElement).not.toHaveValue();
    expect(commentInputElement).not.toHaveValue();
    expect(scaleInput).toHaveValue('100%');
    Object.values(HashtagErrorMessage).forEach((message) => {
      expect(queryByText(textFieldset, (text) => text.includes(message))).not.toBeInTheDocument();
    });
  });
});
