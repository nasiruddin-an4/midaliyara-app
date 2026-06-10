import { View, Text } from 'react-native';

export function HintRow({ title = 'Try editing', hint = 'app/index.jsx' }) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {title}
      </Text>
      <View className="bg-white dark:bg-gray-700 rounded-md py-1 px-2">
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {hint}
        </Text>
      </View>
    </View>
  );
}