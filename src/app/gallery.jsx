import { View, Text, FlatList, RefreshControl, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { fetchGallery } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';

export default function GalleryScreen() {
  const [images, setImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  // Calculate image width for a 2-column grid
  const padding = 16;
  const gap = 12;
  const itemWidth = (width - padding * 2 - gap) / 2;

  const loadData = async (forceRefresh = false) => {
    try {
      const data = await fetchGallery(forceRefresh);
      if (data) setImages(data);
    } catch (error) {
      console.error('Failed to load gallery:', error);
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
    <View style={{ width: itemWidth, marginBottom: gap }} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700">
      <Image
        source={{ uri: item.url || item.imageUrl || item.image }}
        style={{ width: '100%', height: itemWidth }}
        className="bg-slate-200 dark:bg-slate-700"
        resizeMode="cover"
      />
      {item.title && (
        <View className="p-2">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white" numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <View className="px-4 pt-4 pb-4">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white">
          Gallery
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 mt-1">
          Moments from our journey.
        </Text>
      </View>
      
      <FlatList
        data={images}
        keyExtractor={(item, index) => item.id?.toString() || item._id?.toString() || index.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: gap }}
        contentContainerStyle={{ padding: padding }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 mt-10">
            <Ionicons name="images-outline" size={64} color="#94A3B8" />
            <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center">
              No images found in the gallery.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
