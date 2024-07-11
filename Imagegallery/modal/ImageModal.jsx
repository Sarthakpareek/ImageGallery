import React, { useState } from "react";
import { Modal, View, Button, Text, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";

const ImageModal = ({ visible, onClose, onAddImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Add Image</Text>
          <Button
            title="Close"
            onPress={() => {
              setSelectedImage(null);
              onClose();
            }}
          />
        </View>
        <View style={styles.content}>
          <Button title="Select Image" onPress={pickImage} />
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}
        </View>
        <View style={styles.footer}>
          <Button
            title="Add Image"
            onPress={() => {
              dispatch({ type: "ADD_IMAGE", payload: selectedImage });
              onAddImage(selectedImage);
              setSelectedImage(null);
              onClose();
            }}
            disabled={!selectedImage}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  footer: {
    marginBottom: 20,
  },
});

export default ImageModal;
