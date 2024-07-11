import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  Button,
} from "react-native";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector, useDispatch } from "react-redux";
import images from "../utils/data";
import ImageRenderer from "../compoents/ImageRenderer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ImageGalleryWithFlex({ newImage }) {
  const [viewMode, setViewMode] = useState("grid");
  const [imageDimensions, setImageDimensions] = useState({});
  const [columnsData, setColumnsData] = useState([]);
  const [imagesList, setImagesList] = useState([]); // Initialize with empty array
  const window = useWindowDimensions();

  // Fetch images from AsyncStorage and initialize imagesList
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedImages = await AsyncStorage.getItem("images");
        if (storedImages) {
          const parsedImages = JSON.parse(storedImages);
          setImagesList([...images, ...parsedImages]); // Combine initial images with stored images
        } else {
          setImagesList([...images]); // Set only initial images if nothing stored
        }
      } catch (e) {
        console.warn("Error fetching images from storage", e);
      }
    };

    fetchData();
  }, []);

  // Add new images to the list and store them in AsyncStorage
  useEffect(() => {
    if (newImage) {
      const updatedImagesList = [...imagesList, newImage];
      setImagesList(updatedImagesList);
      storeData(updatedImagesList);
    }
  }, [newImage]);

  const storeData = async (images) => {
    try {
      const jsonValue = JSON.stringify(images);
      await AsyncStorage.setItem("images", jsonValue);
    } catch (e) {
      console.warn("Error saving images to storage", e);
    }
  };

  useEffect(() => {
    const fetchImageDimensions = async () => {
      const dimensions = await Promise.all(
        imagesList.map((uri) => {
          return new Promise((resolve) => {
            Image.getSize(
              uri,
              (width, height) => {
                resolve({ uri, width, height });
              },
              () => {
                resolve({ uri, width: 1, height: 1 });
              }
            );
          });
        })
      );
      const dimensionsMap = dimensions.reduce((acc, { uri, width, height }) => {
        acc[uri] = { width, height };
        return acc;
      }, {});
      setImageDimensions(dimensionsMap);
      distributeImages(dimensionsMap);
    };

    fetchImageDimensions();
  }, [imagesList]);

  useEffect(() => {
    distributeImages(imageDimensions);
  }, [window, imageDimensions]);

  const distributeImages = (dimensionsMap) => {
    const numColumns = calculateColumns();
    const columnsArr = Array.from({ length: numColumns }, () => []);

    imagesList.forEach((uri, index) => {
      const columnIndex = index % numColumns;
      columnsArr[columnIndex].push(uri);
    });

    setColumnsData(columnsArr);
  };

  const calculateColumns = () => {
    if (window.width > 1200) {
      return 4;
    } else if (window.width > 800) {
      return 3;
    } else {
      return 2;
    }
  };

  const removeStoredImages = async () => {
    try {
      await AsyncStorage.removeItem("images");
      setImagesList([...images]); // Reset to initial images
    } catch (e) {
      console.warn("Error removing images from storage", e);
    }
  };

  const renderScrambleItem = (uri) => {
    const { width, height } = imageDimensions[uri] || {};
    const aspectRatio = width && height ? width / height : 1;

    return (
      <View key={uri} style={styles.masonryItem}>
        <Image
          source={{ uri }}
          style={[styles.originalSizeImage, { aspectRatio }]}
        />
      </View>
    );
  };

  const renderImages = () => {
    switch (viewMode) {
      case "list":
        return (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {imagesList.map((uri, index) => (
              <View key={index} style={styles.listCard}>
                <ImageRenderer uri={uri} />
              </View>
            ))}
          </ScrollView>
        );
      case "scramble":
        return (
          <ScrollView contentContainerStyle={styles.masonryContainer}>
            {columnsData.map((column, colIndex) => (
              <View key={colIndex} style={styles.column}>
                {column.map(renderScrambleItem)}
              </View>
            ))}
          </ScrollView>
        );
      case "grid":
      default:
        return (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {imagesList.map((uri, index) => (
              <View key={index} style={styles.card}>
                <ImageRenderer uri={uri} />
              </View>
            ))}
          </ScrollView>
        );
    }
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        <Button title="Grid View" onPress={() => setViewMode("grid")} />
        <Button title="List View" onPress={() => setViewMode("list")} />
        <Button title="Scramble View" onPress={() => setViewMode("scramble")} />
      </View>
      <View style={styles.container}>{renderImages()}</View>

      <View style={styles.buttonContainer}>
        <Button title="Remove Stored Images" onPress={removeStoredImages} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 1,
  },
  scrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // padding: 5,
    paddingHorizontal: 9,
    marginVertical: 10,
  },
  card: {
    width: "45%",
    marginVertical: 10,
    marginHorizontal: 9,
    paddingHorizontal: 1,
    // padding: 10,
    // paddingHorizontal:3
  },
  listCard: {
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 9,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  masonryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // padding: 5,
    paddingHorizontal: 9,
    marginVertical: 10,

  },
  column: {
    flex: 1,
    padding: 8,
    // paddingVertical: 5,
  },
  masonryItem: {
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
    
   
  },
  originalSizeImage: {
    width: "100%",
    height: undefined,
  },
});
