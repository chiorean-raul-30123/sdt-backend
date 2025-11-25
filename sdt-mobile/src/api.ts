import axios from "axios";
import { Platform } from "react-native";

const ANDROID_BASE = "http://10.0.2.2:8080"; // emulator
const IOS_BASE = "http://localhost:8080";    // iOS simulator
const DEVICE_BASE = ANDROID_BASE;

export const BASE_URL =
  Platform.OS === "android"
    ? ANDROID_BASE
    : Platform.OS === "ios"
    ? IOS_BASE
    : DEVICE_BASE;

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
});

export default api;