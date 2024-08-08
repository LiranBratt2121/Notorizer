import * as FileSystem from 'expo-file-system';

const verifyFileExists = async (fileUri: string) => {
  try {
    const decodedUri = decodeURIComponent(fileUri);
    const fileInfo = await FileSystem.getInfoAsync(decodedUri);
    if (fileInfo.exists) {
      console.log(`File exists at: ${decodedUri}`);
      return true;
    } else {
      console.error(`File does not exist at: ${decodedUri}`);
      return false;
    }
  } catch (error) {
    console.error(`Error checking file existence: ${error}`);
    return false;
  }
};

export default verifyFileExists;
