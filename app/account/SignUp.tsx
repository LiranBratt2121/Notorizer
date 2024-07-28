import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Alert } from "react-native";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { router } from "expo-router";
import { db, auth } from "../../firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

type SignUpInfo = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpInfo>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (name: keyof SignUpInfo, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
  
    try {
      console.log("Trying to SignUp user", formData);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      const userDocRef = doc(db, "landlordUser", user.uid);
      const dataCollectionRef = collection(userDocRef, "data");
      collection(userDocRef, "property");
  
      await setDoc(doc(dataCollectionRef, "userInfo"), {
        email: formData.email,
        username: formData.name,
      });
  
      Alert.alert("Success", `User, ${formData.name} registered successfully`);
      router.push("landlordDashboard/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
        console.error(error);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    }
  };

  const inputFields = [
    { label: "Email", key: "email", secureTextEntry: false },
    { label: "User Name", key: "name", secureTextEntry: false },
    { label: "Password", key: "password", secureTextEntry: true },
    { label: "Confirm Password", key: "confirmPassword", secureTextEntry: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {inputFields.map((field) => (
          <Input
            key={field.key}
            label={field.label}
            secureTextEntry={field.secureTextEntry}
            onChangeText={(value) => handleInputChange(field.key as keyof SignUpInfo, value)}
            value={formData[field.key as keyof SignUpInfo]}
          />
        ))}
        <Button title="Submit" onPress={handleSubmit} />
        <Button title="Sign Up with Google" onPress={() => { /* Google Sign-Up Logic */ }} />
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
});

export default SignUp;
