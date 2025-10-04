export interface DeliveryAddress {
  id: number;
  receiverName: string;
  phone: string;
  streetLine1: string;
  streetLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  userId: number;
}

// Type for creating a new address (omitting server-generated fields)
export type DeliveryAddressCreateData = Omit<DeliveryAddress, 'id' | 'userId' | 'isDefault'>;
