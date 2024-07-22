import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import Button from "../../components/common/Button";
import { useRouter } from "expo-router";

const PropertyDetails: React.FC = () => {
  const router = useRouter();

  const handleButtonPress = (title: string, optionKey: string) => {
    router.push({
      pathname: `landlordDashboard/SliderMenuScreen`,
      params: { title, optionKey },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {[
          "bedrooms",
          "bathrooms",
          "kitchen",
          "living rooms",
          "External view",
          "Add rooms",
          "Add external space",
        ].map((option) => (
          <Button
            key={option}
            title={option}
            onPress={() => handleButtonPress(option, option)}
          />
        ))}
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

export default PropertyDetails;
