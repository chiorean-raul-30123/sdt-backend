import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation";
import { useAuth, RegisterPayload } from "../context/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    pickupAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Nume, email și parolă sunt obligatorii.");
      return;
    }
    setError(null);

    const payload: RegisterPayload = {
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      phone: form.phone || null,
      pickupAddress: form.pickupAddress || null,
      deliveryAddress: null,
      contactPerson: null,
    };

    try {
      setLoading(true);
      await register(payload);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Înregistrarea a eșuat. Încearcă din nou."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#5B4BDF", "#7B5CFF"]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.illustrationCircle}>
              <View style={styles.doorShape} />
            </View>

            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>
              Creează-ți un cont și trimite colete în câteva secunde.
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>Nume</Text>
              <TextInput
                style={styles.input}
                placeholder="Ion Popescu"
                placeholderTextColor="#B0B3C0"
                value={form.name}
                onChangeText={(v) => setField("name", v)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="ion.popescu@example.com"
                placeholderTextColor="#B0B3C0"
                autoCapitalize="none"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(v) => setField("email", v)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Parolă</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#B0B3C0"
                secureTextEntry
                value={form.password}
                onChangeText={(v) => setField("password", v)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Telefon (opțional)</Text>
              <TextInput
                style={styles.input}
                placeholder="07xx xxx xxx"
                placeholderTextColor="#B0B3C0"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(v) => setField("phone", v)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Adresa implicită de ridicare</Text>
              <TextInput
                style={styles.input}
                placeholder="Str. Observatorului 10, Cluj-Napoca"
                placeholderTextColor="#B0B3C0"
                value={form.pickupAddress}
                onChangeText={(v) => setField("pickupAddress", v)}
              />
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={onSubmit}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Se creează contul..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Ai deja cont?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  illustrationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F2FF",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  doorShape: {
    width: 30,
    height: 46,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#5B4BDF",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 24,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  error: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: "#5B4BDF",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 13,
  },
  footerLink: {
    marginLeft: 4,
    color: "#5B4BDF",
    fontWeight: "600",
    fontSize: 13,
  },
});
