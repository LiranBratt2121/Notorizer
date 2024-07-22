import { Stack } from "expo-router";
import React from "react";

const LandlordDashboardLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          headerTitle: "Landlord Dashboard",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ChooseProperty"
        options={{
          headerTitle: "Choose Property",
        }}
      />
      <Stack.Screen
        name="PropertyDetails"
        options={{
          headerTitle: "Property Details",
        }}
      />
      <Stack.Screen
        name="SliderMenuScreen"
        options={{
          headerTitle: "Adjust Details",
        }}
      />
    </Stack>
  );
};

export default LandlordDashboardLayout;
