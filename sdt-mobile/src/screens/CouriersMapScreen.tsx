import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type LockerPoint = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

const MOCK_LOCKERS: LockerPoint[] = [
  {
    id: "eb-11",
    name: "EasyBox Observator 10",
    address: "Str. Observatorului 10",
    lat: 46.7555,
    lng: 23.5842,
  },
  {
    id: "eb-12",
    name: "EasyBox Centru",
    address: "Piața Unirii",
    lat: 46.7700,
    lng: 23.5899,
  },
  {
    id: "eb-13",
    name: "EasyBox Zorilor",
    address: "Str. Frunzișului 12",
    lat: 46.7540,
    lng: 23.5730,
  },
  {
    id: "eb-14",
    name: "EasyBox Vivo",
    address: "Vivo Mall",
    lat: 46.7575,
    lng: 23.5205,
  },
  {
    id: "eb-1",
    name: "EasyBox Byxbee Park",
    address: "Byxbee Park, San Jose",
    lat: 37.4445,
    lng: -122.1035,
  },
  {
    id: "eb-2",
    name: "EasyBox Shoreline Lake",
    address: "Shoreline Lake, Mountain View",
    lat: 37.4325,
    lng: -122.0870,
  },
  {
    id: "eb-3",
    name: "EasyBox Googleplex North",
    address: "Googleplex North Campus",
    lat: 37.4265,
    lng: -122.0815,
  },
  {
    id: "eb-4",
    name: "EasyBox Googleplex South",
    address: "Googleplex South Campus",
    lat: 37.4228,
    lng: -122.0840,
  },
  {
    id: "eb-5",
    name: "EasyBox Charleston Center",
    address: "Charleston Rd, Mountain View",
    lat: 37.4210,
    lng: -122.0955,
  },
  {
    id: "eb-6",
    name: "EasyBox San Antonio",
    address: "San Antonio Rd, Mountain View",
    lat: 37.4055,
    lng: -122.1110,
  },
  {
    id: "eb-7",
    name: "EasyBox Downtown Palo Alto",
    address: "University Ave, Palo Alto",
    lat: 37.4450,
    lng: -122.1615,
  },
  {
    id: "eb-8",
    name: "EasyBox Caltrain Station",
    address: "Palo Alto Caltrain Station",
    lat: 37.4430,
    lng: -122.1640,
  },
  {
    id: "eb-9",
    name: "EasyBox Rengstorff Park",
    address: "Rengstorff Park, Mountain View",
    lat: 37.4015,
    lng: -122.0950,
  },
  {
    id: "eb-10",
    name: "EasyBox San Jose North",
    address: "N 1st St, San Jose",
    lat: 37.3850,
    lng: -121.9220,
  },
];

export default function CouriersMapScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLocker, setSelectedLocker] = useState<LockerPoint | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setRegion({
            latitude: 46.7700,
            longitude: 23.5899,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setLoadingLocation(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (e) {
        console.log("LOCATION ERROR:", e);
        setRegion({
          latitude: 46.7700,
          longitude: 23.5899,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  const filteredLockers = MOCK_LOCKERS.filter((l) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q)
    );
  });

  const centerOnUser = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (e) {
      console.log("CENTER USER ERROR:", e);
    }
  };

  if (!region || loadingLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Se încarcă harta…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredLockers.map((locker) => (
          <Marker
            key={locker.id}
            coordinate={{ latitude: locker.lat, longitude: locker.lng }}
            onPress={() => setSelectedLocker(locker)}
          >
            {/* icon stil „easybox” simplu */}
            <View style={styles.lockerMarker}>
              <MaterialIcons name="storefront" size={18} color="#E53935" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* buton flotant pentru centrare pe user, jos-dreapta */}
      <TouchableOpacity style={styles.myLocationBtn} onPress={centerOnUser}>
        <Ionicons name="navigate" size={22} color="#E53935" />
      </TouchableOpacity>

      <View style={styles.bottomPanel}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={18}
            color="#999"
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Caută după nume sau adresă"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#aaa"
          />
        </View>

        {selectedLocker && (
          <View style={styles.lockerInfo}>
            <Text style={styles.lockerName}>{selectedLocker.name}</Text>
            <Text style={styles.lockerAddress}>{selectedLocker.address}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lockerMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  myLocationBtn: {
    position: "absolute",
    right: 16,
    bottom: 120,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  bottomPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: "white",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#F2F2F2",
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
    paddingRight: 12,
    fontSize: 14,
  },
  lockerInfo: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
  },
  lockerName: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  lockerAddress: {
    fontSize: 12,
    color: "#777",
  },
});
