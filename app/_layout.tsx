import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Landing Page",
        }}
      />
      <Stack.Screen
        name="account/SignIn"
        options={{
          headerTitle: "Sign In",
        }}
      />
      <Stack.Screen
        name="account/SignUp"
        options={{
          headerTitle: "Sign Up",
        }}
      />
      <Stack.Screen
        name="account/SignUpUserAgreement"
        options={{
          headerTitle: "User Agreement",
        }}
      />
      <Stack.Screen
        name="landlordDashboard"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="tenantDashboard"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
