import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const nav = useNavigation<any>();

  const roleLabel =
    user?.role === "CUSTOMER"
      ? "Client"
      : user?.role === "COURIER"
      ? "Curier"
      : user?.role === "DISPATCHER"
      ? "Dispatcher"
      : "Utilizator";

  const handleNewShipment = () => {
    nav.navigate("NewShipment");
  };

  const handleMap = () => {
    nav.navigate("Map");
  };

  const handleHistory = () => {
    nav.navigate("History");
  };

  const handleAccount = () => {
    nav.navigate("Account");
  };

  const handleSupportChat = () => {
    // e în RootStack, deci navigăm prin parent
    const parent = (nav as any).getParent?.();
    if (parent) {
      parent.navigate("SupportChat");
    } else {
      // fallback – dacă pentru orice motiv e în același navigator
      nav.navigate("SupportChat");
    }
  };

  return (
    <View style={styles.root}>
      {/* fundal mov de sus */}
      <View style={styles.topBackground} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* card alb cu info utilizator, așezat peste fundalul mov */}
        <View style={styles.welcomeCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeTitle}>
              Bine ai venit!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              De aici poți trimite colete, vedea istoricul și urmări locațiile
              easybox.
            </Text>

            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{roleLabel}</Text>
              </View>

              {user?.customerId && (
                <View style={[styles.badge, styles.badgeSecondary]}>
                  <Text style={[styles.badgeText, styles.badgeSecondaryText]}>
                    Client #{user.customerId}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.avatarCircle}>
            <Ionicons name="cube-outline" size={26} color="#4F46E5" />
          </View>
        </View>

        {/* GRILA DE ACȚIUNI */}
        <View style={styles.actionsGrid}>
          <ActionCard
            icon={
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={24}
                color="#E53935"
              />
            }
            title="Trimite colet"
            subtitle="Creează un colet nou"
            onPress={handleNewShipment}
          />

          <ActionCard
            icon={
              <Ionicons
                name="location-outline"
                size={24}
                color="#2563EB"
              />
            }
            title="Locații easybox"
            subtitle="Vezi punctele de ridicare"
            onPress={handleMap}
          />

          <ActionCard
            icon={
              <Feather
                name="clock"
                size={24}
                color="#F59E0B"
              />
            }
            title="Istoric colete"
            subtitle="Urmărește comenzile vechi"
            onPress={handleHistory}
          />

          <ActionCard
            icon={
              <Ionicons
                name="person-outline"
                size={24}
                color="#10B981"
              />
            }
            title="Detalii cont"
            subtitle="Editează datele tale"
            onPress={handleAccount}
          />
        </View>

        {/* CARD ASISTENT AI */}
        <View style={styles.aiCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>Ai nevoie de ajutor?</Text>
            <Text style={styles.aiSubtitle}>
              Întreabă asistentul AI despre coletele tale sau despre cum
              funcționează aplicația.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.aiButton}
            onPress={handleSupportChat}
          >
            <Ionicons name="chatbubbles-outline" size={18} color="#fff" />
            <Text style={styles.aiButtonText}>Deschide chat</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutRow} onPress={logout}>
          <Feather name="log-out" size={18} color="#6B7280" />
          <Text style={styles.logoutText}>Delogare</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

/** Card pentru acțiunile principale */
type ActionCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function ActionCard({ icon, title, subtitle, onPress }: ActionCardProps) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionIconWrapper}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F3F4FF",
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "#4F46E5",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  welcomeCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: "#E5E7EB",
    marginRight: 8,
  },
  badgesRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
  },
  badgeText: {
    fontSize: 11,
    color: "#111827",
    fontWeight: "500",
  },
  badgeSecondary: {
    backgroundColor: "#DBEAFE",
  },
  badgeSecondaryText: {
    color: "#1D4ED8",
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  actionsGrid: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  actionCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  actionIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  actionSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  aiCard: {
    marginTop: 20,
    borderRadius: 18,
    backgroundColor: "#020617",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 12,
    color: "#E5E7EB",
  },
  aiButton: {
    marginLeft: 12,
    backgroundColor: "#F97316",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
  },
  aiButtonText: {
    marginLeft: 6,
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  logoutRow: {
    marginTop: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  logoutText: {
    marginLeft: 6,
    color: "#6B7280",
    fontSize: 13,
  },
});
