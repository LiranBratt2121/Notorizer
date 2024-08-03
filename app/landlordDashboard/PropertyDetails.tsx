import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, TextInput, ActivityIndicator, Text } from 'react-native';
import Button from '../../components/common/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, setDoc, collection } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";

type LocalSearchParams = {
  items?: string;
  optionKey?: string;
  updatedFormData?: string;
  verificationData?: string;
};

type FormData = {
  bedrooms: string[];
  bathrooms: string[];
  kitchen: string[];
  livingRooms: string[];
  externalView: string[];
  addRooms: string[];
  addExternalSpace: string[];
};

type Address = {
  state: string;
  city: string;
  street: string;
  houseNumber: string;
  apartmentEntry: string;
};

type LandlordVerificationData = {
  idImageString: string | null;
  ownershipImageString: string | null;
  houseImageString: string | null;
};

const PropertyDetails: React.FC = () => {
  const router = useRouter();
  const [landlordVerificationData, setLandlordVerificationData] = useState<LandlordVerificationData>({
    idImageString: null,
    ownershipImageString: null,
    houseImageString: null,
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
    state: '',
    city: '',
    street: '',
    houseNumber: '',
    apartmentEntry: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { items, optionKey, updatedFormData, verificationData } = useLocalSearchParams<LocalSearchParams>();

  useEffect(() => {
    if (updatedFormData) {
      setFormData(JSON.parse(updatedFormData));
    } else if (optionKey && items) {
      const parsedItems = JSON.parse(items);
      setFormData((prevData) => ({
        ...prevData,
        [optionKey]: [...(prevData[optionKey as keyof FormData] || []), ...parsedItems],
      }));
    }
  }, [items, optionKey, updatedFormData]);

  useEffect(() => {
    if (verificationData) {
      setLandlordVerificationData(JSON.parse(verificationData));
    }
  }, [verificationData]);

  useEffect(() => {
    console.log('Items', items);
    console.log('OptionKey', optionKey);
    console.log('FormData', formData);
    console.log('LandlordVerificationData', landlordVerificationData);
  }, [formData, landlordVerificationData]);

  const handleButtonPress = (title: string, optionKey: string) => {
    router.replace({
      pathname: 'landlordDashboard/SliderMenuScreen',
      params: {
        title,
        optionKey,
        formData: JSON.stringify(formData),
        returnPath: 'landlordDashboard/PropertyDetails',
      },
    });
  };

  const handleVerifyPress = () => {
    router.replace({
      pathname: 'landlordDashboard/IDVerification',
      params: { 
        formData: JSON.stringify(formData),
        verificationData: JSON.stringify(landlordVerificationData),
        returnPath: 'landlordDashboard/PropertyDetails',
      }, 
    });
  }

  const handleSubmit = async () => {
    if (Object.values(address).some(value => value === '')) {
      Alert.alert("Error", "Please fill in all address fields");
      return;
    }

    if (!landlordVerificationData.idImageString || !landlordVerificationData.ownershipImageString || !landlordVerificationData.houseImageString) {
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
      const propertyCollectionRef = collection(doc(db, "landlordUser", landlordId), "property");
      await setDoc(doc(propertyCollectionRef, formattedAddress), {
        ...formData,
        landlordVerificationData,
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
      [field]: value
    }));
  };

  const addressFields = [
    { key: 'state', placeholder: 'State', keyboardType: 'default' },
    { key: 'city', placeholder: 'City', keyboardType: 'default' },
    { key: 'street', placeholder: 'Street', keyboardType: 'default' },
    { key: 'houseNumber', placeholder: 'House Number', keyboardType: 'numeric' },
    { key: 'apartmentEntry', placeholder: 'Apartment Entry', keyboardType: 'numeric' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {[
          'bedrooms',
          'bathrooms',
          'kitchen',
          'livingRooms',
          'externalView',
          'addRooms',
          'addExternalSpace',
        ].map((option) => (
          <Button key={option} title={option} onPress={() => handleButtonPress(option, option)} />
        ))}
        <Button title='Verify' onPress={handleVerifyPress}/>
        <View style={styles.addressContainer}>
          {addressFields.map((field) => (
            <TextInput
              key={field.key}
              style={styles.input}
              placeholder={field.placeholder}
              value={address[field.key as keyof Address] || ''}
              onChangeText={(value) => handleAddressChange(field.key as keyof Address, value)}
              keyboardType={field.keyboardType as any}
            />
          ))}
        </View>
        <Button title='Save Data' onPress={handleSubmit}/>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Saving data...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default PropertyDetails;
