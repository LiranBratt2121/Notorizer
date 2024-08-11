import { Stack } from "expo-router";
import React from "react";

const TenantDashboardLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="TenantOTP"
        options={{
          headerTitle: "Tenant OTP login",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TenantLogin"
        options={{
          headerTitle: "Tenant Login",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TenantSignUp"
        options={{
          headerTitle: "Tenant Sign Up",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TenantUserAgreement"
        options={{
          headerTitle: "Tenant User Agreement",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TenantDashboard"
        options={{
          headerTitle: "Tenant Dashboard",
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default TenantDashboardLayout;
