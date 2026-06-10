import { useUser } from '@/context/UserContext';
import { fetchStats } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DUMMY_GALLERY_IMAGES = [
  { id: '1', src: require('../../assets/10008.jpg') },
  { id: '2', src: require('../../assets/10009.jpg') },
  { id: '3', src: require('../../assets/10010.jpg') },
  { id: '4', src: require('../../assets/10011.jpg') },
  { id: '5', src: require('../../assets/10012.webp') },
];

const AutoPlayGallery = () => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= DUMMY_GALLERY_IMAGES.length) {
        nextIndex = 0;
      }
      const itemWidth = width * 0.85 + 16;
      flatListRef.current?.scrollToOffset({ offset: nextIndex * itemWidth, animated: true });
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const renderItem = ({ item }) => (
    <View className="mx-2 rounded-3xl overflow-hidden shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" style={{ width: width * 0.85, height: 200 }}>
      <Image source={item.src} className="w-full h-full" resizeMode="cover" />
    </View>
  );

  return (
    <View className="mb-8">
      <View className="px-6 flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Image Gallery</Text>
        <Link href="/gallery" asChild>
          <TouchableOpacity>
            <Text className="text-emerald-600 dark:text-emerald-500 font-semibold text-sm">See all</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <FlatList
        ref={flatListRef}
        data={DUMMY_GALLERY_IMAGES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.85 + 16}
        decelerationRate="fast"
        contentContainerClassName="px-4"
        onMomentumScrollEnd={(event) => {
          const itemWidth = width * 0.85 + 16;
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
          setActiveIndex(newIndex);
        }}
      />
    </View>
  );
};


export default function HomeScreen() {
  const { userName, userImage, isUserLoaded } = useUser();
  const [recentActivities, setRecentActivities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isUserLoaded && !userName) {
      router.replace('/welcome');
    }
  }, [isUserLoaded, userName, router]);

  const loadData = async (forceRefresh = false) => {
    try {
      const statsData = await fetchStats(forceRefresh);
      if (statsData && statsData.recentActivities) {
        setRecentActivities(statsData.recentActivities);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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

  // Prevent rendering the Home Screen prematurely if we need to redirect
  if (!isUserLoaded || !userName) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900 justify-center items-center">
        {/* Empty view during fast redirect to prevent flash */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View className="flex-row items-center">
          <View>
            <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">Hello,</Text>
            <Text className="text-slate-900 dark:text-white text-xl font-bold">{userName || 'Guest'}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => alert('Notifications coming soon!')}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center relative border border-slate-200 dark:border-slate-700"
          >
            <Ionicons name="notifications" size={20} color="#64748B" />
            <View className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/profile')}
            activeOpacity={0.7}
            className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 items-center justify-center border border-slate-300 dark:border-slate-700 overflow-hidden"
          >
            {userImage ? (
              <Image source={{ uri: userImage }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Ionicons name="person" size={24} color="#64748B" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
        }
      >
        {/* Hero Banner */}
        <View className="px-4 mb-8">
          <View className="rounded-3xl overflow-hidden shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700">
            <ImageBackground
              source={require('../../assets/heroBg.jpg')}
              className="w-full h-48 justify-end"
            >
              {/* Overlay Gradient equivalent using a View */}
              <View className="absolute inset-0 bg-slate-900/40" />

              <View className="p-6 relative z-10">
                <Text className="text-white text-2xl font-extrabold mb-1 drop-shadow-md">
                  What Do You Want To
                </Text>
                <Text className="text-amber-400 text-2xl font-extrabold mb-4 drop-shadow-md">
                  Donate Today?
                </Text>

                <TouchableOpacity
                  onPress={() => router.push('/donate')}
                  className="bg-emerald-600 dark:bg-emerald-500 py-3 px-6 rounded-full self-start flex-row items-center shadow-sm"
                >
                  <Text className="text-white font-bold mr-2">Donate Now</Text>
                  <Ionicons name="heart" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>

        {/* Organization Info Section */}
        <View className="px-6 mb-8 mt-2 items-center">
          <Text className="text-xl font-bold text-emerald-600 dark:text-emerald-500 text-center mb-2 leading-8">
            মধ্য আলীয়ারা যুব কল্যাণ সংগঠন ও প্রবাসী ঐক্য পরিষদ  ঐক্যে শক্তি, লক্ষ্যে অবিচল
          </Text>
        </View>

        {/* Activities Carousel Section */}
        <View className="mb-6">
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Activities
            </Text>
            <TouchableOpacity onPress={() => router.push('/activities')}>
              <Text className="text-emerald-600 dark:text-emerald-500 font-semibold text-sm">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4"
            snapToInterval={width * 0.75 + 16}
            decelerationRate="fast"
          >
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <Link key={activity.id || activity._id || idx} href={`/activities/${activity.id || activity._id}`} asChild>
                  <TouchableOpacity
                    className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden mx-2 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none"
                    style={{ width: width * 0.75 }}
                  >
                    <View className="h-32 bg-slate-100 dark:bg-slate-700 relative">
                      <View className="absolute inset-0 bg-emerald-100/50 dark:bg-emerald-900/40 items-center justify-center">
                        <Ionicons name="images-outline" size={40} color="#94A3B8" />
                      </View>
                    </View>
                    <View className="p-5">
                      <Text className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1 uppercase tracking-wider">
                        {new Date(activity.date || Date.now()).toLocaleDateString('en-GB')}
                      </Text>
                      <Text className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight" numberOfLines={2}>
                        {activity.title}
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium mr-1">Read more</Text>
                        <Ionicons name="arrow-forward" size={14} color="#64748B" />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))
            ) : (
              <View className="px-6 py-8 items-center w-full">
                <Text className="text-center text-slate-500 dark:text-slate-400">
                  No recent activities found.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Our Commitment Section */}
        <View className="px-4 mb-8">
          <View className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 items-center justify-center mr-3">
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              </View>
              <View>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">আমাদের অঙ্গীকার</Text>
                <Text className="text-sm font-medium text-emerald-600 dark:text-emerald-400">মধ্য আলীয়ারা যুব ও প্রবাসীদের একতা</Text>
              </View>
            </View>

            <Text className="text-slate-600 dark:text-slate-300 mb-5 leading-6 text-sm">
              কচুয়া উপজেলার মধ্য আলীয়ারা গ্রামের যুবসমাজ ও প্রবাসীদের সম্মিলিত শক্তিতে একটি সমৃদ্ধ এলাকা গড়াই আমাদের মূল লক্ষ্য।
            </Text>

            <View className="space-y-3">
              {[
                "মাদকমুক্ত সমাজ গঠন ও যুবকদের উন্নয়ন",
                "গ্রামের প্রতিটি কোণে সৌর বিদ্যুতের ব্যবস্থা",
                "অসহায়দের গোপনে আর্থিক ও সামাজিক সহায়তা",
                "রিয়েল-টাইম আর্থিক স্বচ্ছতা ও জবাবদিহিতা"
              ].map((item, index) => (
                <View key={index} className="flex-row items-start mb-3">
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" className="mr-2 mt-0.5" />
                  <Text className="text-slate-700 dark:text-slate-200 text-sm ml-2 flex-1 leading-5">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Auto Play Image Gallery */}
        <AutoPlayGallery />

      </ScrollView>
    </SafeAreaView>
  );
}