// PropertyDetails.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import Button from '../../components/common/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';

type LocalSearchParams = {
  items?: string;
  optionKey?: string;
  updatedFormData?: string;
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

const PropertyDetails: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    bedrooms: [],
    bathrooms: [],
    kitchen: [],
    livingRooms: [],
    externalView: [],
    addRooms: [],
    addExternalSpace: [],
  });

  const { items, optionKey, updatedFormData } = useLocalSearchParams<LocalSearchParams>();

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
    // console.log('Items', items);
    // console.log('OptionKey', optionKey);
    // console.log('FormData', formData);
  }, [formData]);

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
});

export default PropertyDetails;
