import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Alert, Platform } from "react-native";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

type SignUpInfo = {
  name: string;
  password: string;
  confirmPassword: string;
};

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpInfo>({
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

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      if (Platform.OS === "web") {
        alert("Passwords do not match");
      } else {
        Alert.alert("Error", "Passwords do not match");
      }
      return;
    }

    if (Platform.OS === "web") {
      alert(`Form Submitted!\n${formData.name}`);
    } else {
      Alert.alert("Form Submitted!", `${formData.name}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="User Name"
          onChangeText={(value) => handleInputChange("name", value)}
          value={formData.name}
        />
        <Input
          label="Password"
          secureTextEntry
          onChangeText={(value) => handleInputChange("password", value)}
          value={formData.password}
        />
        <Input
          label="Confirm Password"
          secureTextEntry
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
          value={formData.confirmPassword}
        />
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
