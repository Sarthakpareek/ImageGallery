import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image, Button } from "react-native";
import { Layout } from "@ui-kitten/components";
import MasonryList from "react-native-simple-masonry-list";
import images from "../utils/data";
import ImageRenderer from "../compoents/ImageRenderer";

export default function KittenGallery() {
  const [viewMode, setViewMode] = useState("grid");
  const [imageDimensions, setImageDimensions] = useState({});

  useEffect(() => {
    const fetchImageDimensions = async () => {
      const dimensions = await Promise.all(
        images.map((uri) => {
          return new Promise((resolve) => {
            Image.getSize(uri, (width, height) => {
              resolve({ uri, width, height });
            });
          });
        })
      );
      const dimensionsMap = dimensions.reduce((acc, { uri, width, height }) => {
        acc[uri] = { width, height };
        return acc;
      }, {});
      setImageDimensions(dimensionsMap);
    };

    fetchImageDimensions();
  }, []);
  const removeStoredImages = async () => {
    try {
      await AsyncStorage.removeItem("images");
      setImagesList([...images]); // Reset to initial images
    } catch (e) {
      console.warn("Error removing images from storage", e);
    }
  };
  const renderImages = () => {
    switch (viewMode) {
      case "list":
        return (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {images.map((uri, index) => (
              <View key={index} style={styles.listCard}>
                <ImageRenderer uri={uri} />
              </View>
            ))}
          </ScrollView>
        );
      case "scramble":
        return (
          <MasonryList
            data={images}
            numColumns={2}
            renderItem={({ item, index }) => {
              const { width, height } = imageDimensions[item] || {};
              const aspectRatio = width && height ? width / height : 1;
              return (
                <View key={index} style={styles.masonryItem}>
                  <Image
                    source={{ uri: item }}
                    style={[styles.originalSizeImage, { aspectRatio }]}
                  />
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        );
      case "grid":
      default:
        return (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {images.map((uri, index) => (
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
    justifyContent: "space-around",
    paddingTop: 10,
  },
  card: {
    width: "45%",
    marginVertical: 10,
  },
  listCard: {
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 7
  },
  masonryItem: {
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  originalSizeImage: {
    width: "100%",
    height: undefined,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
});