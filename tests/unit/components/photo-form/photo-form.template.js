import { HIDE_ELEMENT_CLASS } from '../../../../js/constants.js';

export const closeButtonTestId = 'close-button';
export const submitButtonTestId = 'submit-button';
export const effectsContainerTestId = 'effects';
export const effectLevelTestId = 'effect-level';
export const hashtagInputTestId = 'hashtag';
export const commentInputTestId = 'comment';
export const uploadFormOverlayTestId = 'overlay';
export const uploadFormTestId = 'upload-form';

export const UploadFormState = {
  Shown: false,
  Hidden: true,
};

export const getImageUploadFormHtml = (isHidden = UploadFormState.Hidden) => `
  <section class="img-upload">
    <div class="img-upload__wrapper">
      <h2 class="img-upload__title  visually-hidden">Загрузка фотографии</h2>
      <form class="img-upload__form" id="upload-select-image" method="post" action="https://31.javascript.htmlacademy.pro/kekstagram" enctype="multipart/form-data" autocomplete="off" data-testid="${uploadFormTestId}">
        <fieldset class="img-upload__start">
          <input type="file" id="upload-file" class="img-upload__input  visually-hidden" name="filename" required>
          <label for="upload-file" class="img-upload__label  img-upload__control">Загрузить</label>
        </fieldset>
        <div class="img-upload__overlay  ${isHidden ? HIDE_ELEMENT_CLASS : ''}" data-testid="${uploadFormOverlayTestId}">
          <div class="img-upload__wrapper">
            <div class="img-upload__preview-container">
              <fieldset class="img-upload__scale  scale">
                <button type="button" class="scale__control  scale__control--smaller">Уменьшить</button>
                <input type="text" class="scale__control  scale__control--value" value="100%" title="Image Scale" name="scale" readonly>
                <button type="button" class="scale__control  scale__control--bigger">Увеличить</button>
              </fieldset>
              <div class="img-upload__preview">
                <img src="img/upload-default-image.jpg" alt="Предварительный просмотр фотографии">
              </div>
              <fieldset class="img-upload__effect-level  effect-level">
                <input class="effect-level__value" type="number" step="any" name="effect-level" value="" data-testid="${effectLevelTestId}">
                <div class="effect-level__slider"></div>
              </fieldset>
              <button type="reset" class="img-upload__cancel  cancel" id="upload-cancel" data-testid="${closeButtonTestId}">Закрыть</button>
            </div>
            <fieldset class="img-upload__effects  effects" data-testid="${effectsContainerTestId}">
              <ul class="effects__list">
                <li class="effects__item">
                  <input type="radio" class="effects__radio  visually-hidden" name="effect" id="effect-none" value="none" checked>
                  <label for="effect-none" class="effects__label">
                    <span class="effects__preview  effects__preview--none">Превью фото без эффекта</span>
                    Оригинал
                  </label>
                </li>
                <li class="effects__item">
                  <input type="radio" class="effects__radio  visually-hidden" name="effect" id="effect-chrome" value="chrome">
                  <label for="effect-chrome" class="effects__label">
                    <span class="effects__preview  effects__preview--chrome">Превью эффекта Хром</span>
                    Хром
                  </label>
                </li>
                <li class="effects__item">
                  <input type="radio" class="effects__radio  visually-hidden" name="effect" id="effect-sepia" value="sepia">
                  <label for="effect-sepia" class="effects__label">
                    <span class="effects__preview  effects__preview--sepia">Превью эффекта Сепия</span>
                    Сепия
                  </label>
                </li>
                <li class="effects__item">
                  <input type="radio" class="effects__radio  visually-hidden" name="effect" id="effect-marvin" value="marvin">
                  <label for="effect-marvin" class="effects__label">
                    <span class="effects__preview  effects__preview--marvin">Превью эффекта Марвин</span>
                    Марвин
                  </label>
                </li>
                <li class="effects__item">
                  <input type="radio" class="effects__radio  visually-hidden" name="effect" id="effect-phobos" value="phobos">
                  <label for="effect-phobos" class="effects__label">
                    <span class="effects__preview  effects__preview--phobos">Превью эффекта Фобос</span>
                    Фобос
                  </label>
                </li>
                <li class="effects__item">
                  <input type="radio" class="effects__radio  visually-hidden" name="effect" id="effect-heat" value="heat">
                  <label for="effect-heat" class="effects__label">
                    <span class="effects__preview  effects__preview--heat">Превью эффекта Зной</span>
                    Зной
                  </label>
                </li>
              </ul>
            </fieldset>
            <fieldset class="img-upload__text text">
              <div class="img-upload__field-wrapper">
                <input class="text__hashtags" name="hashtags" placeholder="#ХэшТег" data-testid="${hashtagInputTestId}">
              </div>
              <div class="img-upload__field-wrapper">
                <textarea class="text__description" name="description" placeholder="Ваш комментарий..." maxlength="140" data-testid="${commentInputTestId}"></textarea>
              </div>
            </fieldset>
            <button type="submit" class="img-upload__submit" id="upload-submit" data-testid="${submitButtonTestId}">Опубликовать</button>
          </div>
        </div>
      </form>
    </div>
  </section>
`;
