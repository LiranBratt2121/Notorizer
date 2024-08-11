import { db } from "@/firebase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const findDocumentIdByName = async (collectionPath: string, name: string) => {
  const querySnapshot = await getDocs(collection(db, collectionPath));
  let docId = "";
  querySnapshot.forEach((doc) => {
      const addr: string = doc.id
      if (addr === name) {
          docId = doc.id;
      }
  });
  return docId;
};