import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/theme";

export default function HomeScreen() {
  const { role, logout, courierId, customerId } = useAuth();
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, padding: 24, gap: 12 }}>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>Home</Text>
      <Text style={{ color: "white" }}>Role: {role}</Text>
      <Text style={{ color: "white" }}>courierId: {String(courierId ?? "-")}</Text>
      <Text style={{ color: "white" }}>customerId: {String(customerId ?? "-")}</Text>

      <TouchableOpacity onPress={logout} style={{ marginTop: 24 }}>
        <Text style={{ color: "#ffdddd" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}