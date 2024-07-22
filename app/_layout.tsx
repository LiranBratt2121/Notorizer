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
      <Stack.Screen name="account/SignIn" options={{
        headerTitle: "Sign In"
      }} />
      <Stack.Screen name="account/SignUp" options={{
        headerTitle: "Sign Up"
      }}/>
    </Stack>
  );
};

export default RootLayout;
