import { StyleSheet, SafeAreaView, View } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
type Tenant = {
  name: string;
  phoneNumber: string;
  email: string;
  FullAddr: string;
};

const AddTenant = () => {
  const router = useRouter();
  const [data, setData] = useState<Tenant>({
    name: "",
    phoneNumber: "",
    email: "",
    FullAddr: "",
  });

  const handleChanges = (key: string, value: string) => {
    setData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleSubmit = () => {
    router.replace({
      pathname: '/landlordDashboard/dashboard'
    })
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {["Tenant Name", "Phone Number", "Email", "Full Address"].map(
          (options) => (
            <Input label={options} key={options} onChangeText={(value) => handleChanges(options, value)} />
          )
        )}
        <Button title="Add tenant" onPress={handleSubmit}/>
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

export default AddTenant;
