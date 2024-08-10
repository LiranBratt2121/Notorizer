import { LandlordVerificationData, Property } from "@/types/common/Household";

const encodePath = (url: string) => {
    const queryIndex = url.indexOf('?alt=media');

    const path = url.substring(0, queryIndex);

    const encodedPath = path.replace(/\/images\//g, '/images%2F');

    const resultUrl = encodedPath + url.substring(queryIndex);

    return resultUrl;
}

export const encodeLandlordVerificationData = (property: Property) => {
    const urls = property.data.landlordVerificationData;

    const encodedProperty: LandlordVerificationData = {
        houseImageUrl: urls.houseImageUrl ? encodePath(urls.houseImageUrl) : null,
        idImageUrl: urls.idImageUrl ? encodePath(urls.idImageUrl) : null,
        ownershipImageUrl: urls.ownershipImageUrl ? encodePath(urls.ownershipImageUrl) : null,
    }
    return encodedProperty;
}

export default encodePath;