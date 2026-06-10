import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { fetchActivities } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (forceRefresh = false) => {
    try {
      const data = await fetchActivities(forceRefresh);
      if (data) setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData(true);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData(false);
  }, []);

  const renderItem = ({ item }) => (
    <Link href={`/activities/${item.id || item._id}`} asChild>
      <TouchableOpacity className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4 shadow-sm border border-slate-200 dark:border-slate-700 flex-row items-center">
        <View className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-4">
          <Ionicons name="calendar" size={28} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {item.title}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400 mb-2" numberOfLines={2}>
            {item.description || 'No description available.'}
          </Text>
          {item.date && (
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <View className="px-4 pt-4 pb-2">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white">
          Activities
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 mt-1">
          Discover events and initiatives.
        </Text>
      </View>
      
      <FlatList
        data={activities}
        keyExtractor={(item, index) => item.id?.toString() || item._id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="calendar-outline" size={64} color="#94A3B8" />
            <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center">
              No activities found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
