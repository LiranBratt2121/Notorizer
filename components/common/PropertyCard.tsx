import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface PropertyCardProps {
  property: string;
  imageUrl: string;
  onPress: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, imageUrl, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.propertyText}>{property}</Text>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.propertyImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  propertyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  propertyImage: {
    width: 100,
    height: 100,
    marginTop: 8,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
});

export default PropertyCard;
