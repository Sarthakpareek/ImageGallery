import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

// screens
import ImageGalleryWithFlex from './screens/ImageGalleryWithFlex';
import KittenGallery from './screens/KittenGallery';
import PaperGallery from './screens/PaperGallery';

// components
import Header from './compoents/Header';
import ImageModal from './modal/ImageModal';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [images, setImages] = useState({
    ImageGalleryWithFlex: [],
    KittenGallery: [],
    PaperGallery: [],
  });

  const toggleModal = (screen) => {
    setSelectedScreen(screen);
    setModalVisible(!isModalVisible);
  };

  const addImage = (imageUri) => {
    setImages(prev => ({
      ...prev,
      [selectedScreen]: [...prev[selectedScreen], imageUri],
    }));
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <Drawer.Navigator initialRouteName="ImageGalleryWithFlex">
              {["ImageGalleryWithFlex", "KittenGallery", "PaperGallery"].map(screen => (
                <Drawer.Screen
                  key={screen}
                  name={screen}
                  options={{
                    headerRight: () => (
                      <Header onPress={() => toggleModal(screen)} />
                    )
                  }}
                >
                  {props => {
                    const ScreenComponent = screen === "ImageGalleryWithFlex" ? ImageGalleryWithFlex : screen === "KittenGallery" ? KittenGallery : PaperGallery;
                    return (
                      <ScreenComponent
                        {...props}
                        newImage={images[screen][images[screen].length - 1]}
                      />
                    );
                  }}
                </Drawer.Screen>
              ))}
            </Drawer.Navigator>
          </NavigationContainer>
          <ImageModal
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
            onAddImage={(imageUri) => {
              addImage(imageUri);
              setModalVisible(false);
            }}
          />
        </ApplicationProvider>
      </PersistGate>
    </Provider>
  );
}