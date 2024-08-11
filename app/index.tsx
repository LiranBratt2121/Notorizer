//@ts-nocheck
import { View } from "react-native";
import { router } from "expo-router";
import React from "react";

import Button from "../components/common/Button";

const Index = () => {
  return (
    <View>
      <Button onPress={() => router.push("/account/SignIn")} title="Sign In Landlord" />
      <Button onPress={() => router.push("/account/SignUp")} title="Sign Up Landlord" />
      <Button onPress={() => router.push("/tenantDashboard/TenantOTP")} title="Apply OTP Tenant" />
      <Button onPress={() => router.push("/tenantDashboard/TenantLogin")} title="Sign In Tenant" />
    </View>
  );
};

export default Index;
