import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { findTenantByOTP } from "@/utils/FirebaseUtils";
import { useRouter } from "expo-router";

type TenantLoginOTPData = {
  nameByLandlord: string;
  otp: string;
  password?: string;
};

const TenantLogin = () => {
  const router = useRouter();
  const [data, setData] = useState<TenantLoginOTPData>({
    nameByLandlord: "",
    otp: "",
  });

  const handleOTPSubmit = async () => {
    const tenantInfo = await findTenantByOTP(data.nameByLandlord, data.otp);
    if (!tenantInfo) { 
      Alert.alert("Invalid OTP or provided name", "Please check your data and try again.");
      return;
    }

    router.replace({
      pathname: "/tenantDashboard/TenantSignUp" as any,
      params: { tenantInfo: JSON.stringify(tenantInfo)  },
    })
  };

  const handleInputChange = (name: keyof TenantLoginOTPData, value: string) => {
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const inputFields: { label: string; name: keyof TenantLoginOTPData }[] = [
    { label: "Name by tenant", name: "nameByLandlord" },
    { label: "OTP", name: "otp" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Hi, tenant!</Text>
        <Text style={styles.subtitle}>Enter your OTP and name Provided by the landlord to login</Text>
        {inputFields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            value={data[field.name]}
            onChangeText={(value) => handleInputChange(field.name, value)}
          />
        ))}
        <Button title="Login" onPress={handleOTPSubmit} />
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

export default TenantLogin;
