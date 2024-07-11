import React from "react";
import { Image, StyleSheet, View } from "react-native";

const ImageRenderer = ({ uri }) => (
  <View style={styles.imageContainer}>
    <Image source={{ uri }} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 100,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default ImageRenderer;