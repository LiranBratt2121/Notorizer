import React, { useState } from "react";
import { View, Button, StyleSheet, ScrollView, Text } from "react-native";
import Camera from "@/components/common/Camera";
import { Apartment, Room } from "../../types/common/Household";
import * as FileSystem from "expo-file-system";
import { SvgXml } from "react-native-svg";
import base64 from 'react-native-base64';

const ChooseProperty = () => {
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [showCamera, setShowCamera] = useState(true);

  const apartment: Apartment = {
    addr: "123 Main St",
    city: "Springfield",
    state: "IL",
    landlord: "John Doe",
    tenant: "Jane Smith",
  };

  const room: Room = {
    name: "Living Room",
    side: 1,
  };

  const handleImageCaptured = async (filePath: string) => {
    const base64Image = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const svgString = base64.decode(base64Image);
    setCapturedImage(svgString);
    setShowCamera(false);
  };

  return (
    <View style={styles.container}>
      {showCamera ? (
        <Camera
          apartment={apartment}
          room={room}
          onImageCaptured={handleImageCaptured}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.imageContainer}>
          {capturedImage ? (
            <SvgXml xml={capturedImage} width="100%" height="300" />
          ) : (
            <Text>Loading...</Text>
          )}
          <Button title="Retake" onPress={() => setShowCamera(true)} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreview: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginTop: 10,
  },
});

export default ChooseProperty;
