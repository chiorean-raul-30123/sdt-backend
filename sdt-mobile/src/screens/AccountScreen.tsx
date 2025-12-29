import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

type CustomerDto = {
  id: number;
  customerType?: "PERSON" | "COMPANY";
  name: string;
  email: string | null;
  contactPerson?: string | null;
  phone?: string | null;
  defaultPickupAddress?: string | null;
  defaultDeliveryAddress?: string | null;
};

export default function AccountScreen() {
  const { user, logout } = useAuth();

  const [customer, setCustomer] = useState<CustomerDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.customerId) {
      setError("Nu am găsit customerId pentru utilizatorul curent.");
      setCustomer(null);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const url = `http://10.0.2.2:8080/api/customers/${user.customerId}`;
      const { data } = await axios.get<CustomerDto>(url);

      setCustomer(data);
    } catch (e: any) {
      console.log("LOAD CUSTOMER ERROR:", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
      });
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Nu s-au putut încărca detaliile contului."
      );
    } finally {
      setLoading(false);
    }
  }, [user?.customerId]);

  useEffect(() => {
    load();
  }, [load]);

  const onSave = async () => {
    if (!customer) return;
    if (!user?.customerId) {
      Alert.alert("Eroare", "Nu am găsit customerId pentru utilizatorul curent.");
      return;
    }

    try {
      setSaving(true);

      const url = `http://10.0.2.2:8080/api/customers/${user.customerId}`;

      const payload = {
        // nu lăsăm user-ul să schimbe email-ul
        customerType: customer.customerType ?? "PERSON",
        name: customer.name?.trim(),
        email: customer.email, // trimitem email-ul exact cum e
        contactPerson: customer.contactPerson ?? null,
        phone: customer.phone ?? null,
        defaultPickupAddress: customer.defaultPickupAddress ?? null,
        defaultDeliveryAddress: customer.defaultDeliveryAddress ?? null,
      };

      const { data } = await axios.put<CustomerDto>(url, payload);
      setCustomer(data);
      Alert.alert("Succes", "Datele tale au fost actualizate.");
    } catch (e: any) {
      console.log("SAVE CUSTOMER ERROR:", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
      });
      Alert.alert(
        "Eroare",
        e?.response?.data?.message ||
          e?.message ||
          "Nu s-au putut salva modificările."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user?.customerId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#555", marginBottom: 8 }}>
          Ești logat, dar nu am găsit un customerId asociat.
        </Text>
        <Text style={{ color: "#555" }}>
          Probabil e un cont de curier / dispatcher.
        </Text>
      </View>
    );
  }

  if (loading && !customer) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Se încarcă detaliile contului…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Detalii cont</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Email – doar afișare, nu edităm */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={customer?.email ?? user.email ?? ""}
        editable={false}
      />

      {/* Parolă – doar afișare mascata */}
      <Text style={styles.label}>Parolă</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value="********"
        editable={false}
        secureTextEntry
      />

      {/* Nume */}
      <Text style={styles.label}>Nume</Text>
      <TextInput
        style={styles.input}
        value={customer?.name ?? ""}
        onChangeText={(text) =>
          setCustomer((c) => (c ? { ...c, name: text } : c))
        }
        placeholder="Numele tău"
      />

      {/* Telefon */}
      <Text style={styles.label}>Telefon</Text>
      <TextInput
        style={styles.input}
        value={customer?.phone ?? ""}
        onChangeText={(text) =>
          setCustomer((c) => (c ? { ...c, phone: text } : c))
        }
        placeholder="Ex: 0722 123 456"
        keyboardType="phone-pad"
      />

      {/* Adresa ridicare */}
      <Text style={styles.label}>Adresa implicită de ridicare</Text>
      <TextInput
        style={styles.input}
        value={customer?.defaultPickupAddress ?? ""}
        onChangeText={(text) =>
          setCustomer((c) =>
            c ? { ...c, defaultPickupAddress: text } : c
          )
        }
        placeholder="Ex: Str. Observatorului 10"
      />

      {/* Adresa livrare */}
      <Text style={styles.label}>Adresa implicită de livrare</Text>
      <TextInput
        style={styles.input}
        value={customer?.defaultDeliveryAddress ?? ""}
        onChangeText={(text) =>
          setCustomer((c) =>
            c ? { ...c, defaultDeliveryAddress: text } : c
          )
        }
        placeholder="Ex: Str. Aviatorilor 7"
      />

      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.7 }]}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "Se salvează..." : "Salvează modificările"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutText}>Delogare</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  error: {
    color: "crimson",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  inputDisabled: {
    backgroundColor: "#F2F2F2",
    color: "#777",
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#5949d3ff",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#5949d3ff",
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#5949d3ff",
    fontWeight: "500",
  },
});
