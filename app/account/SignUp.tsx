import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, Alert, KeyboardTypeOptions, TextInputProps } from "react-native";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db, auth } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

type SignUpInfo = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  signature?: string;
  isAgreed?: string;
};

type LocalSearchParamsProps = {
  signature?: string;
  fullName?: string;
  isAgreed?: string;
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
};

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpInfo>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const { signature, fullName, isAgreed, email, password, name, confirmPassword } = useLocalSearchParams<LocalSearchParamsProps>();
  const router = useRouter();

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      email: email || prevState.email,
      name: name || prevState.name,
      password: password || prevState.password,
      confirmPassword: confirmPassword || prevState.confirmPassword,
      fullName: fullName || prevState.fullName,
      signature: signature || prevState.signature,
      isAgreed: isAgreed || prevState.isAgreed,
    }));
  }, [signature, fullName, isAgreed, email, password, name, confirmPassword]);

  const handleInputChange = (name: keyof SignUpInfo, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignatureButton = () => {
    router.push({
      pathname: "/account/SignUpUserAgreement",
      params: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      },
    });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCred) => {
        const user = userCred.user;
        updateProfile(user, { displayName: formData.name });
        return userCred;
      });

      const user = userCredential.user;

      const userDocRef = doc(db, "landlordUser", user.uid);
      const dataCollectionRef = collection(userDocRef, "data");

      await setDoc(doc(dataCollectionRef, "userInfo"), {
        email: formData.email,
        username: formData.name,
        signature: formData.signature,
        fullName: formData.fullName,
      });

      Alert.alert("Success", `User, ${formData.name} registered successfully`);
      router.push("/landlordDashboard/dashboard");
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
    { label: "Email", key: "email", secureTextEntry: false, keyboardType: "email-address", autoCapitalize: "none", hidden: false },
    { label: "User Name", key: "name", secureTextEntry: false, keyboardType: "default", autoCapitalize: "sentences", hidden: false },
    { label: "Password", key: "password", secureTextEntry: true, keyboardType: "default", autoCapitalize: "none", hidden: false },
    { label: "Confirm Password", key: "confirmPassword", secureTextEntry: true, keyboardType: "default", autoCapitalize: "none", hidden: false },
    { label: "Full Name", key: "fullName", secureTextEntry: false, keyboardType: "default", autoCapitalize: "sentences", hidden: true }, // Hidden field
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {inputFields.map((field) => (
          !field.hidden && (
            <Input
              key={field.key}
              label={field.label}
              secureTextEntry={field.secureTextEntry}
              keyboardType={field.keyboardType as KeyboardTypeOptions}
              autoCapitalize={field.autoCapitalize as TextInputProps["autoCapitalize"]}
              onChangeText={(value) =>
                handleInputChange(field.key as keyof SignUpInfo, value)
              }
              value={formData[field.key as keyof SignUpInfo] || ""}
            />
          )
        ))}
        <Button title="Sign User Agreement" onPress={handleSignatureButton} />
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
