import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image,Button } from "react-native";
// import { Button } from "react-native-paper";
import MasonryList from "react-native-simple-masonry-list";
import images from "../utils/data";
import ImageRenderer from "../compoents/ImageRenderer";

export default function PaperGallery() {
  const [viewMode, setViewMode] = useState("grid");
  const [imageDimensions, setImageDimensions] = useState();

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
    paddingVertical: 10,
  },
  card: {
    width: "45%",
    marginVertical: 10,
  },
  listCard: {
    width: "100%",
    marginVertical: 10,
  },
  scrambleCardLandscape: {
    width: "60%",
    marginVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  scrambleCardPortrait: {
    width: "30%",
    marginVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  originalSizeImage: {
    width: "100%",
    height: undefined,
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