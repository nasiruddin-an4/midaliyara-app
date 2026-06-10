import { UserProvider, useUser } from "@/context/UserContext";
import { useThemeManager } from "@/hooks/useThemeManager";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { registerPushToken } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";

function PushTokenManager() {
  const { expoPushToken } = usePushNotifications();
  const { userName } = useUser();

  useEffect(() => {
    if (expoPushToken) {
      registerPushToken(expoPushToken, userName);
    }
  }, [expoPushToken, userName]);

  return null;
}

export default function TabLayout() {
  const { isLoaded } = useThemeManager(); // Initialize theme on app start
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  if (!isLoaded) return null; // Prevent flicker before theme loads

  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";

  return (
    <UserProvider>
      <PushTokenManager />
      <Tabs
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#0F172A",
          tabBarActiveTintColor: isDark ? "#10B981" : "#059669", // Emerald
          tabBarInactiveTintColor: isDark ? "#64748B" : "#94A3B8", // Slate
          tabBarStyle: {
            backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
            borderTopColor: isDark ? "#1E293B" : "#E2E8F0",
            borderTopWidth: 1,

            height: isIOS ? 88 : (insets.bottom > 0 ? 76 : 64),
            paddingTop: 8,
            paddingBottom: isIOS ? 28 : (insets.bottom > 0 ? insets.bottom + 4 : 10),
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginBottom: isIOS ? 0 : 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="activities/index"
          options={{
            title: "Activities",
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="members/index"
          options={{
            title: "Members",
            tabBarIcon: ({ color }) => (
              <Ionicons name="people" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="join/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="more/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="gallery"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="more/settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="activities/[id]"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="welcome"
          options={{
            href: null, // Hide from tab bar
            tabBarStyle: { display: "none" }, // Hide the tab bar when on this screen
          }}
        />
        <Tabs.Screen
          name="donate"
          options={{
            href: null, // Hide from tab bar
            title: "Donate",
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="accounts"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
