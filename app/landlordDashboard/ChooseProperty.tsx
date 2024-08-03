import { SafeAreaView, FlatList, StyleSheet, Alert, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import PropertyCard from '@/components/common/PropertyCard';
import { collection, getDocs, doc } from 'firebase/firestore';
import { db, auth } from "../../firebaseConfig";

interface Property {
  id: string;
  address: string;
  imageBase64: string; 
  data: any;
}

const ChooseProperty: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User is not authenticated");
        setLoading(false);
        return;
      }

      const landlordId = user.uid;
      const propertyCollectionRef = collection(doc(db, "landlordUser", landlordId), "property");

      try {
        const querySnapshot = await getDocs(propertyCollectionRef);
        const fetchedProperties: Property[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          address: doc.id, // doc.id is the address.
          imageBase64: doc.data().landlordVerificationData?.houseImageString || '', 
          data: doc.data()
        }));
        setProperties(fetchedProperties);
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

    fetchProperties();
  }, []);

  const renderItem = ({ item }: { item: Property }) => (
    <PropertyCard
      key={item.id}
      property={item.address}
      imageBase64={item.imageBase64}
      onPress={() => router.push({ pathname: 'propertyDetails', params: { propertyId: item.id } })}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={properties}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
});

export default ChooseProperty;
