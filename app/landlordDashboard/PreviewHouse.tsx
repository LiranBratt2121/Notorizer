import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TextInput, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Property, Data, RoomData, Tenant } from "@/types/common/Household";
import encodePath, { encodeLandlordVerificationData } from "@/utils/EncodeFireBaseStorageURL";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/FirebaseConfig";
import Button from "@/components/common/Button";
import { PropetryDetailsFirebaseType } from "@/types/PropertyDetailsTypes";
import { findTenantByName } from "@/utils/FirebaseUtils";
import RenderProblems from "@/components/RenderProblems";

const windowWidth = Dimensions.get("window").width;

const PreviewHouse: React.FC = () => {
  const { propertyString } = useLocalSearchParams();
  const [property, setProperty] = useState<Property>(JSON.parse(propertyString as string));
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const urls = encodeLandlordVerificationData(property);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const tenantName = property.data?.tenantInfo?.tenantInfo.name ?? "";
        if (tenantName) {
          const tenantData = await findTenantByName(tenantName);
          if (tenantData) {
            setTenant(tenantData);
          } else {
            Alert.alert("No tenant found");
          }
        }
      } catch (e) {
        Alert.alert("Error: " + e);
      }
    };

    fetchTenantData();
  }, [property.data?.tenantInfo?.tenantInfo.name]);

  const images = [
    { key: "houseImage", url: urls.houseImageUrl, title: "House" },
    { key: "idImage", url: urls.idImageUrl, title: "ID" },
    { key: "ownershipImage", url: urls.ownershipImageUrl, title: "Ownership" },
  ];

  const houseInfo: Array<{ key: string; value: RoomData | string }> = [
    { key: "address", value: property.address },
    { key: "livingRooms", value: property.data?.livingRooms ?? "N/A" },
    { key: "bedrooms", value: property.data?.bedrooms ?? "N/A" },
    { key: "kitchen", value: property.data?.kitchen ?? "N/A" },
    { key: "bathrooms", value: property.data?.bathrooms ?? "N/A" },
    { key: "externalView", value: property.data?.externalView ?? "N/A" },
    { key: "addRooms", value: property.data?.addRooms ?? "N/A" },
    { key: "addExternalSpace", value: property.data?.addExternalSpace ?? "N/A" },
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User is not authenticated");
      setIsLoading(false);
      return;
    }

    const landlordId = user.uid;
    const propertyDocRef = doc(db, "landlordUser", landlordId, "property", property.id);

    const toSave: PropetryDetailsFirebaseType = {
      bedrooms: Array.isArray(property.data.bedrooms) ? property.data.bedrooms : [property.data.bedrooms ?? { images: [], name: "" }],
      bathrooms: Array.isArray(property.data.bathrooms) ? property.data.bathrooms : [property.data.bathrooms ?? { images: [], name: "" }],
      kitchen: Array.isArray(property.data.kitchen) ? property.data.kitchen : [property.data.kitchen ?? { images: [], name: "" }],
      livingRooms: Array.isArray(property.data.livingRooms) ? property.data.livingRooms : [property.data.livingRooms ?? { images: [], name: "" }],
      externalView: Array.isArray(property.data.externalView) ? property.data.externalView : [property.data.externalView ?? { images: [], name: "" }],
      addRooms: Array.isArray(property.data.addRooms) ? property.data.addRooms : [property.data.addRooms ?? { images: [], name: "" }],
      addExternalSpace: Array.isArray(property.data.addExternalSpace) ? property.data.addExternalSpace : [property.data.addExternalSpace ?? { images: [], name: "" }],
      landlordVerificationData: {
        idImageUrl: encodePath(property.data.landlordVerificationData?.idImageUrl ?? "") ?? null,
        ownershipImageUrl: encodePath(property.data.landlordVerificationData?.ownershipImageUrl ?? "") ?? null,
        houseImageUrl: encodePath(property.data.landlordVerificationData?.houseImageUrl ?? "") ?? null
      },
      tenantInfo: {
        tenantInfo: {
          name: property.data.tenantInfo?.tenantInfo?.name ?? "",
          number: property.data.tenantInfo?.tenantInfo?.number ?? "",
          houseImages: property.data.tenantInfo?.tenantInfo?.houseImages ?? {},
        },
        problems: property.data.tenantInfo?.problems ?? []
      }
    };

    try {
      await setDoc(propertyDocRef, toSave);
      Alert.alert("Success", "Property details updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating document: ", error);
      Alert.alert("Error", "Failed to update property details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProperty(JSON.parse(propertyString as string));
    setIsEditing(false);
  };

  const handleRemoveTenant = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User is not authenticated");
      return;
    }

    const landlordId = user.uid;
    const propertyDocRef = doc(db, "landlordUser", landlordId, "property", property.id);

    try {
      await updateDoc(propertyDocRef, {
        tenantInfo: null // Remove tenant information
      });
      setProperty(prev => ({ ...prev, data: { ...prev.data, tenantInfo: null } }));
      Alert.alert("Success", "Tenant removed successfully");
    } catch (error) {
      console.error("Error removing tenant: ", error);
      Alert.alert("Error", "Failed to remove tenant");
    }
  };

  const handleRoomNameChange = (categoryKey: string, index: number, newName: string) => {
    setProperty(prev => {
      const newData = { ...prev.data };
      if (!newData[categoryKey as keyof Data]) {
        console.warn(`Category key ${categoryKey} is undefined`);
        return prev;
      }
      (newData[categoryKey as keyof Data] as RoomData[])[index].name = newName;
      return { ...prev, data: newData };
    });
  };

  const renderImages = (roomData: RoomData[], categoryKey: string) => {
    if (!roomData || roomData.length === 0) {
      return null;
    }
    return roomData.map((room, roomIndex) => (
      <View key={roomIndex}>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={room.name}
            onChangeText={(newName) => handleRoomNameChange(categoryKey, roomIndex, newName)}
          />
        ) : (
          <Text style={styles.roomName}>{room.name || `Room ${roomIndex + 1}`}</Text>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {room.images && room.images.map((imageUrl, imageIndex) => (
            <Image key={imageIndex} source={{ uri: encodePath(imageUrl) }} style={styles.roomImage} />
          ))}
        </ScrollView>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>{property.address} Preview</Text>
  
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Tenant Information</Text>
          {property.data.tenantInfo ? (
            <>
              <Text style={styles.infoValue}>Name: {property.data.tenantInfo.tenantInfo.name}</Text>
              <Text style={styles.infoValue}>Number: {property.data.tenantInfo.tenantInfo.number}</Text>
              {isEditing && (
                <TouchableOpacity onPress={handleRemoveTenant}>
                  <Text style={styles.removeButton}>Remove Tenant</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Button
              title="Add Tenant"
              onPress={() => router.navigate({
                pathname: "/landlordDashboard/AddTenant",
                params: { houseAddr: property.address },
              })}
            />
          )}
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Verification Images</Text>
          {images.map((image) => (
            <View key={image.key} style={styles.imageContainer}>
              <Text style={styles.imageTitle}>{image.title}</Text>
              <Image source={{ uri: image.url ?? "" }} style={styles.verificationImage} />
            </View>
          ))}
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>House Information</Text>
          {houseInfo.map((info) => (
            <View key={info.key} style={styles.infoItem}>
              <Text style={styles.sectionHeader}>{info.key.charAt(0).toUpperCase() + info.key.slice(1)}:</Text>
              {typeof info.value === 'string' ? (
                <Text style={styles.infoValue}>{info.value}</Text>
              ) : (
                renderImages(info.value as RoomData[], info.key)
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Problems</Text>
          {tenant?.problems && tenant.problems.length > 0 ? (
            <RenderProblems
              problems={tenant?.problems}
            />
          ) : (
            <Text style={styles.infoValue}>No problems reported</Text>
          )}
        </View>
  
        {isEditing ? (
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCancel} />
            <Button title="Save" onPress={handleSave} />
          </View>
        ) : (
          <Button title="Edit" onPress={handleEdit} />
        )}
  
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Updating...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#333',
  },
  imageContainer: {
    marginBottom: 16,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: '#555',
  },
  verificationImage: {
    width: '100%',
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoKey: {
    fontSize: 16,
    fontWeight: "600",
    color: '#444',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: '#444',
  },
  imageScroll: {
    flexGrow: 0,
    marginBottom: 15,
  },
  roomImage: {
    width: windowWidth * 0.6,
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
    marginRight: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  removeButton: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  problemContainer: {
    marginBottom: 16,
  },
  problemDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  problemImage: {
    width: '100%',
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
  },
});

export default PreviewHouse;
