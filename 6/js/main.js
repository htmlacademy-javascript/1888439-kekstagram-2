import './utils.js';
import { FAKE_PHOTOS_COUNT } from './constants.js';
import { generateFakePosts } from './fake-data.js';
import { fillDocumentWithPhotos } from './fill/photos.js';

const generatedPhotos = generateFakePosts(FAKE_PHOTOS_COUNT);
fillDocumentWithPhotos(generatedPhotos);
