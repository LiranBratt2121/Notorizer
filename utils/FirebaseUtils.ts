import { db } from "@/firebase/FirebaseConfig";
import { Data, Property, Tenant } from "@/types/common/Household";
import { collection, doc, getDoc, getDocs} from "firebase/firestore";

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

export const findTenantByOTP = async (tenantName: string, otp: string) => {
  try {
    const tenantDocRef = doc(db, `tenantUser/${tenantName.trim()}`);
    const tenantDocSnap = await getDoc(tenantDocRef);

    if (tenantDocSnap.exists()) {
      const tenantData = tenantDocSnap.data().tenantInfo;
      console.log(tenantData);
      if (tenantData && tenantData.otp === otp) {
        console.log("Match found:", tenantDocSnap.id, tenantData);
        return tenantData; // Return the matching document data
      } else {
        console.log("No matching tenant found with the given OTP.");
        return null;
      }
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error finding tenant by OTP:", error);
    return null;
  }
};

export const findTenantByName = async (tenantName: string): Promise<Tenant | null> => {
  try {
    const tenantDocRef = doc(db, `tenantUser/${tenantName.trim()}`);
    const tenantDocSnap = await getDoc(tenantDocRef);

    if (tenantDocSnap.exists()) {
      const tenantData = tenantDocSnap.data() as Tenant; // Cast to Tenant
      return tenantData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error finding tenant by name:", error);
    return null;
  }
};

export const findPropertyDataByTenant = async (tenant: Tenant): Promise<Data | null> => {
  try {
    const landlordId = tenant.tenantInfo.landlordId ?? "NA";

    const querySnapshot = await getDocs(collection(db, "landlordUser", landlordId, "property"));
    console.log("Query snapshot:", ["landlordUser", landlordId, "property"]);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data() as Data;
    }
  } catch (error) {
    console.error("Error finding property by tenant:", error);
    return null;
  }
  return null;
};