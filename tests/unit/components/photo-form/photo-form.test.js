import { screen } from '@testing-library/dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { closePhotoForm, openPhotoForm } from '../../../../js/components/photo-form.js';
import { HIDE_ELEMENT_CLASS, MODAL_OPEN_CLASS } from '../../../../js/constants.js';
import { resetCache } from '../../../../js/element-cache.js';
import {
  getImageUploadFormHtml,
  UploadFormState,
  uploadFormOverlayTestId
} from './photo-form.template.js';

describe('should be correct DOM changes', () => {
  const PristineMock = vi.fn(() => ({
    addValidator: vi.fn(),
    destroy: vi.fn(),
  }));

  beforeEach(() => {
    vi.stubGlobal('Pristine', PristineMock);
    vi.spyOn(window, 'addEventListener').mockImplementationOnce();
    vi.spyOn(window, 'removeEventListener').mockImplementationOnce();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.className = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetCache();
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
