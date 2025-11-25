import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { COLORS, GAP, RADIUS } from "../constants/theme";
import StyledInput from "../components/StyledInput";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    pickupAddress: "",
    deliveryAddress: "",
    contactPerson: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async () => {
    setErr(null);
    if (!form.email.trim() || !form.password || !form.name.trim()) {
      setErr("Email, parolă și nume sunt obligatorii.");
      return;
    }
    try {
      setLoading(true);
      await register({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        name: form.name.trim(),
        phone: form.phone || null,
        pickupAddress: form.pickupAddress || null,
        deliveryAddress: form.deliveryAddress || null,
        contactPerson: form.contactPerson || null,
      });
      navigation.replace("Home");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Înregistrare eșuată");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: COLORS.text, fontSize: 28, fontWeight: "700", marginBottom: 8 }}>
          Sign Up
        </Text>
        <Text style={{ color: COLORS.textMuted, marginBottom: 24 }}>
          Creează un cont nou. Dacă email-ul corespunde unui curier din backend, vei fi curier; altfel, customer.
        </Text>

        <View style={{ backgroundColor: COLORS.card, borderRadius: 20, padding: 18, gap: GAP }}>
          {err && <Text style={{ color: COLORS.danger, marginBottom: 4 }}>{err}</Text>}

          <StyledInput label="Nume" value={form.name} onChangeText={(v) => set("name", v)} />
          <StyledInput
            label="Email"
            value={form.email}
            onChangeText={(v) => set("email", v)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <StyledInput
            label="Parolă"
            value={form.password}
            onChangeText={(v) => set("password", v)}
            secureTextEntry
          />
          <StyledInput label="Telefon" value={form.phone} onChangeText={(v) => set("phone", v)} />
          <StyledInput
            label="Adresa ridicare (opțional)"
            value={form.pickupAddress}
            onChangeText={(v) => set("pickupAddress", v)}
          />
          <StyledInput
            label="Adresa livrare (opțional)"
            value={form.deliveryAddress}
            onChangeText={(v) => set("deliveryAddress", v)}
          />
          <StyledInput
            label="Persoană contact (opțional)"
            value={form.contactPerson}
            onChangeText={(v) => set("contactPerson", v)}
          />

          <TouchableOpacity
            onPress={onSubmit}
            disabled={loading}
            style={{
              backgroundColor: COLORS.accent,
              paddingVertical: 14,
              borderRadius: RADIUS,
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              {loading ? "Se creează..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 8 }}>
            <Text style={{ color: COLORS.textMuted, textAlign: "center" }}>
              Ai deja cont? <Text style={{ color: COLORS.text }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
