import { api } from "./api";
import axios from "axios";
import type { CustomerDto, CustomerCreateDto } from "../types";

type PagedAny =
  | { content: CustomerDto[]; totalElements?: number }
  | { items: CustomerDto[]; total?: number }
  | CustomerDto[];


export async function fetchCustomers(params?: { page?: number; size?: number }) {
  const res = await api.get<PagedAny>("/customers", {
    params: { page: params?.page ?? 0, size: params?.size ?? 50 },
  });
  const data = res.data as any;

  if (Array.isArray(data)) {
    return { items: data as CustomerDto[], total: data.length };
  }
  if (Array.isArray(data.content)) {
    return { items: data.content as CustomerDto[], total: data.totalElements ?? data.content.length };
  }
  if (Array.isArray(data.items)) {
    return { items: data.items as CustomerDto[], total: data.items.length ?? data.total ?? 0 };
  }
  return { items: [], total: 0 };
}

export async function createCustomer(input: CustomerCreateDto): Promise<CustomerDto> {
  const payload = {
    name: input.name.trim(),
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
    address: input.address?.trim() || null,
  };
  const { data } = await api.post<CustomerDto>("/customers", payload);
  return data;
}

export async function getCustomer(id: number): Promise<CustomerDto> {
  const { data } = await api.get<CustomerDto>(`/customers/${id}`);
  return data;
}


