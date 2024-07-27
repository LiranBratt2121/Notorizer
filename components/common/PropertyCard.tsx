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
      <Text style={styles.propertyText}>Property {property}</Text>
      <Image source={{ uri: imageUrl }} style={styles.propertyImage} />
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
    marginBottom: 8,
  },
  propertyImage: {
    width: 100,
    height: 100,
  },
});

export default PropertyCard;
