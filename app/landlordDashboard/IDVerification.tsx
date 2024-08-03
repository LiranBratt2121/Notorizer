import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Button,
  Image,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

type LocalSearchParams = {
  formData?: string;
  returnPath?: string;
};

type ImageData = {
  idImageString: string | null;
  ownershipImageString: string | null;
  houseImageString: string | null;
};

const IDVerification: React.FC = () => {
  const router = useRouter();
  const { formData, returnPath } = useLocalSearchParams<LocalSearchParams>();

  const [images, setImages] = useState<ImageData>({
    idImageString: null,
    ownershipImageString: null,
    houseImageString: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const takePicture = async (imageType: keyof ImageData) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Camera permission is required to take pictures");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages((prevImages) => ({
        ...prevImages,
        [imageType]: result.assets[0].base64 ?? null,
      }));
    }
  };

  const handleSend = () => {
    if (
      !images.idImageString ||
      !images.ownershipImageString ||
      !images.houseImageString
    ) {
      Alert.alert("Error", "Please capture ID, ownership, and house images");
      return;
    }

    setLoading(true);

    const verificationData = JSON.stringify(images);

    router.replace({
      pathname: returnPath || "",
      params: {
        formData,
        verificationData,
      },
    });

    setLoading(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Button
          title="Capture ID Image"
          onPress={() => takePicture("idImageString")}
        />
        {images.idImageString && (
          <Image
            source={{ uri: `data:image/png;base64,${images.idImageString}` }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Button
          title="Capture Ownership Image"
          onPress={() => takePicture("ownershipImageString")}
        />
        {images.ownershipImageString && (
          <Image
            source={{
              uri: `data:image/png;base64,${images.ownershipImageString}`,
            }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Button
          title="Capture House Image"
          onPress={() => takePicture("houseImageString")}
        />
        {images.houseImageString && (
          <Image
            source={{ uri: `data:image/png;base64,${images.houseImageString}` }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Button title="Send" onPress={handleSend} />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Returning...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default IDVerification;
