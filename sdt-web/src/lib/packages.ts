import { api } from "./http";
import type { PackageCreateDto, PackageDto } from "../types";

export async function createPackage(input: PackageCreateDto): Promise<PackageDto> {
  const payload = {
    pickupAddress: input.pickupAddress.trim(),
    deliveryAddress: input.deliveryAddress.trim(),
    weightKg: input.weightKg === null ? null : Number(input.weightKg),
    courierId: input.courierId ?? null,
    senderCustomerId: Number(input.senderCustomerId), // IMPORTANT
  };

  try {
    const { data } = await api.post<PackageDto>("/packages", payload);
    return data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Create failed";
    throw new Error(msg);
  }
}
export async function fetchPackagesBySenderCustomerId(senderId: number): Promise<PackageDto[]> {
  const { data } = await api.get<PackageDto[]>("/packages", {
    params: { senderCustomerId: senderId }
  });
  return data;
}
