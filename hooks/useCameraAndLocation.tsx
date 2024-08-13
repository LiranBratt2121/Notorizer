import { useEffect, useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const useCameraAndLocation = () => {
  const [svgMarkup, setSvgMarkup] = useState<string>('');

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Location permission is required to use this feature');
      console.error('Location permission is required to use this feature');
      return false;
    }
    return true;
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Camera permission is required to take pictures');
      console.error('Camera permission is required to take pictures');
      return false;
    }
    return true;
  };

  const handleTakePicture = async () => {
    const hasLocationPermission = await requestLocationPermission();
    const hasCameraPermission = await requestCameraPermission();

    if (!hasLocationPermission || !hasCameraPermission) return;

    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const addressData = address[0];
      const locationString = [
        addressData.country,
        addressData.city,
        addressData.street,
        addressData.streetNumber,
        addressData.postalCode,
      ].filter(Boolean).join(', ');

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.4,
        base64: true,
      });

      if (!result.assets || !result.assets[0].base64) {
        Alert.alert('Error', 'Failed to capture image');
        return;
      }

      const { base64: imageBase64, width: imageWidth, height: imageHeight } = result.assets[0];

      // Scale image to fit within screen width and height while maintaining aspect ratio
      const aspectRatio = imageWidth / imageHeight;
      let scaledWidth = Math.min(screenWidth, imageWidth);
      let scaledHeight = scaledWidth / aspectRatio;

      if (scaledHeight > screenHeight) {
        scaledWidth = Math.min(screenHeight * aspectRatio, imageWidth);
        scaledHeight = scaledWidth / aspectRatio;
      }

      // Adjust text size based on scaled image height
      const textSize = scaledHeight * 0.03;

      const svg = `
        <svg width="${scaledWidth}" height="${scaledHeight}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <image href="data:image/jpeg;base64,${imageBase64}" width="${scaledWidth}" height="${scaledHeight}" preserveAspectRatio="xMidYMid meet"/>
          <text x="${scaledWidth * 0.05}" y="${scaledHeight * 0.1}" font-size="${textSize}" fill="white" font-family="Arial" font-weight="bold" text-anchor="start">
            Location: ${locationString || 'N/A'}
          </text>
          <text x="${scaledWidth * 0.05}" y="${scaledHeight * 0.15}" font-size="${textSize}" fill="white" font-family="Arial" font-weight="bold" text-anchor="start">
            Time&amp;Date: ${new Date().toLocaleString() || 'N/A'}
          </text>
        </svg>
      `;
      
      setSvgMarkup(svg); // Set the SVG markup state
    } catch (error) {
      Alert.alert('Error', 'Failed to capture picture and location');
    }
  };

  return {
    svgMarkup,
    handleTakePicture,
  };
};

export default useCameraAndLocation;
