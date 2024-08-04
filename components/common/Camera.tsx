import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraCapturedPicture, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";

type CameraProps = {
  source: string;
  onImageCaptured: (filePath: string) => void;
};

const Camera = ({ source, onImageCaptured }: CameraProps) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    let isMounted = true;

    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required for this feature.");
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        if (isMounted) {
          setLocation(currentLocation);
        }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert(
          "Location Error",
          "Failed to get location. Photos may be saved without location data."
        );
      }
    };

    getLocationPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
          exif: true,
        });

        if (!photo) throw new Error("Image is undefined");

        const waterMarkPhotoPath = await addWaterMark(photo, location);
        if (!waterMarkPhotoPath) throw new Error("WaterMark image is undefined");
        onImageCaptured(waterMarkPhotoPath);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to capture image. Please try again.");
      }
    }
  };

  const addWaterMark = async (
    img: CameraCapturedPicture,
    location: Location.LocationObject | null
  ) => {
    const exif = img?.exif;
    const cords = location?.coords;

    const svgMarkup = `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <rect width="100%" height="100%" fill="black" />
        <image href="${img.uri}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"/>
        <text x="10" y="75%" font-size="10" fill="white" font-family="Arial" font-weight="bold">OffsetTime: ${
          exif?.OffsetTimeOriginal || "N/A"
        }</text>
        <text x="10" y="85%" font-size="10" fill="white" font-family="Arial" font-weight="bold">Time&Date: ${
          exif?.DateTimeOriginal || "N/A"
        }</text>
        <text x="10" y="95%" font-size="10" fill="white" font-family="Arial" font-weight="bold">Location: ${
          cords ? `${cords.latitude}, ${cords.longitude}` : "N/A"
        }</text>
      </svg>
    `;

    const currentDate = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = `${FileSystem.documentDirectory}${source}_${currentDate}.svg`;
    await FileSystem.writeAsStringAsync(filePath, svgMarkup, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return filePath;
  };

  if (!cameraPermission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestCameraPermission} style={styles.permissionButton}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
            style={styles.flipButton}
          >
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  permissionButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  flipButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  captureButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
});

export default Camera;
