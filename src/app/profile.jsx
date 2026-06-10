import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { userName, userImage, saveUserImage, logout } = useUser();
  const [updating, setUpdating] = useState(false);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Permission to access the photo library is required to set a profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || result.cancelled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      setUpdating(true);
      await saveUserImage(asset.uri);
      Alert.alert("Success", "Profile picture updated successfully.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile picture. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

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

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-900"
      edges={["top"]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-700">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#64748B" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-slate-900 dark:text-white">
          Profile
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerClassName="py-8 px-4 items-center">
        {/* Avatar Section */}
        <View className="mb-6 relative">
          <View className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-md overflow-hidden bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center">
            {updating ? (
              <ActivityIndicator size="large" color="#10B981" />
            ) : userImage ? (
              <Image
                source={{ uri: userImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={64} color="#10B981" />
            )}
          </View>

          <TouchableOpacity
            onPress={pickImage}
            disabled={updating}
            activeOpacity={0.8}
            className="absolute bottom-0 right-0 bg-emerald-600 dark:bg-emerald-500 w-10 h-10 rounded-full items-center justify-center border-4 border-slate-50 dark:border-slate-900 shadow-sm"
          >
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
          {userName || "User"}
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mb-10 text-center">
          Member
        </Text>

        {/* Option Rows */}
        <View className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <TouchableOpacity
            onPress={pickImage}
            disabled={updating}
            className="flex-row items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-700"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <Ionicons name="image-outline" size={22} color="#64748B" />
              <Text className="text-base text-slate-700 dark:text-slate-200 font-medium">
                Change Profile Photo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl py-4 items-center justify-center flex-row gap-2 active:bg-red-100"
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-base font-semibold text-red-500">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
