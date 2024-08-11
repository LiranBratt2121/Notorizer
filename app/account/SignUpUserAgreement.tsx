import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import { useRouter, useLocalSearchParams } from "expo-router";
import SignatureScreen from "@/components/common/SignatureScreen";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

type LocalSearchParams = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const SignUpUserAgreement = () => {
  const router = useRouter();
  const { name, email, password, confirmPassword }: LocalSearchParams = useLocalSearchParams();
  const [fullName, setFullName] = useState<string>(name ?? "");
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignatureScreen, setShowSignatureScreen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    if (signature) {
      router.replace({
        pathname: "/account/SignUp",
        params: { signature, fullName, isAgreed: isAgreed.toString(), email, password, name, confirmPassword },
      });
    }
  }, [signature]);

  const handleSave = (path: string) => {
    if (path.length == 0){
      alert("Please sign the agreement");
      return;
    }
    setSignature(path);
    setShowSignatureScreen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>User Agreement</Text>
        <Text style={styles.agreementText}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet maiores
          perspiciatis quam error nemo quasi odit ipsum ullam aliquam quod
          reprehenderit tempore cumque unde, optio sit inventore aspernatur enim
          minus voluptatibus quaerat cupiditate corporis quibusdam corrupti?
          Ducimus aperiam qui, iusto asperiores ex deserunt. Provident ut
          ducimus quasi iure sed? Porro tempore earum excepturi fuga asperiores,
          libero sunt nobis beatae temporibus, ipsa hic esse eius ab, fugit
          dolor repellendus consequatur aut in fugiat corrupti. Fugit, sed eum
          consequuntur soluta sequi, laborum neque ratione esse placeat
          molestias, accusantium laboriosam dolores odio unde? Libero possimus
          dolore laboriosam nihil id eum assumenda necessitatibus. Eaque, magnam
          blanditiis? Quia recusandae autem, repellat voluptatibus aut impedit
          ipsam sit ducimus nam rem architecto nemo nisi eligendi temporibus
          maxime, itaque reprehenderit neque est praesentium cumque debitis
          veniam dicta corporis porro? Fugiat, distinctio corrupti? Quasi
          cupiditate quibusdam aliquam totam. In molestias temporibus error
          quibusdam. Sint nihil error necessitatibus voluptatum alias.
        </Text>
        <View style={styles.agreementContainer}>
          <Checkbox
            value={isAgreed}
            onValueChange={setIsAgreed}
            style={styles.checkbox}
          />
          <Pressable onPress={() => setIsAgreed(!isAgreed)}>
            <Text style={styles.checkboxLabel}>I accept the terms and conditions</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Input
        label="Legal Full Name"
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <Button
        title={isAgreed ? "Set Signature" : "Accept Terms to Continue"}
        onPress={() => setShowSignatureScreen(!showSignatureScreen)}
        disabled={!isAgreed}
        style={[
          styles.button,
          isAgreed ? styles.buttonEnabled : styles.buttonDisabled,
        ]}
      />
      {showSignatureScreen && (
        <View style={styles.signatureScreenContainer}>
          <SignatureScreen handleSave={handleSave} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  agreementText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "justify",
    fontWeight: "semibold",
    padding: 20
  },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  checkbox: {
    marginLeft: 15,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonEnabled: {
    backgroundColor: "green",
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  signatureScreenContainer: {
    height: 400,
    marginTop: 20,
  },
});

export default SignUpUserAgreement;
