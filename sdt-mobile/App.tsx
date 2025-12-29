import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { COLORS } from "./src/constants/theme";
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "./src/types/navigation";
import AuthStack from "./src/navigation/AuthStack";
import CustomerTabs from "./src/navigation/CustomerTabs";
import SupportChat from "./src/screens/SupportChat";


const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.bg,
    card: COLORS.bg,
    text: "white",
    border: "transparent",
  },
};

function RootNavigator() {
  const { token, user } = useAuth();

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
        <Stack.Screen name="SupportChat" component={SupportChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
