import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Header = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.headerButton}>
      <Text style={styles.headerButtonText}>Add Image</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 10,
  },
  headerButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default Header;