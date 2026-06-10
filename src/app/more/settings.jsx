import { useThemeManager } from "@/hooks/useThemeManager";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { themeMode, updateThemeMode } = useThemeManager();
  const { userName, userImage, logout } = useUser();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout? This will clear your name and profile picture from this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/welcome");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  const languages = ["English", "Bangla", "Arabic"];

  const SettingsRow = ({
    icon,
    label,
    value,
    onPress,
    showArrow = true,
    rightElement = null,
    disabled = false,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-700"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Ionicons name={icon} size={22} color="#64748B" />
        <Text className="text-base text-slate-700 dark:text-slate-200 font-medium">
          {label}
        </Text>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <View className="flex-row items-center gap-2">
          {value && (
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {value}
            </Text>
          )}
          {showArrow && (
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-900"
      edges={["top"]}
    >
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-700">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-slate-900 dark:text-white">
            Settings
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Section */}
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          activeOpacity={0.8}
          className="px-4 py-6"
        >
          <View className="flex-row items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <View className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center overflow-hidden">
              {userImage ? (
                <Image
                  source={{ uri: userImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={32} color="#10B981" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-slate-900 dark:text-white">
                {userName || "User"}
              </Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                View & edit profile
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {/* Preferences Section */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3 ml-1">
            Preferences
          </Text>
          <View className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <SettingsRow
              icon="notifications-outline"
              label="Notifications and sounds"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: "#cbd5e1", true: "#10B981" }}
                  thumbColor="#ffffff"
                />
              }
              showArrow={false}
            />
            <SettingsRow
              icon="language-outline"
              label="Language"
              value={language}
              onPress={() => setShowLanguageMenu(!showLanguageMenu)}
            />
            {showLanguageMenu && (
              <View className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => {
                      setLanguage(lang);
                      setShowLanguageMenu(false);
                    }}
                    className={`py-3 px-4 rounded-lg mb-2 ${
                      language === lang
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : ""
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        language === lang
                          ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <SettingsRow
              icon="moon-outline"
              label="Dark Mode"
              rightElement={
                <Switch
                  value={themeMode === "dark"}
                  onValueChange={(isDark) =>
                    updateThemeMode(isDark ? "dark" : "light")
                  }
                  trackColor={{ false: "#cbd5e1", true: "#10B981" }}
                  thumbColor="#ffffff"
                />
              }
              showArrow={false}
            />
          </View>
        </View>

        {/* Account Section */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3 ml-1">
            Account
          </Text>
          <View className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <SettingsRow
              icon="person-circle-outline"
              label="Accounts"
              onPress={() => router.push("/accounts")}
            />
            <SettingsRow
              icon="information-circle-outline"
              label="About us"
              onPress={() => router.push("/about")}
            />
            <SettingsRow
              icon="call-outline"
              label="Contact us"
              onPress={() => router.push("/contact")}
            />
            <SettingsRow
              icon="help-circle-outline"
              label="Support"
              onPress={() => {}}
            />
            <SettingsRow
              icon="trash-outline"
              label="Clear cache"
              onPress={() => {}}
            />
            <SettingsRow
              icon="document-text-outline"
              label="Terms and Privacy Policy"
              onPress={() => {}}
            />
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-between px-4 py-4"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                <Text className="text-base text-red-500 font-medium">
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
