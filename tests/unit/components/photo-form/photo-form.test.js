import { URL as NodeURL } from 'node:url';
import { screen } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { closePhotoForm, openPhotoForm } from '../../../../js/components/photo-form.js';
import { HIDE_ELEMENT_CLASS, MODAL_OPEN_CLASS } from '../../../../js/constants.js';
import { resetCache } from '../../../../js/element-cache.js';
import { getScript } from '../../../helpers.js';
import {
  getImageUploadFormHtml,
  UploadFormState,
  uploadFormOverlayTestId
} from './photo-form.template.js';

describe('should be correct DOM changes', () => {
  beforeEach(async () => {
    const pathToScript = new NodeURL('../../../../vendor/pristine/pristine.min.js', import.meta.url);
    const script = await getScript(pathToScript);
    document.head.appendChild(script);
    globalThis.Pristine = globalThis.jsdom.window.Pristine;
    vi.spyOn(window, 'addEventListener').mockImplementationOnce();
    vi.spyOn(window, 'removeEventListener').mockImplementationOnce();
    resetCache();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
    delete globalThis.Pristine;
    vi.restoreAllMocks();
  });

  test('when photo upload form opens', () => {
    document.body.insertAdjacentHTML('beforeend', getImageUploadFormHtml(UploadFormState.Hidden));
    const overlayElement = screen.getByTestId(uploadFormOverlayTestId);

    openPhotoForm();

    expect(document.body).toHaveClass(MODAL_OPEN_CLASS);
    expect(overlayElement).not.toHaveClass(HIDE_ELEMENT_CLASS);
  });

  test('when photo upload form closes', () => {
    document.body.insertAdjacentHTML('beforeend', getImageUploadFormHtml(UploadFormState.Shown));
    const overlayElement = screen.getByTestId(uploadFormOverlayTestId);

    closePhotoForm();

    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);
    expect(overlayElement).toHaveClass(HIDE_ELEMENT_CLASS);
  });
});
