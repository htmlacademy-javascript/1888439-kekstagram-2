import { getByRole, queryByAltText, queryByText, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { closePhotoViewer } from '../../js/components/photo-viewer.js';
import { fillDocumentWithPhotos } from '../../js/components/photos.js';
import { FAKE_PHOTOS_COUNT, HIDE_ELEMENT_CLASS, LOAD_MORE_INCREMENT, MIN_FAKE_COMMENT_ID, MODAL_OPEN_CLASS } from '../../js/constants.js';
import { generateFakeComment, generateFakePosts } from '../../js/fake-data.js';
import { getRandomInt } from '../../js/utils';

describe('should photo view component has correct behaviour', () => {
  /** @type {import('../../js/fake-data.js').Photo[]} */
  let fakePhotos;

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

    document.body.innerHTML = `
      <main>

        <!-- Фильтрация изображений от других пользователей -->
        <section class="img-filters  img-filters--inactive  container">
          <h2 class="img-filters__title  visually-hidden">Фильтр фотографий</h2>
          <form class="img-filters__form" action="index.html" method="get" autocomplete="off">
            <button type="button" class="img-filters__button  img-filters__button--active" id="filter-default">По умолчанию</button>
            <button type="button" class="img-filters__button" id="filter-random">Случайные</button>
            <button type="button" class="img-filters__button" id="filter-discussed">Обсуждаемые</button>
          </form>
        </section>

        <!-- Контейнер для изображений от других пользователей -->
        <section class="pictures  container">
          <h2 class="pictures__title  visually-hidden">Фотографии других пользователей</h2>

          <!-- Поле для загрузки нового изображения на сайт -->
          <section class="img-upload">
            <div class="img-upload__wrapper">
              <h2 class="img-upload__title  visually-hidden">Загрузка фотографии</h2>
              <form class="img-upload__form" id="upload-select-image" autocomplete="off">

                <!-- Изначальное состояние поля для загрузки изображения -->
                <fieldset class="img-upload__start">
                  <input type="file" id="upload-file" class="img-upload__input  visually-hidden" name="filename" required>
                  <label for="upload-file" class="img-upload__label  img-upload__control">Загрузить</label>
                </fieldset>

                <!-- Форма редактирования изображения -->
                <div class="img-upload__overlay  hidden">
                  <div class="img-upload__wrapper">
                    <div class="img-upload__preview-container">

                      <!-- Изменение размера изображения -->
                      <fieldset class="img-upload__scale  scale">
                        <button type="button" class="scale__control  scale__control--smaller">Уменьшить</button>
                        <input type="text" class="scale__control  scale__control--value" value="100%" title="Image Scale" name="scale" readonly>
                        <button type="button" class="scale__control  scale__control--bigger">Увеличить</button>
                      </fieldset>

                      <!-- Предварительный просмотр изображения -->
                      <div class="img-upload__preview">
                        <img src="img/upload-default-image.jpg" alt="Предварительный просмотр фотографии">
                      </div>

                      <!-- Изменение глубины эффекта, накладываемого на изображение -->
                      <fieldset class="img-upload__effect-level  effect-level">
                        <input class="effect-level__value" type="number" step="any" name="effect-level" value="">
                        <div class="effect-level__slider"></div>
                      </fieldset>

                      <!-- Кнопка для закрытия формы редактирования изображения -->
                      <button type="reset" class="img-upload__cancel  cancel" id="upload-cancel">Закрыть</button>
                    </div>

                    <!-- Наложение эффекта на изображение -->
                    <fieldset class="img-upload__effects  effects">
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

                    <!-- Добавление хэштегов и комментария к изображению -->
                    <fieldset class="img-upload__text text">
                      <div class="img-upload__field-wrapper">
                        <input class="text__hashtags" name="hashtags" placeholder="#ХэшТег">
                      </div>
                      <div class="img-upload__field-wrapper">
                        <textarea class="text__description" name="description" placeholder="Ваш комментарий..."></textarea>
                      </div>
                    </fieldset>

                    <!-- Кнопка для отправки данных на сервер -->
                    <button type="submit" class="img-upload__submit" id="upload-submit">Опубликовать</button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          <!-- Здесь будут изображения других пользователей -->

        </section>

        <!-- Полноэкранный показ изображения -->
        <section class="big-picture  overlay  hidden">
          <h2 class="big-picture__title  visually-hidden">Просмотр фотографии</h2>
          <div class="big-picture__preview">

            <!-- Просмотр изображения -->
            <div class="big-picture__img">
              <img src="img/logo-background-3.jpg" alt="Девушка в купальнике" width="600" height="600">
            </div>

            <!-- Информация об изображении. Подпись, комментарии, количество лайков -->
            <div class="big-picture__social  social">
              <div class="social__header">
                <img class="social__picture" src="img/avatar-1.svg" alt="Аватар автора фотографии" width="35" height="35">
                <p class="social__caption">Тестим новую камеру! =)</p>
                <p class="social__likes">Нравится <span class="likes-count">356</span></p>
              </div>

              <!-- Комментарии к изображению -->
              <div class="social__comment-count"><span class="social__comment-shown-count">5</span> из <span class="social__comment-total-count">125</span> комментариев</div>
              <ul class="social__comments">
                <li class="social__comment">
                  <img class="social__picture" src="img/avatar-4.svg" alt="Аватар комментатора фотографии" width="35" height="35">
                  <p class="social__text">Мега фото! Просто обалдеть. Как вам так удалось?</p>
                </li>
                <li class="social__comment">
                  <img class="social__picture" src="img/avatar-3.svg" alt="Аватар комментатора фотографии" width="35" height="35">
                   <p class="social__text">Да это фоташоп!!!!!!!!</p>
                </li>
              </ul>

              <!-- Кнопка для загрузки новой порции комментариев -->
              <button type="button" class="social__comments-loader  comments-loader">Загрузить еще</button>

              <!-- Форма для отправки комментария -->
              <div class="social__footer">
                <img class="social__picture" src="img/avatar-6.svg" alt="Аватар комментатора фотографии" width="35" height="35">
                <input type="text" class="social__footer-text" placeholder="Ваш комментарий...">
                <button type="button" class="social__footer-btn" name="button">Отправить</button>
              </div>
            </div>

            <!-- Кнопка для выхода из полноэкранного просмотра изображения -->
            <button type="reset" class="big-picture__cancel  cancel" id="picture-cancel">Закрыть</button>
          </div>
        </section>
      </main>

      <footer class="page-footer  container">
        <div class="page-footer__wrapper">
          <div class="page-footer__copyright  copyright">
            <a class="copyright__link  copyright__link--image" href="https://htmlacademy.ru/intensive/javascript"><img src="img/htmla-logo.svg" width="130" height="45" alt="HTML Academy"></a>
            <p>Сделано в <a class="copyright__link  copyright__link--text" href="https://htmlacademy.ru/intensive/javascript">HTML Academy</a></p>
          </div>
          <ul class="page-footer__contacts  contacts">
            <li><a href="https://twitter.com/htmlacademy_ru" class="contacts__link  contacts__link--twitter">Twitter</a></li>
            <li><a href="https://vk.com/htmlacademy" class="contacts__link  contacts__link--vk">VK</a></li>
          </ul>
        </div>
      </footer>

      <!-- Шаблон изображения случайного пользователя -->
      <template id="picture">
        <a href="#" class="picture">
          <img class="picture__img" src="" width="182" height="182" alt="Случайная фотография">
          <p class="picture__info">
            <span class="picture__comments"></span>
            <span class="picture__likes"></span>
          </p>
        </a>
      </template>

      <!-- Сообщение с ошибкой загрузки изображения -->
      <template id="error">
        <section class="error">
          <div class="error__inner">
            <h2 class="error__title">Ошибка загрузки файла</h2>
            <button type="button" class="error__button">Попробовать ещё раз</button>
          </div>
        </section>
      </template>

      <!-- Сообщение об успешной загрузке изображения -->
      <template id="success">
        <section class="success">
          <div class="success__inner">
            <h2 class="success__title">Изображение успешно загружено</h2>
            <button type="button" class="success__button">Круто!</button>
          </div>
        </section>
      </template>

        <!-- Сообщение с ошибкой загрузки изображений от других пользователей -->
        <template id="data-error">
          <section class="data-error">
            <h2 class="data-error__title">Не удалось загрузить данные</h2>
          </section>
        </template>

        <template id="comment">
          <li class="social__comment">
            <img class="social__picture" src="img/avatar-4.svg" alt="Аватар комментатора фотографии" width="35" height="35">
            <p class="social__text">Мега фото! Просто обалдеть. Как вам так удалось?</p>
          </li>
        </template>
    `;
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
    expect(photoThumbnails.every((thumbnail) => thumbnail !== null)).toBe(true);

    const photoViewElement = screen.queryByText('Просмотр фотографии')?.parentElement;
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
    expect(commentElements.indexOf(null)).toBe(LOAD_MORE_INCREMENT);

    const showMoreButton = getByRole(photoViewElement, 'button', { name: 'Загрузить еще' });
    expect(showMoreButton).not.toHaveClass(HIDE_ELEMENT_CLASS);

    await user.click(showMoreButton);
    expect(shownCommentsEl).toHaveTextContent(randomPhoto.comments.length);
    commentElements = randomPhoto.comments.map(
      (comment) => queryByText(photoViewElement, comment.message)
    );
    expect(commentElements.every((comment) => comment !== null)).toBe(true);
    expect(showMoreButton).toHaveClass(HIDE_ELEMENT_CLASS);

    const closePhotoViewButton = getByRole(photoViewElement, 'button', { name: 'Закрыть' });
    await user.click(closePhotoViewButton);
    expect(photoViewElement).toHaveClass(HIDE_ELEMENT_CLASS);
    expect(document.body).not.toHaveClass(MODAL_OPEN_CLASS);
  });
});
