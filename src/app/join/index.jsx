import { submitMemberApplication, uploadJoinProfileImage } from "@/lib/api";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [profession, setProfession] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [localProfileImage, setLocalProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit = fullName.trim() && phone.trim() && address.trim();

  const handleProfileImageUpload = async (uri) => {
    setUploadingImage(true);
    try {
      const response = await uploadJoinProfileImage(uri);
      if (response?.url) {
        setProfileImage(response.url);
        setStatusMessage("Image uploaded successfully.");
      } else {
        throw new Error("Upload failed. Please try again.");
      }
    } catch (error) {
      setStatusMessage(error?.message || "Unable to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const pickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setStatusMessage("Permission required to select an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || result.cancelled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setLocalProfileImage(asset.uri);
    await handleProfileImageUpload(asset.uri);
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      await submitMemberApplication({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        email: email.trim(),
        profession: profession.trim(),
        bloodGroup: bloodGroup.trim(),
        profileImage: profileImage.trim(),
      });
      setSuccess(true);
      setStatusMessage(
        "Your join request has been sent successfully. Thank you!",
      );
    } catch (error) {
      setStatusMessage(
        error?.message ||
          "Unable to submit the form right now. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="pt-6 px-4 pb-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6 rounded-[32px] bg-slate-900/95 border border-slate-800 shadow-2xl shadow-slate-950/40 p-5">
            <Text className="text-3xl font-bold text-white">
              Join as a member
            </Text>
            <Text className="mt-2 text-slate-400 text-base leading-6">
              Share your details and we will contact you about membership
              opportunities.
            </Text>
            <View className="mt-4 rounded-3xl bg-slate-800/80 border border-slate-700 px-4 py-3">
              <Text className="text-sm font-medium text-slate-300">
                Required fields are marked with *
              </Text>
            </View>
          </View>

          <View className="space-y-5 rounded-[32px] bg-slate-900/95 border border-slate-800 shadow-2xl shadow-slate-950/20 p-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-slate-400">Have a question?</Text>
                <Text className="text-white font-semibold text-lg">
                  We’re here to help.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.back()}
                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2"
              >
                <Text className="text-sm text-slate-200">Close</Text>
              </TouchableOpacity>
            </View>

            {success ? (
              <View className="rounded-[28px] bg-emerald-600/10 border border-emerald-500/20 p-5">
                <Text className="text-2xl font-bold text-emerald-300">
                  Request sent
                </Text>
                <Text className="mt-3 text-slate-300 leading-6">
                  {statusMessage}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/members")}
                  className="mt-6 rounded-3xl bg-emerald-500 px-5 py-4 items-center"
                >
                  <Text className="text-white font-semibold">
                    Back to Members
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-semibold text-slate-300 mb-2">
                    Full name <Text className="text-emerald-400">*</Text>
                  </Text>
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#94A3B8"
                    className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white"
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-slate-300 mb-2">
                    Email address
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-slate-300 mb-2">
                    Phone / Mobile <Text className="text-emerald-400">*</Text>
                  </Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white"
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-slate-300 mb-2">
                    Address <Text className="text-emerald-400">*</Text>
                  </Text>
                  <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter your present/permanent address"
                    placeholderTextColor="#94A3B8"
                    className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white"
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-slate-300 mb-2">
                    Father Name
                  </Text>
                  <TextInput
                    value={fatherName}
                    onChangeText={setFatherName}
                    placeholder="Enter father's name"
                    placeholderTextColor="#94A3B8"
                    className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white"
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-slate-300 mb-2">
                    Mother Name
                  </Text>
                  <TextInput
                    value={motherName}
                    onChangeText={setMotherName}
                    placeholder="Enter mother's name"
                    placeholderTextColor="#94A3B8"
                    className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white"
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-slate-300 mb-2">
                    Profession
                  </Text>
                  <TextInput
                    value={profession}
                    onChangeText={setProfession}
                    placeholder="Enter your profession"
                    placeholderTextColor="#94A3B8"
                    className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white"
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-slate-300 mb-2">
                    Blood Group
                  </Text>
                  <TextInput
                    value={bloodGroup}
                    onChangeText={setBloodGroup}
                    placeholder="Enter your blood group"
                    placeholderTextColor="#94A3B8"
                    className="rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white"
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-slate-300 mb-2">
                    Profile Image
                  </Text>
                  <View className="rounded-3xl border border-slate-700 bg-slate-950/80 p-4 space-y-3">
                    {localProfileImage || profileImage ? (
                      <Image
                        source={{ uri: localProfileImage || profileImage }}
                        className="h-40 w-full rounded-3xl bg-slate-800"
                      />
                    ) : (
                      <View className="h-40 w-full rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 items-center justify-center">
                        <Text className="text-sm text-slate-500">
                          No image selected yet.
                        </Text>
                      </View>
                    )}
                    <View className="flex-row items-center gap-3 mt-4">
                      <TouchableOpacity
                        onPress={pickProfileImage}
                        disabled={uploadingImage}
                        className={`flex-1 rounded-3xl px-4 py-3 items-center ${uploadingImage ? "bg-emerald-500/60" : "bg-emerald-500"}`}
                      >
                        {uploadingImage ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text className="text-sm font-semibold text-white">
                            Upload image
                          </Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setLocalProfileImage(null);
                          setProfileImage("");
                        }}
                        className="rounded-3xl border border-slate-700 px-4 py-3 items-center"
                      >
                        <Text className="text-sm text-slate-200">Clear</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {statusMessage ? (
                  <Text className="text-sm text-green-500">
                    {statusMessage}
                  </Text>
                ) : null}

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className={`rounded-full mt-4 px-5 py-4 items-center ${canSubmit ? "bg-emerald-500" : "bg-emerald-500/30"} ${isSubmitting ? "opacity-70" : ""}`}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Submit Request
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
