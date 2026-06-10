import { fetchMembers } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MembersScreen() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchMembers();
      if (data) setMembers(data);
    } catch (error) {
      console.error("Failed to load members:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const renderItem = ({ item }) => {
    let resolvedUri = item.image || item.avatarUrl || item.profilePicture;
    if (resolvedUri && !resolvedUri.startsWith("http")) {
      const path = resolvedUri.startsWith("/")
        ? resolvedUri
        : `/${resolvedUri}`;
      resolvedUri = `https://middlealiyara.vercel.app${path}`;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          setSelectedMember(item);
          setDetailVisible(true);
        }}
        className="mb-4"
      >
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex-row items-center">
          {resolvedUri ? (
            <Image
              source={{ uri: resolvedUri }}
              className="w-16 h-16 rounded-full mr-4 bg-slate-200 dark:bg-slate-700"
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center mr-4">
              <Text className="text-xl font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                {item.name ? item.name.charAt(0) : "?"}
              </Text>
            </View>
          )}

          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {item.name || "Unknown Member"}
            </Text>
            <Text className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
              {item.role || item.position || "Member"}
            </Text>
            {item.email ? (
              <View className="flex-row items-center mt-1">
                <Ionicons name="mail-outline" size={14} color="#64748B" />
                <Text
                  className="text-xs text-slate-500 dark:text-slate-400 ml-1"
                  numberOfLines={1}
                >
                  {item.email}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Filter members based on search
  const filteredMembers = members.filter((member) => {
    if (
      countryFilter &&
      member.country?.toLowerCase() !== countryFilter.toLowerCase()
    ) {
      return false;
    }
    const memberRole = member.role || member.position || "";
    if (roleFilter && memberRole.toLowerCase() !== roleFilter.toLowerCase()) {
      return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (member.name && member.name.toLowerCase().includes(q)) ||
      (member.mobile && member.mobile.includes(q)) ||
      (member.country && member.country.toLowerCase().includes(q)) ||
      (member.email && member.email.toLowerCase().includes(q)) ||
      (memberRole && memberRole.toLowerCase().includes(q))
    );
  });

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 dark:bg-slate-900"
      edges={["top"]}
    >
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-slate-900 dark:text-white">
              Our Members
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 mt-1">
              Meet the team behind the organization.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/join")}
            className="flex-row items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full px-4 py-2 border border-emerald-200 dark:border-emerald-800"
          >
            <Ionicons name="person-add" size={18} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mt-5 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 shadow-sm mb-2">
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-2 text-base text-slate-900 dark:text-white h-10"
            placeholder="Search by name, country, or phone..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="p-1"
            >
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setFilterVisible(true)}
              className="p-1 bg-slate-100 dark:bg-slate-700 rounded-full w-8 h-8 items-center justify-center"
            >
              <Ionicons name="filter" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        className="flex-1"
        data={filteredMembers}
        keyExtractor={(item, index) =>
          item.id?.toString() || item._id?.toString() || index.toString()
        }
        renderItem={renderItem}
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="people-outline" size={64} color="#94A3B8" />
            <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center">
              No members found.
            </Text>
          </View>
        }
      />

      <Modal visible={filterVisible} transparent animationType="fade">
        <View className="flex-1 bg-slate-950/80 justify-end">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setFilterVisible(false)}
          />
          <View className="rounded-t-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">
                  Filter members
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  Filter by country or role.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setFilterVisible(false)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-2"
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Country
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {Array.from(
                    new Set(
                      members
                        .map((member) => member.country?.trim())
                        .filter(Boolean),
                    ),
                  )
                    .sort()
                    .map((country) => {
                      const selected = countryFilter === country;
                      return (
                        <TouchableOpacity
                          key={country}
                          onPress={() => {
                            setCountryFilter(selected ? "" : country);
                            setFilterVisible(false);
                          }}
                          className={`rounded-full border px-4 py-2 ${
                            selected
                              ? "border-emerald-500 bg-emerald-500/10"
                              : "border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-950"
                          }`}
                        >
                          <Text
                            className={`text-sm ${selected ? "text-emerald-700" : "text-slate-700 dark:text-slate-200"}`}
                          >
                            {country}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  {!members.some((member) => member.country?.trim()) && (
                    <Text className="text-sm text-slate-500">
                      No country data available.
                    </Text>
                  )}
                </View>
              </View>

              <View>
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Role / Position
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {Array.from(
                    new Set(
                      members
                        .map((member) => member.role || member.position)
                        .filter(Boolean),
                    ),
                  )
                    .sort()
                    .map((role) => {
                      const selected = roleFilter === role;
                      return (
                        <TouchableOpacity
                          key={role}
                          onPress={() => {
                            setRoleFilter(selected ? "" : role);
                            setFilterVisible(false);
                          }}
                          className={`rounded-full border px-4 py-2 ${
                            selected
                              ? "border-emerald-500 bg-emerald-500/10"
                              : "border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-950"
                          }`}
                        >
                          <Text
                            className={`text-sm ${selected ? "text-emerald-700" : "text-slate-700 dark:text-slate-200"}`}
                          >
                            {role}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  {!members.some(
                    (member) => member.role || member.position,
                  ) && (
                    <Text className="text-sm text-slate-500">
                      No role data available.
                    </Text>
                  )}
                </View>
              </View>

              <View className="flex-row items-center justify-between mt-4">
                <TouchableOpacity
                  onPress={() => {
                    setCountryFilter("");
                    setRoleFilter("");
                  }}
                  className="rounded-3xl border border-slate-300 bg-slate-100 px-4 py-2"
                >
                  <Text className="text-sm text-slate-700">Clear filters</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilterVisible(false)}
                  className="rounded-3xl bg-emerald-600 px-4 py-2"
                >
                  <Text className="text-sm font-semibold text-white">
                    Apply filters.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={detailVisible} transparent animationType="fade">
        <View className="flex-1 bg-slate-950/80 justify-center px-4">
          <View className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 shadow-2xl">
            <View className="flex-row items-start justify-between mb-4">
              <View>
                <Text className="text-xl font-bold text-slate-900 dark:text-white">
                  Member details
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Tap outside or close to dismiss.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setDetailVisible(false)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2"
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedMember ? (
              <View className="space-y-4">
                <View className="flex-row items-center gap-4 mb-4">
                  <View className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 items-center justify-center">
                    {selectedMember.image ? (
                      <Image
                        source={{
                          uri: selectedMember.image.startsWith("http")
                            ? selectedMember.image
                            : selectedMember.image.startsWith("/")
                              ? `https://middlealiyara.vercel.app${selectedMember.image}`
                              : `https://middlealiyara.vercel.app/${selectedMember.image}`,
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <Text className="text-3xl font-bold text-emerald-600">
                        {selectedMember.name?.charAt(0) || "?"}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-slate-900 dark:text-white">
                      {selectedMember.name || "Unknown Member"}
                    </Text>
                    <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      ID: {selectedMember.memberId || selectedMember._id}
                    </Text>
                    <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {selectedMember.country || "Country unavailable"}
                    </Text>
                  </View>
                </View>

                <View className="rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                  <View>
                    <Text className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Role
                    </Text>
                    <Text className="text-sm text-slate-900 dark:text-slate-100">
                      {selectedMember.role ||
                        selectedMember.position ||
                        "Not specified"}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Mobile
                    </Text>
                    <Text className="text-sm text-slate-900 dark:text-slate-100">
                      {selectedMember.mobile || "Not provided"}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Email
                    </Text>
                    <Text className="text-sm text-slate-900 dark:text-slate-100">
                      {selectedMember.email || "Not provided"}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Father Name
                    </Text>
                    <Text className="text-sm text-slate-900 dark:text-slate-100">
                      {selectedMember.fatherName || "Not provided"}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Blood Group
                    </Text>
                    <Text className="text-sm text-slate-900 dark:text-slate-100">
                      {selectedMember.bloodGroup || "Not provided"}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Social
                    </Text>
                    <Text className="text-sm text-slate-900 dark:text-slate-100">
                      {selectedMember.social?.whatsapp ||
                        selectedMember.social?.facebook ||
                        selectedMember.social?.email ||
                        "Not provided"}
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
