import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import api from "../api";

type ChatMessage = {
  id: string;
  from: "user" | "bot";
  text: string;
};

export default function SupportChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      from: "bot",
      text: "Salut! Sunt asistentul tău Smart Delivery. Cu ce te pot ajuta?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      from: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      setSending(true);

      const { data } = await api.post("/support/chat", {
        message: trimmed,
      });

      const replyText: string =
        data?.reply || "Nu am reușit să generez un răspuns acum.";

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        from: "bot",
        text: replyText,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      console.log("AI CHAT ERROR:", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
      });
      const botMsg: ChatMessage = {
        id: `b-err-${Date.now()}`,
        from: "bot",
        text:
          "A apărut o eroare la asistent. Încearcă din nou sau contactează suportul.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.from === "user";
    return (
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleBot,
        ]}
      >
        <Text style={isUser ? styles.textUser : styles.textBot}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Scrie mesajul tău..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, sending && { opacity: 0.7 }]}
          onPress={sendMessage}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.sendText}>Trimite</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  listContent: { padding: 12, paddingBottom: 80 },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "#E53935",
  },
  bubbleBot: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  textUser: { color: "white" },
  textBot: { color: "#222" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#E53935",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendText: { color: "white", fontWeight: "600" },
});
