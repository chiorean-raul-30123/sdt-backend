import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

type PackageItem = {
  id: number;
  trackingCode: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  createdAt?: string | null;
  deliveredAt?: string | null;
};

export default function ShipmentHistoryScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.customerId) {
      setError("Nu am găsit customerId pentru utilizatorul curent.");
      setItems([]);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const url = `http://10.0.2.2:8080/api/customers/${user.customerId}/packages`;

      const { data } = await axios.get<PackageItem[]>(url);

      const list: PackageItem[] = Array.isArray(data)
        ? data
        : ((data as any).content ?? []);

      setItems(list);
    } catch (e: any) {
      console.log("LOAD HISTORY ERROR:", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
      });
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Nu s-a putut încărca istoricul coletelor."
      );
    } finally {
      setLoading(false);
    }
  }, [user?.customerId]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: PackageItem }) => {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.tracking}>{item.trackingCode}</Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>
        <Text style={styles.label}>Ridicare:</Text>
        <Text style={styles.value}>{item.pickupAddress}</Text>
        <Text style={styles.label}>Livrare:</Text>
        <Text style={styles.value}>{item.deliveryAddress}</Text>
        {item.deliveredAt && (
          <Text style={styles.footer}>Livrat la: {item.deliveredAt}</Text>
        )}
      </View>
    );
  };

  if (loading && !refreshing && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Se încarcă istoricul…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* header cu titlu + buton de refresh */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Istoric colete</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshText}>↻</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {items.length === 0 && !loading && !error && (
        <View style={styles.center}>
          <Text style={{ color: "#777" }}>Nu ai încă niciun colet.</Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  refreshButton: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  refreshText: {
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "crimson",
    textAlign: "center",
    marginTop: 8,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  tracking: {
    fontWeight: "600",
    fontSize: 15,
  },
  status: {
    fontWeight: "500",
    fontSize: 13,
    color: "#E53935",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
  },
  value: {
    fontSize: 14,
  },
  footer: {
    marginTop: 6,
    fontSize: 12,
    color: "#555",
  },
});
