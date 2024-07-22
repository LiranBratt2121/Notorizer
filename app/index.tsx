import { View } from "react-native";
import { router } from "expo-router";
import React from "react";

import Button from "../components/common/Button";

const Index = () => {
  return (
    <View>
      <Button onPress={() => router.push("/account/SignIn")} title="Sign In" />

      <Button onPress={() => router.push("/account/SignUp")} title="Sign Up" />
    </View>
  );
};

export default Index;
