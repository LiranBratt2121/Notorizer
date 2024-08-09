import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Button from "../../components/common/Button";

type LocalSearchParams = {
  formData?: string;
  returnPath?: string;
};

type ImageData = {
  idImageBase64: string | null;
  ownershipImageBase64: string | null;
  houseImageBase64: string | null;
};

const imageTypes: { key: keyof ImageData; title: string }[] = [
  { key: "idImageBase64", title: "ID" },
  { key: "ownershipImageBase64", title: "Ownership" },
  { key: "houseImageBase64", title: "House" },
];

const IDVerification: React.FC = () => {
  const router = useRouter();
  const { formData, returnPath } = useLocalSearchParams<LocalSearchParams>();

  const [images, setImages] = useState<ImageData>({
    idImageBase64: null,
    ownershipImageBase64: null,
    houseImageBase64: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const takePicture = async (imageType: keyof ImageData) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Camera permission is required to take pictures");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.1,
      base64: true,
    });


    if (result.assets) {
      const imageBase64 = result.assets[0].base64;
      setImages((prevImages) => ({
        ...prevImages,
        [imageType]: imageBase64 ?? null,
      }));
    }
  };

  const handleSend = () => {
    if (Object.values(images).some((image) => !image)) {
      Alert.alert("Error", "Please capture all required images");
      return;
    }

    setLoading(true);

    router.replace({
      pathname: returnPath || "",
      params: {
        updatedFormData: formData,
        verificationData: JSON.stringify(images)
      },
    });

    setLoading(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {imageTypes.map(({ key, title }) => (
          <View key={key}>
            <Button
              title={`Capture ${title} Image`}
              onPress={() => takePicture(key)}
            />
            {images[key] && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${images[key]}` }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
        ))}
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
