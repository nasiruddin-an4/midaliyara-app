import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

export default function DonateScreen() {
  const router = useRouter();

  const copyToClipboard = async (text, type) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', `${type} copied to clipboard!`);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700 mr-4"
        >
          <Ionicons name="arrow-back" size={20} color="#64748B" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 dark:text-white">অনুদান</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="bg-white dark:bg-slate-800 rounded-3xl p-8 items-center border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none mb-6">
          <View className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full items-center justify-center mb-4">
            <Ionicons name="heart" size={40} color="#10B981" />
          </View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
            আপনার অনুদান আমাদের সমাজের উন্নয়নে সরাসরি কাজে লাগে !
          </Text>
          <Text className="text-center text-slate-500 dark:text-slate-400 mb-6 leading-6">
            এটি শিক্ষা, স্বাস্থ্য, এবং প্রয়োজনীয় সহায়তার মাধ্যমে মানুষের জীবনযাত্রার মান উন্নয়নে সাহায্য করে।
          </Text>

          {/* Payment Methods */}
          <View className="w-full mt-2">

            {/* bKash */}
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => copyToClipboard('01815654292', 'bKash Number')}
              className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex-row items-center border border-slate-100 dark:border-slate-700/50 mb-3"
            >
              <View className="w-12 h-12 bg-pink-100 dark:bg-pink-900/40 rounded-full items-center justify-center mr-4">
                <Ionicons name="phone-portrait-outline" size={24} color="#EC4899" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-white font-bold text-lg">বিকাশ (পার্সোনাল)</Text>
                <Text className="text-slate-600 dark:text-slate-400 font-bold text-base tracking-widest mt-0.5">01815654292</Text>
              </View>
              <Ionicons name="copy-outline" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Nagad */}
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => copyToClipboard('01815654292', 'Nagad Number')}
              className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex-row items-center border border-slate-100 dark:border-slate-700/50 mb-6"
            >
              <View className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-full items-center justify-center mr-4">
                <Ionicons name="phone-portrait-outline" size={24} color="#F97316" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 dark:text-white font-bold text-lg">নগদ (পার্সোনাল)</Text>
                <Text className="text-slate-600 dark:text-slate-400 font-bold text-base tracking-widest mt-0.5">01815654292</Text>
              </View>
              <Ionicons name="copy-outline" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* Contact */}
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => copyToClipboard('+8801815654292', 'Contact Number')}
              className="w-full bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 items-center border border-emerald-200 dark:border-emerald-800/50"
            >
              <Ionicons name="call" size={24} color="#10B981" className="mb-2" />
              <Text className="text-slate-800 dark:text-slate-200 font-bold text-center mb-1 text-base">
                যেকোনো প্রয়োজনে যোগাযোগ করুন
              </Text>
              <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-xl tracking-wider">
                +880 1815654292
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="copy-outline" size={16} color="#10B981" className="mr-1" />
                <Text className="text-emerald-600 dark:text-emerald-400 font-medium">Copy Number</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
