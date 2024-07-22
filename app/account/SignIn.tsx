import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Platform, Alert } from "react-native";
import { router } from "expo-router";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

type SignInInfo = {
  username: string;
  password: string;
};

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<SignInInfo>({
    username: "",
    password: "",
  });

  const handleInputChange = (name: keyof SignInInfo, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.username || !formData.password) {
      if (Platform.OS === "web") {
        alert("Please fill in all fields");
      } else {
        Alert.alert("Error", "Please fill in all fields");
      }
      return;
    }
    
    router.replace('landlordDashboard/dashboard')

    if (Platform.OS === "web") {
      alert(`Signed In\nUsername: ${formData.username}`);
    } else {
      Alert.alert("Signed In", `Username: ${formData.username}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Username"
          onChangeText={(value) => handleInputChange("username", value)}
          value={formData.username}
        />
        <Input
          label="Password"
          secureTextEntry
          onChangeText={(value) => handleInputChange("password", value)}
          value={formData.password}
        />
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
