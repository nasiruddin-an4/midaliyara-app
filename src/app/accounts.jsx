import { fetchExpenses, fetchPayments, fetchStats, verifyAccountAccess, fetchMembers } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BENGALI_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

const translateToBengaliDigits = (num) => {
  const digits = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).split('').map(char => digits[char] || char).join('');
};

const formatBengaliDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = BENGALI_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${translateToBengaliDigits(day)} ${month}, ${translateToBengaliDigits(year)}`;
  } catch (e) {
    return dateStr;
  }
};

const AvatarImage = ({ uri }) => {
  const [hasError, setHasError] = useState(false);

  let resolvedUri = uri;
  if (uri && !uri.startsWith('http')) {
    const path = uri.startsWith('/') ? uri : `/${uri}`;
    resolvedUri = `https://middlealiyara.vercel.app${path}`;
  }

  if (hasError || !resolvedUri) {
    return (
      <View className="w-12 h-12 rounded-full items-center justify-center mr-4 bg-emerald-100 dark:bg-emerald-900/30">
        <Ionicons name="arrow-down" size={24} color="#10B981" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: resolvedUri }}
      onError={() => setHasError(true)}
      className="w-12 h-12 rounded-full mr-4 border border-slate-200 dark:border-slate-700 bg-slate-150 dark:bg-slate-850"
      resizeMode="cover"
    />
  );
};

const LargeAvatarImage = ({ uri }) => {
  const [hasError, setHasError] = useState(false);

  let resolvedUri = uri;
  if (uri && !uri.startsWith('http')) {
    const path = uri.startsWith('/') ? uri : `/${uri}`;
    resolvedUri = `https://middlealiyara.vercel.app${path}`;
  }

  if (hasError || !resolvedUri) {
    return (
      <View className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/40 items-center justify-center mb-4">
        <Ionicons name="person" size={40} color="#10B981" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: resolvedUri }}
      onError={() => setHasError(true)}
      className="w-24 h-24 rounded-3xl mb-4 border-2 border-emerald-500 shadow-md bg-slate-100 dark:bg-slate-805"
      resizeMode="cover"
    />
  );
};

