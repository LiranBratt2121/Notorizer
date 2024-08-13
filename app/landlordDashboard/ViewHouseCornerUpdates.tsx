import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Tenant, TenantHouseImages } from '@/types/common/Household';
import { auth, db } from '@/firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import encodePath from '@/utils/EncodeFireBaseStorageURL';

interface ViewHouseCornerUpdatesProps {
  tenantInfo: Tenant['tenantInfo'] | null
}

const ViewHouseCornerUpdates = ({ tenantInfo }: ViewHouseCornerUpdatesProps) => {
    const [houseImages, setHouseImages] = useState<TenantHouseImages | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const tenantName = tenantInfo?.name ?? "NA";
          const propertyDocRef = doc(db, "tenantUser", tenantName);
          const docSnap = await getDoc(propertyDocRef);
          console.log("Document data:", docSnap.data());
          if (docSnap.exists()) {
            const houseImages: TenantHouseImages = docSnap.data().tenantInfo.houseImages;
            setHouseImages(houseImages);
          } else {
            console.log("No such document!");
            setHouseImages(null);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      if (tenantInfo){
        fetchData();
      }
    }, [tenantInfo]);

    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!houseImages) {
      return <Text>No recent images available.</Text>;
    }

    return (
      <ScrollView style={styles.container}>
        {Object.entries(houseImages).map(([roomType, images]) => (
          <View key={roomType} style={styles.roomSection}>
            <Text style={styles.roomTitle}>{roomType}</Text>
            {Array.isArray(images) ? (
              images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  {image.RoomData && image.RoomData.images && image.RoomData.images[0] ? (
                    <Image 
                      source={{ uri: encodePath(image.RoomData.images[0]) }} 
                      style={styles.image} 
                    />
                  ) : (
                    <Text>Image not available</Text>
                  )}
                  <Text style={styles.imageInfo}>Side: {image.side}</Text>
                  <Text style={styles.imageInfo}>Date: {image.dateTime}</Text>
                </View>
              ))
            ) : (
              <Text>No images for this room type</Text>
            )}
          </View>
        ))}
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roomSection: {
    marginBottom: 20,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  imageInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default ViewHouseCornerUpdates;