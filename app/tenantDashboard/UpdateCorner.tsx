import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Data, Tenant, TenantHouseImages, Corner, RoomData } from '@/types/common/Household';
import { findPropertyDataByTenantInfo, findTenantByName } from '@/utils/FirebaseUtils';
import { auth, db } from '@/firebase/FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { uploadBase64Image } from '@/utils/StorageUtils';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import encodePath from '@/utils/EncodeFireBaseStorageURL';

const UpdateCorner = () => {
  const [tenantInfo, setTenantInfo] = useState<Tenant["tenantInfo"] | null>(null);
  const [propertyData, setPropertyData] = useState<Data | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const tenantName = auth.currentUser?.displayName ?? "No name";
        const result = await findTenantByName(tenantName);
        setTenantInfo(result?.tenantInfo ?? null);

        if (result?.tenantInfo) {
          const propData = await findPropertyDataByTenantInfo(result.tenantInfo);
          setPropertyData(propData ?? null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageCapture = async (roomType: string) => {
    setLoadingStates(prev => ({ ...prev, [roomType]: true }));
  
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Camera permission is required to take pictures');
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.4,
        base64: true,
      });
  
      if (!result.assets || !result.assets[0].base64) {
        Alert.alert('Error', 'Failed to capture image');
        return;
      }
  
      const imageBase64 = result.assets[0].base64;
      const imageURL = await uploadBase64Image(imageBase64);
      console.log('Uploaded image URL:', imageURL);
  
      const tenantDocRef = doc(db, "tenantUser", auth.currentUser?.displayName ?? "");
      const docSnap = await getDoc(tenantDocRef);
  
      const currentDateTime = new Date().toLocaleString();
  
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        // Create a deep copy of the entire tenantInfo object
        const updatedTenantInfo = JSON.parse(JSON.stringify(currentData.tenantInfo || {}));
  
        // Ensure houseImages exists
        if (!updatedTenantInfo.houseImages) {
          updatedTenantInfo.houseImages = {};
        }
  
        // Update or create the specific room type
        if (!updatedTenantInfo.houseImages[roomType]) {
          updatedTenantInfo.houseImages[roomType] = [];
        }
  
        updatedTenantInfo.houseImages[roomType].push({
          side: updatedTenantInfo.houseImages[roomType].length + 1,
          RoomData: {
            images: [imageURL],
            name: roomType,
          },
          dateTime: currentDateTime,
        });
  
        // Update only the tenantInfo field, preserving all other document fields
        await updateDoc(tenantDocRef, { tenantInfo: updatedTenantInfo });
      } else {
        // If the document doesn't exist, create it with initial tenantInfo
        const newTenantInfo = {
          houseImages: {
            [roomType]: [{
              side: 1,
              RoomData: {
                images: [imageURL],
                name: roomType,
              },
              dateTime: currentDateTime,
            }],
          },
        };
  
        await setDoc(tenantDocRef, { tenantInfo: newTenantInfo });
      }
  
      Alert.alert("Success", "Image captured and saved successfully!");
      setCapturedImages(prev => ({ ...prev, [roomType]: imageURL }));
    } catch (error) {
      console.error("Error capturing and saving image:", error);
      Alert.alert("Error", "Failed to capture and save image");
    } finally {
      setLoadingStates(prev => ({ ...prev, [roomType]: false }));
    }
  };
  
  const renderPropertyData = (data: Data) => {
    return Object.entries(data).map(([key, value]) => {
      if (Array.isArray(value)) {
        return renderRoomType(key, value);
      }
      return null;
    });
  };

  const renderRoomType = (key: string, roomData: RoomData[]) => (
    <View key={key} style={styles.section}>
      <Text style={styles.sectionHeader}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
      {roomData.map((room, index) => (
        <View key={index} style={styles.roomContainer}>
          <Text style={styles.roomName}>{room.name || `Room ${index + 1}`}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {renderRoomImages(room)}
          </ScrollView>
        </View>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleImageCapture(key)}
        disabled={loadingStates[key]}
      >
        <Text style={styles.buttonText}>
          {loadingStates[key] ? 'Capturing...' : `Capture ${key}`}
        </Text>
      </TouchableOpacity>
      {loadingStates[key] && (
        <ActivityIndicator style={styles.activityIndicator} size="small" color="#007bff" />
      )}
      {capturedImages[key] && (
        <Image source={{ uri: encodePath(capturedImages[key]) }} style={styles.capturedImage} />
      )}
    </View>
  );

  const renderRoomImages = (roomData: RoomData) => {
    if (!roomData.images || !Array.isArray(roomData.images)) {
      console.warn("Invalid roomData.images:", roomData.images);
      return null;
    }
    return roomData.images.map((imageUrl, index) => (
      <Image key={index} source={{ uri: encodePath(imageUrl) }} style={styles.roomImage} />
    ));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Update Corner</Text>
        {propertyData && renderPropertyData(propertyData)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  roomContainer: {
    marginBottom: 16,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#444',
  },
  imageScroll: {
    flexGrow: 0,
    marginBottom: 15,
  },
  roomImage: {
    width: Dimensions.get('window').width * 0.6,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginRight: 8,
  },
  activityIndicator: {
    marginTop: 10,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginTop: 10,
  },
  tenantInfoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default UpdateCorner;