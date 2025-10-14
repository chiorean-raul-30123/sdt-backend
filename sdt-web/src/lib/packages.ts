import api from "./api";
import type { PackageCreateDto, PackageDto } from "../types";

export async function createPackage(payload: PackageCreateDto) {
  const res = await api.post<PackageDto>("/packages", payload);
  console.log("CREATE PACKAGE payload:", payload);
  return res.data;
}