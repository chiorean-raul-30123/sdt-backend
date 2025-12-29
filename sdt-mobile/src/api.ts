import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HOST =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"   
    : "http://localhost:8080";

const api = axios.create({
  baseURL: `${HOST}/api`,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;