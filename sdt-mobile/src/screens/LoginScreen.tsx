import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { COLORS, GAP, RADIUS } from "../constants/theme";
import StyledInput from "../components/StyledInput";
import { useAuth } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStack = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStack, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr(null);
    if (!email.trim() || !password) {
      setErr("Email și parola sunt obligatorii.");
      return;
    }
    try {
      setLoading(true);
      await login(email.trim().toLowerCase(), password);
      navigation.replace("Home");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Autentificare eșuată");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ color: COLORS.text, fontSize: 28, fontWeight: "700", marginBottom: 8 }}>
          Login
        </Text>
        <Text style={{ color: COLORS.textMuted, marginBottom: 24 }}>
          Bine ai revenit! Autentifică-te în contul tău.
        </Text>

        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 20,
            padding: 18,
            gap: GAP,
          }}
        >
          {err && <Text style={{ color: COLORS.danger, marginBottom: 4 }}>{err}</Text>}

          <StyledInput
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="ex. ion@firma.ro"
          />
          <StyledInput
            label="Parolă"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
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
              {loading ? "Se autentifică..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 8 }}>
            <Text style={{ color: COLORS.textMuted, textAlign: "center" }}>
              Nu ai cont? <Text style={{ color: COLORS.text }}>Creează unul</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}