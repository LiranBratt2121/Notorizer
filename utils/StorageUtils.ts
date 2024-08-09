import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../firebaseConfig";

const uploadBase64Image = async (base64String: string, fileName: string) => {
  try {
    const storageRef = ref(storage, `images/${fileName}`);

    const snapshot = await uploadString(storageRef, base64String, 'base64');

    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('Uploaded a Base64 string image!');
    console.log('File available at:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading Base64 image:', error);
    throw error;
  }
};

const fetchImageAsBase64 = async (fileName: string): Promise<string | null> => {
  try {
    const storageRef = ref(storage, `images/${fileName}`);
    const downloadURL = await getDownloadURL(storageRef);

    const response = await fetch(downloadURL);
    const blob = await response.blob();

    const base64String = await new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (result) {
          resolve((result.toString().split(','))[1]);
        } else {
          resolve(null);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    if (base64String) {
      console.log('Retrieved Base64 string:', base64String);
      return base64String;
    } else {
      console.error('Failed to convert Blob to Base64.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving Base64 string:', error);
    throw error;
  }
};

export {
  uploadBase64Image,
  fetchImageAsBase64,
};