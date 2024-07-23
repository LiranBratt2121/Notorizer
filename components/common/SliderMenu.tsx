import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from './Button';

type SliderMenuParams = {
  title: string;
  optionKey: string;
  formData: string;
  returnPath: string;
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

const SliderMenu: React.FC = () => {
  const router = useRouter();
  const { title, optionKey, formData, returnPath } = useLocalSearchParams<SliderMenuParams>();
  const parsedFormData: FormData = formData ? JSON.parse(formData) : {
    bedrooms: [],
    bathrooms: [],
    kitchen: [],
    livingRooms: [],
    externalView: [],
    addRooms: [],
    addExternalSpace: [],
  };

  const [sliderValue, setSliderValue] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [currentFormData, setCurrentFormData] = useState<FormData>(parsedFormData);

  useEffect(() => {
    if (optionKey && currentFormData[optionKey as keyof FormData]) {
      setItems(currentFormData[optionKey as keyof FormData]);
      setSliderValue(currentFormData[optionKey as keyof FormData].length);
    }
  }, [optionKey, currentFormData]);

  const handleValueChange = (value: number) => {
    setSliderValue(value);
    setItems(Array.from({ length: value }, (_, i) => `${title} ${i + 1}`));
  };

  const handleItemChange = (index: number, name: string) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = name;
      return newItems;
    });
  };

  const handleSave = () => {
    Alert.alert('Data Saved', JSON.stringify(items));
    console.log('Saving items:', items, 'with optionKey:', optionKey);

    if (!optionKey) return
    const updatedFormData = {
      ...currentFormData,
      [optionKey]: items,
    };

    if (returnPath) {
      router.replace({
        pathname: returnPath,
        params: { items: JSON.stringify(items), optionKey, updatedFormData: JSON.stringify(updatedFormData) },
      });
    } else {
      Alert.alert('Error', 'Return path is not defined');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={sliderValue}
        onValueChange={handleValueChange}
      />
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <TextInput
            style={styles.input}
            placeholder={`Name of ${item}`}
            value={item}
            onChangeText={(text) => handleItemChange(index, text)}
          />
        </View>
      ))}
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
});

export default SliderMenu;
