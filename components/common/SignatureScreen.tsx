// @ts-nocheck
// Credit to https://stackoverflow.com/questions/49396883/how-can-i-do-signature-capture-in-react-native#:~:text=Signature%20component%20code
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import ExpoDraw from "expo-draw";
import { captureRef as takeSnapshotAsync } from "react-native-view-shot";
import { uploadBase64Image } from "@/utils/StorageUtils";
import uriToBase64 from "@/utils/UriToBase64";
import Button from "./Button";

interface SignatureScreenProps {
  handleSave: (path: string) => void;
}

const SignatureScreen = ({ handleSave }: SignatureScreenProps) => {
  const [strokes, setStrokes] = useState([]);
  const [loading, setLoading] = useState(false);
  const signatureRef = useRef(null);

  const clearCanvas = async () => {
    signatureRef.current.clear();
    setStrokes([]);
  };

  const saveCanvas = async () => {
    setLoading(true);
    try {
      const signature_result = await takeSnapshotAsync(signatureRef.current, {
        format: "png",
        quality: 0.5,
        result: "base64",
      });

      const downloadUrlToBase64 = await uploadBase64Image(signature_result);
      handleSave(downloadUrlToBase64);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Enter your signature here</Text>
      <View style={styles.canvasContainer}>
        <ExpoDraw
          strokes={strokes}
          ref={signatureRef}
          containerStyle={styles.canvas}
          color={"#000000"}
          strokeWidth={4}
          enabled={true}
          onChangeStrokes={(strokes) => setStrokes(strokes)}
        />
        <View style={styles.buttonsContainer}>
          <Button onPress={clearCanvas} title="Clear" />
          <View style={{ marginRight: 5 }}></View>
          <Button onPress={saveCanvas} title="Save" />
        </View>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={[styles.loadingIndicator, { zIndex: 10 }]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  canvasContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    backgroundColor: "rgba(0, 0, 0, 0.01)",
    height: 300,
    width: 500,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default SignatureScreen;
