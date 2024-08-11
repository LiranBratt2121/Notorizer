import { RoomData, Tenant } from "../types/common/Household"

export type FormData = {
  bedrooms: RoomData[];
  bathrooms: RoomData[];
  kitchen: RoomData[];
  livingRooms: RoomData[];
  externalView: RoomData[];
  addRooms: RoomData[];
  addExternalSpace: RoomData[];
};

export type LandlordVerificationData = {
  idImageUrl: string | null;
  ownershipImageUrl: string | null;
  houseImageUrl: string | null;
};

export type PropetryDetailsFirebaseType = {
  bedrooms: RoomData[];
  bathrooms: RoomData[];
  kitchen: RoomData[];
  livingRooms: RoomData[];
  externalView: RoomData[];
  addRooms: RoomData[];
  addExternalSpace: RoomData[];
  landlordVerificationData: {
    idImageUrl: string | null;
    ownershipImageUrl: string | null;
    houseImageUrl: string | null;
  };
  tenantInfo?: Tenant
};