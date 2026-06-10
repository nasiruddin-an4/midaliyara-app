import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TARGETS = [
  { id: '01', title: 'দরিদ্র কল্যাণ', desc: 'অসহায় ও গরিব-দুঃখীদের পাশে দাঁড়িয়ে তাদের জীবনযাত্রার মান উন্নয়নে সরাসরি ও নিয়মিত আর্থিক সহায়তা।', icon: 'heart-outline', color: 'bg-rose-500' },
  { id: '02', title: 'খেলাধুলা ও সুস্থ বিনোদন', desc: 'বাচ্চাদেরকে মাদক থেকে দূরে রাখতে এলাকাভিত্তিক বিভিন্ন টুর্নামেন্ট ও ক্রীড়া সামগ্রী প্রদান।', icon: 'football-outline', color: 'bg-blue-500' },
  { id: '03', title: 'উন্নয়নমূলক কাজ', desc: 'এলাকার রাস্তাঘাট মেরামত ও সামাজিক অবকাঠামোসহ সার্বিক সামাজিক উন্নয়নমূলক কাজে সক্রিয় অংশ গ্রহণ।', icon: 'construct-outline', color: 'bg-emerald-500' },
  { id: '04', title: 'সামাজিক সাহায্য', desc: 'যেকোনো সামাজিক সংকট, প্রাকৃতিক দুর্যোগ বা জরুরি প্রয়োজনে তাৎক্ষণিক ফান্ডিং ও স্বেচ্ছাসেবক নিয়োগ।', icon: 'people-outline', color: 'bg-amber-500' },
  { id: '05', title: 'যুব উন্নয়ন', desc: 'যুবকদের কারিগরি দক্ষতা বৃদ্ধি ও সঠিক পথে পরিচালিত করতে নিয়মিত সেমিনার ও সচেতনতামূলক কার্যক্রম।', icon: 'trending-up-outline', color: 'bg-indigo-500' },
  { id: '06', title: 'ঐক্যবদ্ধ প্রবাস', desc: 'মধ্য আলীয়ারার সকল প্রবাসীদের একই প্ল্যাটফর্মে এনে আমাদের সম্মিলিত শক্তি ও প্রভাব বৃদ্ধি করা।', icon: 'earth-outline', color: 'bg-cyan-500' },
];

