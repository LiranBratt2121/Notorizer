import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../firebaseConfig"
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

type SignInInfo = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<SignInInfo>({
    email: "",
    password: "",
  });

  const handleInputChange = (name: keyof SignInInfo, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Trying to sign in user: ', formData.email, formData.password)
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.replace('landlordDashboard/dashboard');
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
    { label: "Password", key: "password", secureTextEntry: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {inputFields.map((field) => (
          <Input
            key={field.key}
            label={field.label}
            secureTextEntry={field.secureTextEntry}
            onChangeText={(value) => handleInputChange(field.key as keyof SignInInfo, value)}
            value={formData[field.key as keyof SignInInfo]}
          />
        ))}
        <Button title="Sign In" onPress={handleSubmit} />
        <Button
          title="Sign In with Google"
          onPress={() => {
            /* Google Sign-In Logic */
          }}
        />
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

export default SignIn;
