export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type CourierDto = {
  id: number;
  name: string;
  email: string;
  managerId?: number | null;
  lastLat?: number | null;
  lastLng?: number | null;
};

export type CourierCreateDto = {
  name: string;
  email: string;
  managerId?: number | null;
  lastLat?: number | null;
  lastLng?: number | null;
};

export type PackageStatus = "NEW" | "PENDING" | "DELIVERED";

export type PackageDto = {
  id: number;
  trackingCode: string;
  status: PackageStatus;
  weightKg?: number | null;
  pickupAddress: string;
  deliveryAddress: string;
  courierId?: number | null;
  assignedAt?: string | null;
  deliveredAt?: string | null;
};
export type PackageCreateDto = {
  pickupAddress: string;
  deliveryAddress: string;
  weightKg?: number | null;
  courierId?: number | null;
  senderCustomerId: number;
};

export type CustomerDto = {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type CustomerCreateDto = {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type CourierPatchDto = Partial<{
  name: string;
  email: string;
  managerId: number | null;
  lastLat: number | null;
  lastLng: number | null;
}>;
