import { URL as NodeURL } from 'node:url';
import { screen } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { closePhotoForm, openPhotoForm } from '../../../../js/components/photo-form.js';
import { HIDE_ELEMENT_CLASS, MODAL_OPEN_CLASS } from '../../../../js/constants.js';
import { resetCache } from '../../../../js/element-cache.js';
import { getScript } from '../../../helpers.js';
import {
  closeButtonTestId,
  effectsContainerTestId,
  getImageUploadFormHtml,
  UploadFormState,
  uploadFormOverlayTestId,
  uploadFormTestId
} from './photo-form.template.js';

describe('should be correct DOM changes', () => {
  beforeEach(async () => {
    const pathToScript = new NodeURL('../../../../vendor/pristine/pristine.min.js', import.meta.url);
    const script = await getScript(pathToScript);
    document.head.appendChild(script);
    window.Pristine = globalThis.jsdom.window.Pristine;
    vi.spyOn(window, 'addEventListener').mockImplementationOnce();
    vi.spyOn(window, 'removeEventListener').mockImplementationOnce();
    resetCache();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
    delete window.Pristine;
    vi.restoreAllMocks();
  });

  test('when photo form modal is opens', () => {
    document.body.insertAdjacentHTML('beforeend', getImageUploadFormHtml(UploadFormState.Hidden));
    const closeButton = screen.getByTestId(closeButtonTestId);
    const overlayElement = screen.getByTestId(uploadFormOverlayTestId);
    const effectsContainer = screen.getByTestId(effectsContainerTestId);
    const uploadFormElement = screen.getByTestId(uploadFormTestId);
    vi.spyOn(closeButton, 'addEventListener').mockImplementationOnce();
    vi.spyOn(overlayElement, 'addEventListener').mockImplementationOnce();
    vi.spyOn(effectsContainer, 'addEventListener').mockImplementationOnce();
    vi.spyOn(uploadFormElement, 'addEventListener').mockImplementation();

    openPhotoForm();

    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);
    expect(overlayElement).not.toHaveClass(HIDE_ELEMENT_CLASS);

    expect(closeButton.addEventListener).toBeCalled();
    expect(effectsContainer.addEventListener).toBeCalled();
    expect(uploadFormElement.addEventListener).toBeCalledTimes(2);
    expect(window.addEventListener).toBeCalled();
  });

  test('when photo form modal is closes', () => {
    document.body.insertAdjacentHTML('beforeend', getImageUploadFormHtml(UploadFormState.Shown));
    const closeButton = screen.getByTestId(closeButtonTestId);
    const overlayElement = screen.getByTestId(uploadFormOverlayTestId);
    const effectsContainer = screen.getByTestId(effectsContainerTestId);
    const uploadFormElement = screen.getByTestId(uploadFormTestId);
    vi.spyOn(closeButton, 'removeEventListener').mockImplementationOnce();
    vi.spyOn(overlayElement, 'removeEventListener').mockImplementationOnce();
    vi.spyOn(effectsContainer, 'removeEventListener').mockImplementationOnce();
    vi.spyOn(uploadFormElement, 'removeEventListener').mockImplementation();

    closePhotoForm();

    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);
    expect(overlayElement).toHaveClass(HIDE_ELEMENT_CLASS);

    expect(closeButton.removeEventListener).toBeCalled();
    expect(effectsContainer.removeEventListener).toBeCalled();
    expect(uploadFormElement.removeEventListener).toBeCalledTimes(2);
    expect(window.removeEventListener).toBeCalled();
  });
});
