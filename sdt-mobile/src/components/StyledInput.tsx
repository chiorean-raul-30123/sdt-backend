import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import { COLORS, RADIUS } from "../constants/theme";

type Props = TextInputProps & { label?: string; error?: string | null };

export default function StyledInput({ label, error, style, ...rest }: Props) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label ? (
        <Text style={{ color: COLORS.text, marginBottom: 6, opacity: 0.9 }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor="#B6B8D6"
        style={[
          {
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: RADIUS,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: COLORS.text,
            borderWidth: 1,
            borderColor: error ? COLORS.danger : "transparent",
          },
          style as any,
        ]}
        {...rest}
      />
      {!!error && (
        <Text style={{ color: COLORS.danger, marginTop: 6 }}>{error}</Text>
      )}
    </View>
  );
}