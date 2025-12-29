import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function CreateShipmentScreen() {
  console.log("CreateShipmentScreen RENDERED");
  const { user } = useAuth(); 

  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    console.log("onSubmit CALLED");
    try {
      if (!user?.customerId) {
        Alert.alert(
          "Eroare",
          "Nu am găsit ID-ul de client (customerId) pentru utilizatorul logat. Încearcă să te reloghezi."
        );
        return;
      }

      if (!pickupAddress.trim() || !deliveryAddress.trim()) {
        Alert.alert("Eroare", "Adresa de ridicare și adresa de livrare sunt obligatorii.");
        return;
      }

      const payload = {
        pickupAddress: pickupAddress.trim(),
        deliveryAddress: deliveryAddress.trim(),
        weightKg: weight ? Number(weight) : null,
        courierId: null,                
        senderCustomerId: user.customerId,
      };

      console.log("TRIMIT PAYLOAD:", payload);
      setLoading(true);

      const { data } = await axios.post(
        "http://10.0.2.2:8080/api/packages", 
        payload
      );

      console.log("PACKAGE CREATED:", data);
      Alert.alert("Succes", "Colet creat cu succes!");

      setPickupAddress("");
      setDeliveryAddress("");
      setWeight("");
    } catch (e: any) {
      console.log("AXIOS ERROR:", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
      });
      Alert.alert(
        "Eroare",
        e?.response?.data?.message || e?.message || "Create failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trimite colet</Text>

      <Text style={styles.label}>Adresa ridicare</Text>
      <TextInput
        style={styles.input}
        value={pickupAddress}
        onChangeText={setPickupAddress}
        placeholder="Ex: Str. Observatorului 10"
      />

      <Text style={styles.label}>Adresa livrare</Text>
      <TextInput
        style={styles.input}
        value={deliveryAddress}
        onChangeText={setDeliveryAddress}
        placeholder="Ex: Str. Aviatorilor 7"
      />

      <Text style={styles.label}>Greutate (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        placeholder="Ex: 3"
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Se creează..." : "Creează colet"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#5949d3ff",
    borderRadius: 24,
    alignItems: "center",
    paddingVertical: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});