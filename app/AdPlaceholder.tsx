import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AdPlaceholderProps {
  onClose: () => void;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ onClose }) => {
  useEffect(() => {
    // Simulate ad duration
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ad Placeholder</Text>
      <Text style={styles.subText}>Your ad will appear here</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close Ad</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AdPlaceholder;