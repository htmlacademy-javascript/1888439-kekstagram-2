import './utils.js';
import { fillDocumentWithPhotos } from './components/photos.js';
import { FAKE_PHOTOS_COUNT } from './constants.js';
import { generateFakePosts } from './fake-data.js';

const generatedPhotos = generateFakePosts(FAKE_PHOTOS_COUNT);
fillDocumentWithPhotos(generatedPhotos);
