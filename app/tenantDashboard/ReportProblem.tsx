import {
  View,
  Text,
  Alert,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/common/Input";
import useCameraAndLocation from "@/hooks/useCameraAndLocation";
import { SvgXml } from "react-native-svg";
import Button from "@/components/common/Button";
import { useRouter } from "expo-router";
import { uploadSvgImage } from "@/utils/StorageUtils";
import { TenantProblem } from "@/types/common/Household";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/FirebaseConfig";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ReportProblem = () => {
  const [value, onChangeText] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const { svgMarkup, handleTakePicture } = useCameraAndLocation();
  const router = useRouter();

  const handlePress = async () => {
    if (!svgMarkup) {
      Alert.alert("Error", "Please take an image");
      return;
    }
  
    setLoading(true); // Show loader
    try {
      const imageURL = await uploadSvgImage(svgMarkup);
  
      const problem: TenantProblem = {
        description: value,
        imageURL,
      };
  
      const docName = auth.currentUser?.displayName || "";
      const tenantUserRef = doc(db, "tenantUser", docName);
      const tenantDoc = await getDoc(tenantUserRef);
  
      if (!tenantDoc.exists()) {
        Alert.alert("Error", "Tenant document does not exist");
        return;
      }
  
      const tenantData = tenantDoc.data();
      const existingProblems = tenantData?.tenantInfo?.problems || [];
  
      // Add the new problem to the existing problems array
      const updatedProblems = [...existingProblems, problem];
  
      // Update the document with the new array
      await updateDoc(tenantUserRef, {
        tenantInfo: {
          ...tenantData.tenantInfo,
          problems: updatedProblems,
        },
      });
  
      console.log("Problem added successfully", imageURL);
      Alert.alert("Success", "Problem added successfully");
  
      router.replace("/tenantDashboard/TenantDashboard");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to upload image or update problems: " + error
      );
      console.error(error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Report Problem</Text>
      <Input
        label="Explain Problem"
        value={value}
        onChangeText={(value) => onChangeText(value)}
      />
      <Button title="Take an Image" onPress={handleTakePicture} />
      {svgMarkup && (
        <View style={styles.imageContainer}>
          <SvgXml
            xml={svgMarkup}
            width={screenWidth * 0.9}
            height={screenHeight * 0.4}
          />
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <Button title="Send Data" onPress={handlePress} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    padding: 8,
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loader: {
    marginVertical: 16,
  },
});

export default ReportProblem;