const PROCESS = [
  { step: '1', title: 'পরিকল্পনা', desc: 'সমাজের প্রকৃত সমস্যা চিহ্নিত করে সদস্যদের সাথে আলোচনার মাধ্যমে সমাধান নির্ধারণ।', icon: 'map-outline' },
  { step: '2', title: 'তহবিল সংগ্রহ', desc: 'স্বেচ্ছায় সদস্যদের অনুদানে একটি স্বচ্ছ কেন্দ্রীয় ডিজিটাল তহবিল গঠন।', icon: 'wallet-outline' },
  { step: '3', title: 'বাস্তবায়ন', desc: 'নির্বাচিত সদস্যদের তত্ত্বাবধানে সরাসরি ফিল্ডে উন্নয়নমূলক প্রজেক্ট পরিচালনা।', icon: 'hammer-outline' },
  { step: '4', title: 'পর্যালোচনা', desc: 'প্রতিটি কাজের ফলাফল এবং ব্যয়ের পুঙ্খানুপুঙ্খ রিপোর্ট সবার সামনে উপস্থাপন।', icon: 'search-outline' },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>


      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View className="px-6 py-8 items-center bg-emerald-600 dark:bg-slate-900 mb-4">
          <Text className="text-white font-bold text-lg mb-1 pt-1">আমাদের লক্ষ্য ও ভিশন </Text>
          <Text className="text-emerald-100 text-3xl font-bold text-center mb-1 ">
            আমরা এক উন্নত ও আদর্শ গ্রামের স্বপ্ন দেখি !
          </Text>
          <Text className="text-emerald-50 text-center text-sm leading-6 opacity-90 px-2">
            আমরা এমন একটি সমাজ গড়ার স্বপ্ন দেখি যেখানে মাদক, দারিদ্র্য এবং সামাজিক বৈষম্যের কোনো স্থান নেই। আমাদের প্রতিটি পদক্ষেপে থাকে স্বচ্ছতা এবং নিঃস্বার্থ সেবা।
          </Text>
        </View>

        {/* Quick Stats / Values */}
        <View className="flex-row justify-between px-6 -mt-8 mb-8 z-20">
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex-1 mr-2 items-center shadow-sm border border-slate-200 dark:border-slate-700">
            <Ionicons name="shield-checkmark" size={28} color="#10B981" className="mb-2" />
            <Text className="text-slate-900 dark:text-white font-bold text-center text-sm">সম্পূর্ণ স্বচ্ছতা</Text>
          </View>
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex-1 mx-2 items-center shadow-sm border border-slate-200 dark:border-slate-700">
            <Ionicons name="heart" size={28} color="#10B981" className="mb-2" />
            <Text className="text-slate-900 dark:text-white font-bold text-center text-sm">নিঃস্বার্থ সেবা</Text>
          </View>
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex-1 ml-2 items-center shadow-sm border border-slate-200 dark:border-slate-700">
            <Ionicons name="people" size={28} color="#10B981" className="mb-2" />
            <Text className="text-slate-900 dark:text-white font-bold text-center text-sm">+42 সদস্য</Text>
          </View>
        </View>

        {/* Core Priorities */}
        <View className="px-6 mb-10">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-6">প্রধান অগ্রাধিকার</Text>

          <View className="mb-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex-row shadow-sm dark:shadow-none">
            <View className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mr-4 mt-1">
              <Ionicons name="ban" size={24} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">মাদকমুক্ত সমাজ</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm leading-5">আমাদের এলাকাকে সম্পূর্ণরূপে মাদকমুক্ত করা এবং যুবসমাজকে ধ্বংসের হাত থেকে রক্ষা করা আমাদের প্রধান অগ্রাধিকার।</Text>
            </View>
          </View>

          <View className="mb-4 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex-row shadow-sm dark:shadow-none">
            <View className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 items-center justify-center mr-4 mt-1">
              <Ionicons name="sunny" size={24} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">সৌর বিদ্যুতের আলো</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm leading-5">সন্ধ্যার পরপরই গুরুত্বপূর্ণ মোড়ে সৌর বিদ্যুতের খুঁটি বসিয়ে এলাকাকে আরও নিরাপদ ও আলোকিত করা।</Text>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex-row shadow-sm dark:shadow-none">
            <View className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center mr-4 mt-1">
              <Ionicons name="gift" size={24} color="#6366F1" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">গোপন সহায়তা</Text>
              <Text className="text-slate-600 dark:text-slate-400 text-sm leading-5">যারা আত্মসম্মানের ভয়ে কারো কাছে সাহায্য চায় না, তাদেরকে চিহ্নিত করে গোপনে যথাযথ সহায়তা নিশ্চিত করা।</Text>
            </View>
          </View>
        </View>

        {/* Our Targets */}
        <View className="px-6 mb-10">
          <Text className="text-sm font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">আমাদের টার্গেট</Text>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-3">যৌথ প্রচেষ্টায় যা অর্জন করতে চাই</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm leading-5 mb-6">
            একটি শক্তিশালী গ্রাম মানে একটি ঐক্যবদ্ধ গ্রাম। আমাদের টার্গেটগুলো সাজানো হয়েছে সাধারণ মানুষের মৌলিক ও সামাজিক চাহিদা পূরণের জন্য।
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {TARGETS.map((item) => (
              <View key={item.id} className="w-[48%] bg-white dark:bg-slate-800 rounded-3xl p-5 mb-4 shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700">
                <View className="flex-row justify-between items-center mb-4">
                  <View className={`w-10 h-10 rounded-full ${item.color} items-center justify-center`}>
                    <Ionicons name={item.icon} size={20} color="#FFFFFF" />
                  </View>
                  <Text className="text-xl font-black text-slate-200 dark:text-slate-700">{item.id}</Text>
                </View>
                <Text className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs leading-5">{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Process */}
        <View className="px-6 mb-12">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">আমাদের কার্যপ্রক্রিয়া</Text>
          <Text className="text-slate-600 dark:text-slate-400 text-sm leading-5 mb-6">
            সম্পূর্ণ স্বচ্ছতা ও আধুনিক পদ্ধতির মাধ্যমে আমাদের প্রতিটি প্রজেক্ট পরিচালিত হয়।
          </Text>

          <View className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
            {PROCESS.map((proc, index) => (
              <View key={proc.step} className="flex-row mb-6 last:mb-0 relative">
                {/* Vertical Line Connector */}
                {index !== PROCESS.length - 1 && (
                  <View className="absolute left-[19px] top-10 bottom-[-30px] w-0.5 bg-emerald-100 dark:bg-slate-700 z-0" />
                )}

                <View className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 items-center justify-center mr-4 z-10 border-4 border-white dark:border-slate-800">
                  <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{proc.step}</Text>
                </View>
                <View className="flex-1 mt-1">
                  <Text className="text-lg font-bold text-slate-900 dark:text-white mb-1">{proc.title}</Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-sm leading-5">{proc.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
