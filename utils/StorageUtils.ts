import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { storage } from "../firebaseConfig";
import CryptoJS from 'crypto-js';

// Function to generate a unique file name
const generateUniqueFileName = (base64String: string): string => {
  const hash = CryptoJS.MD5(base64String).toString();
  return `images/${hash}.png`; // Currently works only on png
};

const uploadBase64Image = async (base64String: string): Promise<string> => {
  try {
    const fileName = generateUniqueFileName(base64String);
    const storageRef = ref(storage, fileName);

    const base64Data = base64String.replace(/^data:image\/(png|jpeg);base64,/, '');
    const response = await fetch(`data:image/png;base64,${base64Data}`);
    const blob = await response.blob();

    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('Uploaded a Base64 image as Blob!');
    console.log('File available at:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading Base64 image:', error);
    throw error;
  }
};

const fetchImageAsBase64 = async (downloadURL: string): Promise<string | null> => {
  try {
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
