import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
import { doc, setDoc, collection } from "firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "../../components/common/Button";
import { db, auth } from "../../firebaseConfig";

type LocalSearchParams = {
  updatedFormData?: string;
  verificationData?: string;
};

type RoomData = {
  name: string;
  images: string[]; // This is now an array of URIs instead of base64 strings
};

type FormData = {
  bedrooms: RoomData[];
  bathrooms: RoomData[];
  kitchen: RoomData[];
  livingRooms: RoomData[];
  externalView: RoomData[];
  addRooms: RoomData[];
  addExternalSpace: RoomData[];
};

type Address = {
  state: string;
  city: string;
  street: string;
  houseNumber: string;
  apartmentEntry: string;
};

type LandlordVerificationData = {
  idImageUri: string | null;
  ownershipImageUri: string | null;
  houseImageUri: string | null;
};

const PropertyDetails: React.FC = () => {
  const router = useRouter();
  const [landlordVerificationData, setLandlordVerificationData] = useState<LandlordVerificationData>({
    idImageUri: null,
    ownershipImageUri: null,
    houseImageUri: null,
  });
  const [formData, setFormData] = useState<FormData>({
    bedrooms: [],
    bathrooms: [],
    kitchen: [],
    livingRooms: [],
    externalView: [],
    addRooms: [],
    addExternalSpace: [],
  });
  const [address, setAddress] = useState<Address>({
    state: "",
    city: "",
    street: "",
    houseNumber: "",
    apartmentEntry: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { updatedFormData, verificationData } = useLocalSearchParams<LocalSearchParams>();

  useEffect(() => {
    console.log("Received data:", { updatedFormData, verificationData });
    if (updatedFormData) {
      setFormData(JSON.parse(updatedFormData));
    }
    if (verificationData) {
      setLandlordVerificationData(JSON.parse(verificationData));
    }
  }, [updatedFormData, verificationData]);

  const handleButtonPress = (title: string, optionKey: string) => {
    router.push({
      pathname: "landlordDashboard/SliderMenuScreen",
      params: {
        title,
        optionKey,
        formData: JSON.stringify(formData),
        returnPath: "landlordDashboard/PropertyDetails",
      },
    });
  };

  const handleVerifyPress = () => {
    router.push({
      pathname: "landlordDashboard/IDVerification",
      params: {
        formData: JSON.stringify(formData),
        returnPath: "landlordDashboard/PropertyDetails",
      },
    });
  };

  const handleSubmit = async () => {
    if (Object.values(address).some((value) => value === "")) {
      Alert.alert("Error", "Please fill in all address fields");
      return;
    }

    console.log("Verification data:", landlordVerificationData);

    if (
      !landlordVerificationData.idImageUri ||
      !landlordVerificationData.ownershipImageUri ||
      !landlordVerificationData.houseImageUri
    ) {
      Alert.alert("Error", "Please provide ID, ownership, and house images");
      return;
    }

    setLoading(true);

    const formattedAddress = `${address.state}|${address.city}|${address.street}|${address.houseNumber}|${address.apartmentEntry}`;

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User is not authenticated");
      setLoading(false);
      return;
    }

    const landlordId = user.uid;

    try {
      const propertyCollectionRef = collection(
        doc(db, "landlordUser", landlordId),
        "property"
      );

      console.log("Saving data to Firestore")
      console.log(formData)
      await setDoc(doc(propertyCollectionRef, formattedAddress), {
        ...formData,
        landlordVerificationData: {
          idImageUri: landlordVerificationData.idImageUri,
          ownershipImageUri: landlordVerificationData.ownershipImageUri,
          houseImageUri: landlordVerificationData.houseImageUri,
        },
      });

      Alert.alert("Success", "Property details saved successfully");
      router.push("landlordDashboard/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
        console.error(error);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

  const addressFields = [
    { key: "state", placeholder: "State", keyboardType: "default" },
    { key: "city", placeholder: "City", keyboardType: "default" },
    { key: "street", placeholder: "Street", keyboardType: "default" },
    { key: "houseNumber", placeholder: "House Number", keyboardType: "numeric" },
    { key: "apartmentEntry", placeholder: "Apartment Entry", keyboardType: "numeric" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          {[
            "bedrooms",
            "bathrooms",
            "kitchen",
            "livingRooms",
            "externalView",
            "addRooms",
            "addExternalSpace",
          ].map((option) => (
            <Button
              key={option}
              title={option}
              onPress={() => handleButtonPress(option, option)}
            />
          ))}
          <Button title="Verify" onPress={handleVerifyPress} />
          <View style={styles.addressContainer}>
            {addressFields.map((field) => (
              <TextInput
                key={field.key}
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#808080"
                value={address[field.key as keyof Address]}
                onChangeText={(value) =>
                  handleAddressChange(field.key as keyof Address, value)
                }
                keyboardType={field.keyboardType as any}
              />
            ))}
          </View>
          <Button title="Save Data" onPress={handleSubmit} />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>Saving data...</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  addressContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 3,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default PropertyDetails;