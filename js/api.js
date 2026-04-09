import { API_BASE_PATH, ApiPath } from './constants.js';

/**
 * @typedef {Object} Comment
 * @property {number} id
 * @property {string} message
 * @property {string} name
 * @property {string} avatar
 */

/**
 * @typedef {Object} Photo
 * @property {number} id
 * @property {string} url
 * @property {string} description
 * @property {number} likes
 * @property {Comment[]} comments
 */

/**
 * Receives photos from the API
 *
 * @returns {Promise<Photo[]>}
 */
export const getPhotos = async () => {
  const url = API_BASE_PATH + ApiPath.Photos;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unexpected response status: ${response.status}!`);
  }

  return response.json();
};

/**
 * Uploads a user's photo to the server
 *
 * @param {FormData} formData
 */
export const uploadPhoto = async (formData) => {
  const url = API_BASE_PATH + ApiPath.UploadPhoto;
  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Unexpected response status: ${response.status}!`);
  }
};
