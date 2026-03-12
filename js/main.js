import './constants';
import './fake-data';
import './utils';
import { FAKE_PHOTOS_COUNT } from './constants';
import { generateFakePosts } from './fake-data';
import { fillDocumentWithPhotos } from './fill/photos';

const generatedPhotos = generateFakePosts(FAKE_PHOTOS_COUNT);
fillDocumentWithPhotos(generatedPhotos);
