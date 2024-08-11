import { View } from "react-native";
import { router } from "expo-router";
import React from "react";

import Button from "../../components/common/Button";

const Index = () => {
  return (
    <View>
      <Button onPress={() => router.push("/landlordDashboard/ChooseProperty")} title="Choose Property" />

      <Button onPress={() => router.push("/landlordDashboard/PropertyDetails")} title="Property Details" />
    </View>
  );
};

export default Index;
