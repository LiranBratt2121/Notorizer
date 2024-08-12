import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/common/Input";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/common/Button";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/firebase/FirebaseConfig";
import { Tenant } from "@/types/common/Household";
import { doc, updateDoc } from "firebase/firestore";

type FormData = {
  [key: string]: string;
  password: string;
  confirmPassword: string;
};

const TenantSignUp = () => {
  const router = useRouter();
  const { tenantInfo } = useLocalSearchParams();
  const parsedTenantInfo: Tenant["tenantInfo"] = JSON.parse(tenantInfo as string);

  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async () => {
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    console.log(parsedTenantInfo)
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        `${parsedTenantInfo.number}@notorizer.com`,
        password
      )

      await updateProfile(user.user, { displayName: parsedTenantInfo.name });

      user.user.displayName
      const userDocRef = doc(db, "tenantUser", parsedTenantInfo.name);
      await updateDoc(userDocRef, {
        tenantInfo: {
          ...parsedTenantInfo,
          password: password,
        },
      });
      router.replace({
        pathname: "/tenantDashboard/TenantUserAgreement" as any,
        params: {
          tenantInfo: JSON.stringify(parsedTenantInfo),
        },
      });
      Alert.alert("Success", "Password updated successfully!");
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while updating the password: " + error
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Add password</Text>
        {["password", "confirmPassword"].map((field, index) => (
          <Input
            key={index}
            label={
              field.charAt(0).toUpperCase() +
              field
                .slice(1)
                .replace(/([A-Z])/g, " $1")
                .trim()
            }
            value={formData[field]}
            onChangeText={(text) => handleChange(field, text)}
            secureTextEntry
          />
        ))}
        <Button title="Save Account Password" onPress={handleSignUp} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
});

export default TenantSignUp;
