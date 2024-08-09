import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from '@/components/common/Button';
import { uploadBase64Image } from '@/utils/StorageUtils';

type SliderMenuParams = {
  title: string;
  optionKey: string;
  formData: string;
  returnPath: string;
};

type RoomData = {
  name: string;
  images: string[];
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
  const [items, setItems] = useState<RoomData[]>([]);
  const [currentFormData, setCurrentFormData] = useState<FormData>(parsedFormData);

  useEffect(() => {
    if (optionKey && currentFormData[optionKey as keyof FormData]) {
      const rooms = currentFormData[optionKey as keyof FormData];
      setItems(rooms);
      setSliderValue(rooms.length);
    }
  }, [optionKey, currentFormData]);

  const handleValueChange = (value: number) => {
    setSliderValue(value);
    setItems(Array.from({ length: value }, (_, i) => ({
      name: `${title} ${i + 1}`,
      images: [],
    })));
  };

  const handleItemChange = (index: number, name: string) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index].name = name;
      return newItems;
    });
  };

  const handleSave = () => {
    const invalidItems = items.some(item => item.name.trim() === '' || item.images.length === 0);

    if (invalidItems) {
      Alert.alert('Error', 'Please make sure each room has a name and at least one photo.');
      return;
    }

    Alert.alert('Data Saved', JSON.stringify(items));
    console.log('Saving items:', items, 'with optionKey:', optionKey);

    if (!optionKey) return;
    const updatedFormData = {
      ...currentFormData,
      [optionKey]: items,
    };
    setCurrentFormData(updatedFormData);

    if (returnPath) {
      router.replace({
        pathname: returnPath,
        params: { items: JSON.stringify(items), optionKey, updatedFormData: JSON.stringify(updatedFormData) },
      });
    } else {
      Alert.alert('Error', 'Return path is not defined');
    }
  };

  const pickImage = async (index: number) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.1,
      base64: true,
    });
    
    if (!result.canceled && result.assets?.length > 0) {
      const imageBase64 = result.assets[0].base64
      const UrlToBase64Image = await uploadBase64Image(imageBase64 ?? "")
  
      setItems((prevItems) => {
        const newItems = [...prevItems];
        newItems[index].images = [UrlToBase64Image ?? ''];
        return newItems;
      });
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
            placeholder={`Name of ${item.name}`}
            value={item.name}
            onChangeText={(text) => handleItemChange(index, text)}
          />
          <Button
            title={item.images.length > 0 ? 'Take Again' : 'Take Photo'}
            onPress={() => pickImage(index)}
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
    marginRight: 8,
  },
});

export default SliderMenu;
