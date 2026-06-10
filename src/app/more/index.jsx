import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MoreScreen() {
  const router = useRouter();

  const menuItems = [
    {
      id: 'gallery',
      title: 'Gallery',
      icon: 'images-outline',
      color: 'bg-indigo-500',
      action: () => router.push('/gallery'),
    },
    {
      id: 'accounts',
      title: 'Accounts',
      icon: 'calculator-outline',
      color: 'bg-teal-500',
      action: () => router.push('/accounts'),
    },
    {
      id: 'about',
      title: 'About Us',
      icon: 'information-circle-outline',
      color: 'bg-emerald-500',
      action: () => router.push('/about'),
    },
    {
      id: 'join',
      title: 'Join Request',
      icon: 'person-add-outline',
      color: 'bg-blue-500',
      action: () => {},
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: 'mail-outline',
      color: 'bg-orange-500',
      action: () => {},
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      color: 'bg-gray-500',
      action: () => router.push('/more/settings'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
      <ScrollView className="flex-1 p-4">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-6">More</Text>
        
        <View className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.action}
              className={`flex-row items-center p-4 bg-white dark:bg-slate-800 active:bg-slate-50 dark:active:bg-slate-700 ${
                index !== menuItems.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''
              }`}
            >
              <View className={`w-10 h-10 rounded-full ${item.color} items-center justify-center mr-4`}>
                <Ionicons name={item.icon} size={20} color="white" />
              </View>
              <Text className="flex-1 text-lg font-semibold text-slate-900 dark:text-white">
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-12 items-center">
          <Text className="text-slate-500 dark:text-slate-400 text-sm">Middle Aliara App</Text>
          <Text className="text-slate-400 dark:text-slate-500 text-xs mt-1">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