export default function AccountsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('income');
  const [refreshing, setRefreshing] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);

  // Security states
  const [isUnlocked, setIsUnlocked] = useState(null); // null = checking, false = locked, true = unlocked
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const loadData = async (forceRefresh = false) => {
    try {
      const [paymentsData, expensesData, statsData, membersData] = await Promise.all([
        fetchPayments(forceRefresh),
        fetchExpenses(forceRefresh),
        fetchStats(forceRefresh),
        fetchMembers(forceRefresh),
      ]);
      setIncomes(Array.isArray(paymentsData) ? paymentsData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setStats(statsData || null);
      setMembers(Array.isArray(membersData) ? membersData : []);
    } catch (error) {
      console.error('Failed to load accounts data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData(true);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const checkUnlockStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('@accounts_unlocked');
        if (status === 'true') {
          setIsUnlocked(true);
          loadData(false);
        } else {
          setIsUnlocked(false);
        }
      } catch (e) {
        setIsUnlocked(false);
      }
    };
    checkUnlockStatus();
  }, []);

  const handleUnlock = async () => {
    if (!passwordInput.trim()) {
      setErrorMsg('পাসওয়ার্ড লিখুন');
      return;
    }

    setVerifying(true);
    setErrorMsg('');

    try {
      const result = await verifyAccountAccess(passwordInput);
      if (result.success) {
        await AsyncStorage.setItem('@accounts_unlocked', 'true');
        setIsUnlocked(true);
        loadData(false);
      } else {
        setErrorMsg('ভুল পাসওয়ার্ড');
      }
    } catch (err) {
      setErrorMsg(err.message || 'সার্ভার ত্রুটি। আবার চেষ্টা করুন।');
    } finally {
      setVerifying(false);
    }
  };

  const handleLock = async () => {
    try {
      await AsyncStorage.removeItem('@accounts_unlocked');
      setIsUnlocked(false);
      setPasswordInput('');
      setErrorMsg('');
      setIncomes([]);
      setExpenses([]);
      setStats(null);
    } catch (e) {
      console.error('Failed to lock accounts:', e);
    }
  };

  const formatAmount = (num) => {
    try {
      const val = Number(num);
      if (isNaN(val)) return '0';
      const parts = val.toFixed(2).split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (parts[1] === '00') {
        return parts[0];
      }
      return parts.join('.');
    } catch (e) {
      return String(num);
    }
  };

  const totalIncome = stats?.finance?.totalCollected || 0;
  const totalExpense = stats?.finance?.totalExpenses || 0;
  const balance = stats?.finance?.balance || 0;

  const renderItem = (item, isIncome) => {
    try {
      if (!item) return null;

      const rawTitle = isIncome
        ? (item.memberName || item.member?.name || 'Anonymous Donation')
        : (item.category || item.title || 'Expense');

      const title = typeof rawTitle === 'string' ? rawTitle : String(rawTitle);

      let dateStr = '';
      if (item.date) {
        dateStr = formatBengaliDate(item.date);
      }

      let subtitle = '';
      if (isIncome) {
        if (item.month && item.year) {
          const monthName = BENGALI_MONTHS[item.month - 1] || '';
          const yearBengali = translateToBengaliDigits(item.year);
          subtitle = `${monthName} ${yearBengali} • ${item.source || 'Donation'}`;
        } else {
          subtitle = `Donation / Payment • ${item.source || 'Donation'}`;
        }
      } else {
        const rawSubtitle = item.description || 'Operational Cost';
        subtitle = typeof rawSubtitle === 'string' ? rawSubtitle : String(rawSubtitle);
      }

      const amount = Number(item.amount) || 0;
      const amountStr = formatAmount(amount);

      const imageUrl = isIncome ? (item.memberImage || item.member?.image) : null;
      const key = item._id ? String(item._id) : Math.random().toString();

      return (
        <TouchableOpacity
          key={key}
          onPress={() => setSelectedTx({ ...item, isIncome })}
          activeOpacity={0.7}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-slate-100 dark:border-slate-700 flex-row items-center"
        >
          {isIncome ? (
            <AvatarImage uri={imageUrl} />
          ) : (
            <View className="w-12 h-12 rounded-full items-center justify-center mr-4 bg-rose-100 dark:bg-rose-900/30">
              <Ionicons name="arrow-up" size={24} color="#F43F5E" />
            </View>
          )}

          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900 dark:text-white" numberOfLines={1}>{title}</Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400" numberOfLines={1}>{subtitle}</Text>
            {dateStr ? <Text className="text-xs text-slate-400 dark:text-slate-500 mt-1">{dateStr}</Text> : null}
          </View>

          {isIncome ? (
            <Text className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {`+৳${amountStr}`}
            </Text>
          ) : (
            <Text className="text-lg font-bold text-rose-600 dark:text-rose-400">
              {`-৳${amountStr}`}
            </Text>
          )}
        </TouchableOpacity>
      );
    } catch (err) {
      console.error('CRASH IN renderItem:', err);
      return (
        <View key={item?._id || Math.random().toString()} className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl mb-4 border border-red-200 dark:border-red-800">
          <Text className="text-red-600 dark:text-red-400 font-bold">Item Render Error: {err.message}</Text>
        </View>
      );
    }
  };

  const renderTransactions = () => {
    try {
      if (activeTab === 'income') {
        if (incomes && incomes.length > 0) {
          return incomes.map((item) => renderItem(item, true));
        }
        return (
          <View className="items-center justify-center py-10">
            <Ionicons name="wallet-outline" size={48} color="#94A3B8" />
            <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center">কোনো আয়ের রেকর্ড পাওয়া যায়নি।</Text>
          </View>
        );
      } else {
        if (expenses && expenses.length > 0) {
          return expenses.map((item) => renderItem(item, false));
        }
        return (
          <View className="items-center justify-center py-10">
            <Ionicons name="receipt-outline" size={48} color="#94A3B8" />
            <Text className="text-slate-500 dark:text-slate-400 mt-4 text-center">কোনো খরচের রেকর্ড পাওয়া যায়নি।</Text>
          </View>
        );
      }
    } catch (err) {
      console.error('CRASH IN renderTransactions:', err);
      return (
        <View className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
          <Text className="text-red-600 dark:text-red-400 font-bold">Transactions Render Error: {err.message}</Text>
        </View>
      );
    }
  };

  if (isUnlocked === null) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  if (isUnlocked === false) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700 mr-4"
          >
            <Ionicons name="arrow-back" size={20} color="#10B981" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-900 dark:text-white">হিসাব নিকাশ</Text>
        </View>

        {/* Lock Form */}
        <View className="flex-1 justify-center items-center px-6 pb-20">
          <View className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-md border border-slate-100 dark:border-slate-700 items-center">
            <View className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mb-6">
              <Ionicons name="shield-checkmark" size={32} color="#10B981" />
            </View>

            <Text className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              সুরক্ষিত পাতা
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
              অ্যাকাউন্টস পেজটি দেখতে দয়া করে পাসওয়ার্ড দিন।
            </Text>

            <TextInput
              secureTextEntry
              value={passwordInput}
              onChangeText={(text) => {
                setPasswordInput(text);
                setErrorMsg('');
              }}
              placeholder="পাসওয়ার্ড লিখুন"
              placeholderTextColor="#94A3B8"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 text-center text-lg tracking-widest mb-4"
              autoFocus
              onSubmitEditing={handleUnlock}
            />

            {errorMsg ? (
              <View className="w-full bg-red-50 dark:bg-red-950/20 py-2.5 rounded-xl mb-4 border border-red-200 dark:border-red-900">
                <Text className="text-red-650 dark:text-red-400 text-center text-sm font-medium">
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleUnlock}
              disabled={verifying}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 dark:bg-emerald-700 items-center justify-center shadow-md flex-row"
            >
              {verifying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text className="text-white font-bold text-base ml-2">প্রবেশ করুন</Text>
                </>
              )}
            </TouchableOpacity>

            <Text className="text-xs text-slate-400 dark:text-slate-500 text-center mt-6">
              শুধুমাত্র অনুমোদিত সদস্যদের জন্য।
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const renderDetailsModal = () => {
    if (!selectedTx) return null;

    if (selectedTx.isIncome) {
      const targetMember = members.find(m => String(m.memberId) === String(selectedTx.memberId));
      const memberIncomes = incomes.filter(inc => String(inc.memberId) === String(selectedTx.memberId));

      const targetYear = selectedTx.year || new Date().getFullYear();
      const incomesThisYear = memberIncomes.filter(tx => Number(tx.year) === Number(targetYear));

      const totalPaidAmount = memberIncomes.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
      const paidMonthsCount = new Set(memberIncomes.map(tx => Number(tx.month)).filter(m => m >= 1 && m <= 12)).size;

      const paidMonthsThisYear = incomesThisYear.map(tx => Number(tx.month)).filter(m => m >= 1 && m <= 12);
      const uniquePaidMonthsThisYearCount = new Set(paidMonthsThisYear).size;

      const shortMonths = ['জানু', 'ফেব', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলা', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];

      let resolvedUri = null;
      const rawUri = targetMember?.image || selectedTx.memberImage || selectedTx.member?.image;
      if (rawUri) {
        if (!rawUri.startsWith('http')) {
          const path = rawUri.startsWith('/') ? rawUri : `/${rawUri}`;
          resolvedUri = `https://middlealiyara.vercel.app${path}`;
        } else {
          resolvedUri = rawUri;
        }
      }

      return (
        <Modal visible={!!selectedTx} animationType="slide" transparent={true} onRequestClose={() => setSelectedTx(null)}>
          <View className="flex-1 bg-black/60 justify-end">
            <TouchableOpacity style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} activeOpacity={1} onPress={() => setSelectedTx(null)} />

            <View className="bg-slate-50 dark:bg-slate-900 rounded-t-[36px] h-[90%] overflow-hidden shadow-2xl z-10">
              {/* Header Section */}
              <View className="bg-[#0B3B24] pt-10 pb-8 px-6 items-center relative">
                <TouchableOpacity onPress={() => setSelectedTx(null)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/20 items-center justify-center z-10">
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <View className="w-24 h-24 rounded-3xl bg-white/10 p-1 mb-4 border border-white/20 overflow-hidden">
                  {resolvedUri ? (
                    <Image source={{ uri: resolvedUri }} className="w-full h-full rounded-2xl" resizeMode="cover" />
                  ) : (
                    <View className="w-full h-full rounded-2xl bg-emerald-900 items-center justify-center">
                      <Ionicons name="person" size={40} color="#10B981" />
                    </View>
                  )}
                </View>

                <Text className="text-2xl font-bold text-white mb-4 text-center">
                  {targetMember?.name || selectedTx.memberName || 'অননুমোদিত সদস্য'}
                </Text>

                <View className="flex-row flex-wrap justify-center gap-2 mb-3">
                  {targetMember?.country ? (
                    <View className="flex-row items-center bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                      <Ionicons name="location-outline" size={14} color="#A7F3D0" />
                      <Text className="text-emerald-50 text-xs ml-1.5">{targetMember.country}</Text>
                    </View>
                  ) : null}

                  {targetMember?.social?.phone || targetMember?.social?.mobile ? (
                    <View className="flex-row items-center bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                      <Ionicons name="call-outline" size={14} color="#A7F3D0" />
                      <Text className="text-emerald-50 text-xs ml-1.5">{targetMember.social.phone || targetMember.social.mobile}</Text>
                    </View>
                  ) : null}

                  {targetMember?.bloodGroup ? (
                    <View className="flex-row items-center bg-rose-500/20 px-3 py-1.5 rounded-full border border-rose-500/30">
                      <Ionicons name="water" size={14} color="#FDA4AF" />
                      <Text className="text-rose-100 text-xs font-bold ml-1.5">{targetMember.bloodGroup}</Text>
                    </View>
                  ) : null}
                </View>

                {targetMember?.social?.email ? (
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="mail" size={14} color="#A7F3D0" />
                    <Text className="text-emerald-100/80 text-xs ml-2">{targetMember.social.email}</Text>
                  </View>
                ) : null}
              </View>

              <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                {/* Stats Cards */}
                <View className="flex-row justify-between mb-6 gap-x-4">
                  <View className="flex-1 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-3xl p-5 items-center border border-emerald-100 dark:border-emerald-900/30">
                    <Text className="text-2xl mb-2">💰</Text>
                    <Text className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                      ৳{formatAmount(totalPaidAmount)}
                    </Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center">সর্বমোট প্রদান</Text>
                  </View>
                  <View className="flex-1 bg-blue-50/50 dark:bg-blue-950/30 rounded-3xl p-5 items-center border border-blue-100 dark:border-blue-900/30">
                    <Text className="text-2xl mb-2">📅</Text>
                    <Text className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">
                      {translateToBengaliDigits(paidMonthsCount)}
                    </Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center">পরিশোধিত মাস</Text>
                  </View>
                </View>

                {/* Year Summary */}
                <View className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm mb-6">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 items-center justify-center mr-3">
                        <Ionicons name="calendar" size={16} color="#10B981" />
                      </View>
                      <View>
                        <Text className="text-base font-bold text-slate-900 dark:text-white">
                          {translateToBengaliDigits(targetYear)} সালের বিবরণ
                        </Text>
                        <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {translateToBengaliDigits(uniquePaidMonthsThisYearCount)}/১২ মাস পরিশোধিত
                        </Text>
                      </View>
                    </View>
                    <Text className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ৳{formatAmount(incomesThisYear.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0))}
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
                    <View
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(uniquePaidMonthsThisYearCount / 12) * 100}%` }}
                    />
                  </View>

                  {/* Months Grid */}
                  <View className="flex-row flex-wrap justify-between">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                      const txForMonth = incomesThisYear.find(tx => Number(tx.month) === m);
                      if (txForMonth) {
                        return (
                          <View key={m} className="w-[31%] aspect-square bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl mb-3 border border-emerald-200 dark:border-emerald-800/50 items-center justify-center p-2">
                            <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-1">{shortMonths[m - 1]}</Text>
                            <View className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 items-center justify-center mb-1">
                              <Ionicons name="checkmark" size={12} color="#10B981" />
                            </View>
                            <Text className="text-emerald-700 dark:text-emerald-400 text-[10px] font-black">
                              ৳{translateToBengaliDigits(txForMonth.amount)}
                            </Text>
                            <Text className="text-emerald-600/70 dark:text-emerald-500/70 text-[9px] mt-0.5">
                              {txForMonth.source || 'অন্যান্য'}
                            </Text>
                          </View>
                        );
                      } else {
                        return (
                          <View key={m} className="w-[31%] aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-3 border border-slate-200 dark:border-slate-700 items-center justify-center p-2">
                            <Text className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">{shortMonths[m - 1]}</Text>
                            <View className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 items-center justify-center mb-1">
                              <View className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                            </View>
                            <Text className="text-slate-400 dark:text-slate-500 text-[10px] font-medium">বকেয়া</Text>
                          </View>
                        );
                      }
                    })}
                  </View>
                </View>

                <View className="h-8" />
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    } else {
      // -----------------------------------------
      // EXPENSE MODAL
      // -----------------------------------------
      const title = selectedTx.category || selectedTx.title || 'খরচ';
      const dateFormatted = selectedTx.date ? formatBengaliDate(selectedTx.date) : '';
      const amountStr = formatAmount(Number(selectedTx.amount) || 0);

      return (
        <Modal visible={!!selectedTx} animationType="slide" transparent={true} onRequestClose={() => setSelectedTx(null)}>
          <View className="flex-1 bg-black/60 justify-end">
            <TouchableOpacity style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} activeOpacity={1} onPress={() => setSelectedTx(null)} />

            <View className="bg-white dark:bg-slate-900 rounded-t-[36px] max-h-[85%] pb-8 border-t border-slate-100 dark:border-slate-800 shadow-2xl z-10">
              <View className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full self-center my-4" />

              <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <View className="items-center mb-6">
                  <View className="w-24 h-24 rounded-3xl bg-rose-100 dark:bg-rose-950/40 items-center justify-center mb-4">
                    <Ionicons name="receipt" size={48} color="#F43F5E" />
                  </View>

                  <Text className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2" numberOfLines={2}>
                    {title}
                  </Text>

                  <Text className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-full">
                    ব্যয় (Expense)
                  </Text>
                </View>

                <View className="rounded-3xl p-5 items-center mb-6 border bg-rose-50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30">
                  <Text className="text-xs font-bold uppercase tracking-widest mb-1.5 text-rose-600 dark:text-rose-550">
                    মোট খরচ
                  </Text>
                  <Text className="text-3xl font-black text-rose-600 dark:text-rose-400">
                    ৳{amountStr}
                  </Text>
                </View>

                <View className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 mb-6">
                  {selectedTx.category ? (
                    <View className="flex-row justify-between items-center py-2.5 border-b border-slate-200 dark:border-slate-700/60">
                      <Text className="text-sm text-slate-500 dark:text-slate-400">খরচের খাত</Text>
                      <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedTx.category}</Text>
                    </View>
                  ) : null}

                  <View className="flex-row justify-between items-center py-2.5 border-b border-slate-200 dark:border-slate-700/60">
                    <Text className="text-sm text-slate-500 dark:text-slate-400">তারিখ</Text>
                    <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">{dateFormatted || 'N/A'}</Text>
                  </View>

                  {selectedTx.description ? (
                    <View className="py-2.5">
                      <Text className="text-sm text-slate-550 dark:text-slate-400 mb-1.5">বিস্তারিত বিবরণ</Text>
                      <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-6">
                        {selectedTx.description}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {selectedTx.items && selectedTx.items.length > 0 ? (
                  <View className="mb-6">
                    <Text className="text-base font-bold text-slate-900 dark:text-white mb-3 pl-1">
                      পণ্য/সেবার বিবরণ (Items Breakdown)
                    </Text>
                    <View className="bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <View className="flex-row bg-slate-100 dark:bg-slate-700 px-4 py-3 border-b border-slate-200 dark:border-slate-600">
                        <Text className="flex-[2] text-xs font-bold text-slate-500 dark:text-slate-400">নাম</Text>
                        <Text className="flex-1 text-xs font-bold text-slate-500 dark:text-slate-400 text-center">পরিমাণ</Text>
                        <Text className="flex-1 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">মূল্য</Text>
                      </View>

                      {selectedTx.items.map((goodsItem, idx) => {
                        const itemTotal = (goodsItem.qty || 1) * (goodsItem.unitPrice || 0);
                        const qtyFormatted = translateToBengaliDigits(goodsItem.qty || 1);
                        const totalFormatted = translateToBengaliDigits(itemTotal);

                        return (
                          <View key={idx} className="flex-row px-4 py-3 border-b border-slate-200 dark:border-slate-700/60 last:border-0">
                            <Text className="flex-[2] text-sm text-slate-800 dark:text-slate-200 font-medium" numberOfLines={2}>
                              {goodsItem.itemName}
                            </Text>
                            <Text className="flex-1 text-sm text-slate-600 dark:text-slate-400 text-center">
                              {qtyFormatted}
                            </Text>
                            <Text className="flex-1 text-sm text-slate-800 dark:text-slate-200 text-right font-bold">
                              ৳{totalFormatted}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ) : null}

                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setSelectedTx(null)}
                  className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700 active:opacity-80 mt-2"
                >
                  <Text className="text-slate-700 dark:text-slate-300 font-bold text-base">বন্ধ করুন </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    }
  };

  return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700 mr-4"
            >
              <Ionicons name="arrow-back" size={20} color="#10B981" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-slate-900 dark:text-white">হিসাব নিকাশ</Text>
          </View>

          {/* Lock button */}
          <TouchableOpacity
            onPress={handleLock}
            className="w-10 h-10 rounded-full bg-slate-150 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700"
          >
            <Ionicons name="lock-closed-outline" size={18} color="#F43F5E" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />}
        >
          {/* Summary Card */}
          <View className="px-6 py-6">
            <View className="bg-emerald-600 dark:bg-emerald-800 rounded-3xl p-6 shadow-md border border-emerald-500 dark:border-emerald-700">
              <Text className="text-emerald-100 font-medium mb-1 text-center">বর্তমান ব্যালেন্স</Text>
              <Text className="text-white text-4xl font-black text-center mb-6 tracking-wide">
                ৳{formatAmount(balance)}
              </Text>

              <View className="flex-row justify-between bg-emerald-700/50 dark:bg-emerald-900/50 p-4 rounded-2xl">
                <View className="flex-1 items-center border-r border-emerald-500/30">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="arrow-down-circle" size={16} color="#A7F3D0" />
                    <Text className="text-emerald-100 text-xs font-bold ml-1">মোট জমা</Text>
                  </View>
                  <Text className="text-white text-lg font-bold">৳{formatAmount(totalIncome)}</Text>
                </View>
                <View className="flex-1 items-center">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="arrow-up-circle" size={16} color="#FDA4AF" />
                    <Text className="text-emerald-100 text-xs font-bold ml-1">মোট খরচ</Text>
                  </View>
                  <Text className="text-white text-lg font-bold">৳{formatAmount(totalExpense)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="px-6 mb-4">
            <View className="flex-row bg-slate-200 dark:bg-slate-800 p-1 rounded-full">
              {activeTab === 'income' ? (
                <View className="flex-1 py-3 rounded-full items-center bg-white dark:bg-slate-700 shadow-sm">
                  <Text className="font-bold text-slate-900 dark:text-white">
                    আয় (Income)
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setActiveTab('income')}
                  className="flex-1 py-3 rounded-full items-center"
                >
                  <Text className="font-bold text-slate-500 dark:text-slate-400">
                    আয় (Income)
                  </Text>
                </TouchableOpacity>
              )}

              {activeTab === 'expenses' ? (
                <View className="flex-1 py-3 rounded-full items-center bg-white dark:bg-slate-700 shadow-sm">
                  <Text className="font-bold text-slate-900 dark:text-white">
                    ব্যয় (Expenses)
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setActiveTab('expenses')}
                  className="flex-1 py-3 rounded-full items-center"
                >
                  <Text className="font-bold text-slate-500 dark:text-slate-400">
                    ব্যয় (Expenses)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Transactions List */}
          <View className="px-6 pb-10">
            {renderTransactions()}
          </View>
        </ScrollView>

        {/* Render Details Modal */}
        {renderDetailsModal()}
      </SafeAreaView>
    );
  }
