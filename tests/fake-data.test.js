import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  FAKE_AVATARS_COUNT,
  FAKE_PHOTO_COMMENTS,
  FAKE_PHOTOS_COUNT,
  FAKE_USER_MESSAGES,
  FAKE_USER_NAMES,
  FakeLikes
} from '../js/constants';
import {
  generateFakeComment,
  generateFakeMessage,
  generateFakePost,
  generateFakePosts,
  getFakeAvatarPath,
  getFakePhotoPath
} from '../js/fake-data';
import { getRandomInt } from '../js/utils';

vi.mock('../js/utils.js', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    getRandomInt: vi.fn(),
  };
});

describe('should generateFakeMessage function return random a fake user comment message', () => {
  const mockedGetRandomInt = vi.mocked(getRandomInt);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('when random allow generate one sentence in the message', () => {
    mockedGetRandomInt.mockReturnValue(0);

    const expectedMessage = `${FAKE_USER_MESSAGES[0]}`;
    expect(generateFakeMessage()).toBe(expectedMessage);
    expect(mockedGetRandomInt).toBeCalledTimes(2);
  });

  test('when random allow generate two sentences in the message', () => {
    mockedGetRandomInt.mockReturnValue(0).mockReturnValueOnce(1);

    const expectedMessage = `${FAKE_USER_MESSAGES[0]} ${FAKE_USER_MESSAGES[1]}`;
    expect(generateFakeMessage()).toBe(expectedMessage);
    expect(mockedGetRandomInt).toBeCalledTimes(3);
  });

  test('when boundary case', () => {
    mockedGetRandomInt.mockReturnValue(0).mockReturnValueOnce(FAKE_USER_MESSAGES.length + 1);

    const expectedMessage = FAKE_USER_MESSAGES.join(' ');
    expect(generateFakeMessage().trim()).toBe(expectedMessage);
    expect(mockedGetRandomInt).toBeCalledTimes(FAKE_USER_MESSAGES.length + 1);
  });
});

describe('should getFakeAvatarPath function return path to the avatar image', () => {
  test('when it get valid id', () => {
    const id = 1;
    expect(getFakeAvatarPath(id)).toBe(`img/avatar-${id}.svg`);
  });

  test('when it get invalid id', () => {
    expect(getFakeAvatarPath(FAKE_AVATARS_COUNT + 1)).toBe('img/avatar-1.svg');
    expect(getFakeAvatarPath(-1)).toBe('img/avatar-1.svg');
  });
});

describe('should getFakePhotoPath function return path to the photo image', () => {
  test('when it get valid id', () => {
    const id = 1;
    expect(getFakePhotoPath(id)).toBe(`photos/${id}.jpg`);
  });

  test('when it get invalid id', () => {
    expect(getFakePhotoPath(FAKE_PHOTOS_COUNT + 1)).toBe('photos/1.jpg');
    expect(getFakePhotoPath(-1)).toBe('photos/1.jpg');
  });
});

describe('should generateFakeComment function return random fake user comment', () => {
  const mockedGetRandomInt = vi.mocked(getRandomInt);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('when random always generate 0', () => {
    mockedGetRandomInt.mockReturnValue(0);

    const id = 0;
    const expectedComment = {
      id,
      message: `${FAKE_USER_MESSAGES[0]}`,
      name: FAKE_USER_NAMES[0],
      avatar: getFakeAvatarPath(1),
    };

    expect(generateFakeComment(id)).toEqual(expectedComment);
    expect(mockedGetRandomInt).toBeCalledTimes(4);
  });
});

describe('should generateFakePost function return random fake user post', () => {
  const mockedGetRandomInt = vi.mocked(getRandomInt);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('when it normal called', () => {
    mockedGetRandomInt.mockReturnValue(0);

    const expectedComment = generateFakeComment(0);
    const id = 1;
    const expectedPost = {
      id,
      url: 'photos/1.jpg',
      description: FAKE_PHOTO_COMMENTS[id - 1],
      likes: FakeLikes.Min,
      comments: [expectedComment],
    };

    mockedGetRandomInt.mockClear();
    mockedGetRandomInt
      .mockReturnValue(0)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(FakeLikes.Min);

    expect(generateFakePost(id)).toEqual(expectedPost);
    expect(mockedGetRandomInt).toBeCalledTimes(6);
  });

  test('when it generate 0 comments', () => {
    const commentsCount = 0;
    mockedGetRandomInt.mockReturnValue(0);

    expect(generateFakePost(1).comments.length).toBe(commentsCount);
    expect(mockedGetRandomInt).toBeCalledTimes(4 * commentsCount + 2);
  });

  test('when it generate 10 comments', () => {
    const commentsCount = 10;
    mockedGetRandomInt.mockReturnValue(0).mockReturnValueOnce(commentsCount);

    expect(generateFakePost(1).comments.length).toBe(commentsCount);
    expect(mockedGetRandomInt).toBeCalledTimes(4 * commentsCount + 2);
  });
});

describe('should generateFakePosts function return random fake user posts', () => {
  const mockedGetRandomInt = vi.mocked(getRandomInt);

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('when it get 10 as argument', () => {
    mockedGetRandomInt.mockReturnValue(0);

    const count = 10;
    const generatedPosts = generateFakePosts(count);
    expect(generatedPosts.length).toBe(count);
    expect(generatedPosts[0].id).toBe(1);
    expect(generatedPosts[count - 1].id).toBe(count);
  });

  test('when it get nothing as argument', () => {
    mockedGetRandomInt.mockReturnValue(0);

    const count = FAKE_PHOTOS_COUNT;
    const generatedPosts = generateFakePosts(count);
    expect(generatedPosts.length).toBe(count);
    expect(generatedPosts[0].id).toBe(1);
    expect(generatedPosts[count - 1].id).toBe(count);
  });
});
