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
  tenantInfo?: Tenant['tenantInfo'] | undefined | null
}

export interface Property {
  id: string;
  address: string;
  data: Data;
}

export type Corner = {
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

export type TenantProblem = {
  imageURL: string;
  description: string;
}

export type Tenant = {
  tenantInfo: {
    name: string;
    number: string;
    agreedToTerms?: Boolean
    houseAddress?: string;
    landlordId?: string;
    otp?: string;
    signature?: string;
    houseImages?: TenantHouseImages;
    password?: string;
    problems?: TenantProblem[];
  }
};