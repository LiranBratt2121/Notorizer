import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/FirebaseConfig";
import { Tenant } from "@/types/common/Household";
import SendSMS, { generateOTP } from "@/utils/SendSms";
import { findDocumentIdByName } from "@/utils/FirebaseUtils";

const AddTenant = () => {
  const router = useRouter();
  const { houseAddr }: { houseAddr: string } = useLocalSearchParams();
  const [landlordName, setLandlordName] = useState<string>("Landlord");
  const [data, setData] = useState<Tenant>({
    name: "",
    phoneNumber: "",
  });

  useEffect(() => {
    console.log(houseAddr);
    const fetchLandlordName = async () => {
      try {
        const docSnap = await getDoc(
          doc(
            db,
            "landlordUser",
            auth.currentUser?.uid ?? "",
            "data",
            "userInfo"
          )
        );
        if (docSnap.exists()) {
          setLandlordName(docSnap.data().username);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchLandlordName();
  }, []);

  const inviteMessage = useMemo(
    () =>
      `Hi! ${landlordName}, your landlord sent you an invitation to notorizer!\n
this is your OTP **${generateOTP()}**\nuse it when logging in as a tenant!`,
    [landlordName]
  );

  const handleChanges = (key: string, value: string) => {
    const keyMap: { [label: string]: keyof Tenant } = {
      "Tenant Name": "name",
      "Phone Number": "phoneNumber",
    };

    const mappedKey = keyMap[key];
    if (mappedKey) {
      setData((prevData) => ({ ...prevData, [mappedKey]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!Object.values(data).every((value) => value)) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await SendSMS(data.phoneNumber, inviteMessage);
      const collectionPath = `landlordUser/${auth.currentUser?.uid}/property`;
      const id =
        (await findDocumentIdByName(collectionPath, houseAddr.trim())) ?? "";
      if (!id) {
        alert("Address not found. Please check the address format.");
        return;
      }

      const tenantInfo = { name: data.name, number: data.phoneNumber };

      await updateDoc(
        doc(db, "landlordUser", auth.currentUser?.uid ?? "", "property", id), {tenantInfo}
      );
      router.replace({
        pathname: "/landlordDashboard/dashboard",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {["Tenant Name", "Phone Number"].map((options) => (
          <Input
            label={options}
            key={options}
            onChangeText={(value) => handleChanges(options, value)}
          />
        ))}
        <Button title="Add tenant" onPress={handleSubmit} />
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
