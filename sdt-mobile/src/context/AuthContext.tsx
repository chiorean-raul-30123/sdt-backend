import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../api";

export type Role = "DISPATCHER" | "COURIER" | "CUSTOMER";

export type AuthUser = {
  email: string;
  role: Role;
  courierId: number | null;
  customerId: number | null;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
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

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ token: null, user: null });

  // la pornire, citim din SecureStore
  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      const email = await SecureStore.getItemAsync("email");
      const role = await SecureStore.getItemAsync("role");
      const courierId = await SecureStore.getItemAsync("courierId");
      const customerId = await SecureStore.getItemAsync("customerId");

      if (token && email && role) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        setState({
          token,
          user: {
            email,
            role: role as Role,
            courierId: courierId ? Number(courierId) : null,
            customerId: customerId ? Number(customerId) : null,
          },
        });
      }
    })();
  }, []);

  async function handleAuthResponse(data: any) {
    // backend-ul tău trimite: token, role, courierId, customerId
    const { token, role, courierId, customerId, email } = data;

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("role", role);
    await SecureStore.setItemAsync("email", email || "");
    await SecureStore.setItemAsync("courierId", courierId != null ? String(courierId) : "");
    await SecureStore.setItemAsync("customerId", customerId != null ? String(customerId) : "");

    setState({
      token,
      user: {
        email: email || "",
        role,
        courierId: courierId ?? null,
        customerId: customerId ?? null,
      },
    });
  }

  const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  console.log("LOGIN RAW RESPONSE:", res.data);
  const { data } = res;
  await handleAuthResponse({ ...data, email });
};

const register = async (payload: RegisterPayload) => {
  const res = await api.post("/auth/register", payload);
  console.log("REGISTER RAW RESPONSE:", res.data);
  const { data } = res;
  await handleAuthResponse({ ...data, email: payload.email });
};

  const logout = async () => {
    delete api.defaults.headers.common.Authorization;
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("role");
    await SecureStore.deleteItemAsync("email");
    await SecureStore.deleteItemAsync("courierId");
    await SecureStore.deleteItemAsync("customerId");

    setState({ token: null, user: null });
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
