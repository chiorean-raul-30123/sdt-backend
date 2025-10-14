import api from "./api";
import type { CourierCreateDto, CourierDto, Page, PackageDto } from "../types";

export async function fetchCouriers(params: { page?: number; size?: number; sort?: string }) {
  const res = await api.get<Page<CourierDto>>("/couriers", { params });
  return res.data;
}

export async function createCourier(payload: CourierCreateDto) {
  const res = await api.post<CourierDto>("/couriers", payload);
  return res.data;
}

export async function fetchCourier(id: number) {
  const res = await api.get<CourierDto>(`/couriers/${id}`);
  return res.data;
}

export async function deleteCourier(id: number) {
  const res = await api.delete<void>(`/couriers/${id}`);
  return res.data;
}

export async function fetchPackagesByCourier(
  courierId: number,
  params: { page?: number; size?: number; sort?: string }
) {
  const res = await api.get<Page<PackageDto>>(`/couriers/${courierId}/packages`, { params });
  return res.data;
}
