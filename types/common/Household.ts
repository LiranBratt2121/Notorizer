export type Apartment = {
  addr?: string;
  city?: string;
  state?: string;
  landlord?: string;
  tenant?: string;
}

export type Room = {
  name?: string;
  side?: number;
}

export type LandlordVerificationData = {
  idImageUrl: string | null;
  ownershipImageUrl: string | null;
  houseImageUrl: string | null;
};

export interface RoomData {
  images?: string[];
  name?: string;
}

export type Data = {
  addExternalSpace?: RoomData
  addRooms?: RoomData
  bedrooms?: RoomData
  externalView?: RoomData
  kitchen?: RoomData
  landlordVerificationData: LandlordVerificationData
  livingRooms?: RoomData
  bathrooms?: RoomData
  tenantInfo?: Tenant | undefined | null
}

export interface Property {
  id: string;
  address: string;
  data: Data;
}

type Corner = {
  side: Number;
  RoomData: RoomData;
}

export type TenantHouseImages = {
  addExternalSpace?: Corner[]
  addRooms?: Corner[]
  bedrooms?: Corner[]
  externalView?: Corner[]
  kitchen?: Corner[]
  livingRooms?: Corner[]
  bathrooms?: Corner[]
}

export type Tenant = {
  name: string;
  number: string;
  houseImages?: TenantHouseImages;
  otp?: string;
  landlordId?: string;
  houseAddress?: string;
};