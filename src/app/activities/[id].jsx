import { fetchActivityById } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchActivityById(id);
      if (data) setActivity(data);
      setLoading(false);
    };
    if (id) loadData();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  if (!activity) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900 justify-center items-center p-4">
        <Ionicons name="warning-outline" size={64} color="#EF4444" />
        <Text className="text-xl font-bold text-slate-900 dark:text-white mt-4 text-center">
          Activity Not Found
        </Text>
        <TouchableOpacity
          className="mt-6 bg-emerald-500 py-3 px-6 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      {/* Sticky Header with back button */}
      <View className="flex-row items-center p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#10B981" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900 dark:text-white flex-1" numberOfLines={1}>
          Activity Details
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Content */}
        <View className="p-4">
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 mb-6">
            <View className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center mb-4">
              <Ionicons name="calendar" size={32} color="#10B981" />
            </View>

            <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {activity.title}
            </Text>

            {activity.date && (
              <View className="flex-row items-center mb-4">
                <Ionicons name="time-outline" size={16} color="#64748B" />
                <Text className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">
                  {new Date(activity.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
            )}

            <View className="h-[1px] bg-slate-200 dark:bg-slate-700 w-full my-4" />

            <Text className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {activity.description || 'No description provided for this activity.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
