import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
} from "react-native";
import { RoomData } from "@/types/common/Household";
import encodePath from "@/utils/EncodeFireBaseStorageURL";

const windowWidth = Dimensions.get("window").width;

const RenderField = (fieldData: RoomData[] | RoomData | undefined) => {
  if (!fieldData) {
    return null;
  }

  const dataArray = Array.isArray(fieldData) ? fieldData : [fieldData];

  return dataArray.map((room, index) => (
    <View key={index} style={styles.fieldContainer}>
      <Text style={styles.fieldName}>{room.name || `Item ${index + 1}`}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {room.images &&
          room.images.map((imageUrl, imgIndex) => (
            <Image
              key={imgIndex}
              source={{ uri: encodePath(imageUrl) }}
              style={styles.fieldImage}
            />
          ))}
      </ScrollView>
    </View>
  ));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "white",
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
    color: "#333",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#444",
  },
  imageScroll: {
    flexGrow: 0,
    marginBottom: 15,
  },
  fieldImage: {
    width: windowWidth * 0.6,
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
    marginRight: 8,
  },
});

export default RenderField;