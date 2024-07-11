import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const initialImageGalleryState = {
  images: [],
};

const initialKittenGalleryState = {
  images: [],
};

const imageGalleryReducer = (state = initialImageGalleryState, action) => {
  switch (action.type) {
    case 'ADD_IMAGE_GALLERY_IMAGE':
      return { ...state, images: [...state.images, action.payload] };
    case 'SET_IMAGE_GALLERY_IMAGES':
      return { ...state, images: action.payload };
    default:
      return state;
  }
};

const kittenGalleryReducer = (state = initialKittenGalleryState, action) => {
  switch (action.type) {
    case 'ADD_KITTEN_GALLERY_IMAGE':
      return { ...state, images: [...state.images, action.payload] };
    case 'SET_KITTEN_GALLERY_IMAGES':
      return { ...state, images: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  imageGallery: imageGalleryReducer,
  kittenGallery: kittenGalleryReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
