import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../api";

type AuthState = {
  token: string | null;
  role: "DISPATCHER" | "COURIER" | "CUSTOMER" | null;
  courierId?: number | null;
  customerId?: number | null;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  phone?: string | null;
  pickupAddress?: string | null;
  deliveryAddress?: string | null;
  contactPerson?: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ token: null, role: null });

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      const role = await SecureStore.getItemAsync("role");
      const courierId = await SecureStore.getItemAsync("courierId");
      const customerId = await SecureStore.getItemAsync("customerId");
      if (token && role) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        setState({
          token,
          role: role as any,
          courierId: courierId ? Number(courierId) : null,
          customerId: customerId ? Number(customerId) : null,
        });
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { token, role, courierId, customerId } = data;

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("role", role);
    await SecureStore.setItemAsync("courierId", String(courierId ?? ""));
    await SecureStore.setItemAsync("customerId", String(customerId ?? ""));

    setState({ token, role, courierId, customerId });
  };

  const register = async (payload: RegisterPayload) => {
    const { data } = await api.post("/auth/register", payload);
    const { token, role, courierId, customerId } = data;

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("role", role);
    await SecureStore.setItemAsync("courierId", String(courierId ?? ""));
    await SecureStore.setItemAsync("customerId", String(customerId ?? ""));

    setState({ token, role, courierId, customerId });
  };

  const logout = async () => {
    delete api.defaults.headers.common.Authorization;
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("courierId");
    await SecureStore.deleteItemAsync("customerId");
    setState({ token: null, role: null, courierId: null, customerId: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};