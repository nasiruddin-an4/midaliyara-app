import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedName = await AsyncStorage.getItem('@user_name');
        const storedImage = await AsyncStorage.getItem('@user_image');
        if (storedName) {
          setUserName(storedName);
        }
        if (storedImage) {
          setUserImage(storedImage);
        }
      } catch (e) {
        console.error('Failed to load user info', e);
      } finally {
        setIsUserLoaded(true);
      }
    };
    loadUser();
  }, []);

  const saveUserName = async (name) => {
    try {
      await AsyncStorage.setItem('@user_name', name);
      setUserName(name);
    } catch (e) {
      console.error('Failed to save user name', e);
    }
  };

  const saveUserImage = async (uri) => {
    try {
      // 1. Delete previous image to prevent stale files accumulation
      const oldImage = await AsyncStorage.getItem('@user_image');
      if (oldImage) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(oldImage);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(oldImage, { idempotent: true });
          }
        } catch (err) {
          console.log('Failed to delete old image file:', err);
        }
      }

      // 2. Save new image permanently in documents directory
      const filename = `profile_${Date.now()}.jpg`;
      const permanentUri = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.copyAsync({
        from: uri,
        to: permanentUri,
      });

      // 3. Update storage and state
      await AsyncStorage.setItem('@user_image', permanentUri);
      setUserImage(permanentUri);
    } catch (e) {
      console.error('Failed to save user image', e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      // Delete local profile image file if exists
      const oldImage = await AsyncStorage.getItem('@user_image');
      if (oldImage) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(oldImage);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(oldImage, { idempotent: true });
          }
        } catch (err) {
          console.log('Failed to delete profile image on logout:', err);
        }
      }

      // Clear storage keys
      await AsyncStorage.removeItem('@user_name');
      await AsyncStorage.removeItem('@user_image');

      // Reset state
      setUserName(null);
      setUserImage(null);
    } catch (e) {
      console.error('Failed to logout', e);
      throw e;
    }
  };

  return (
    <UserContext.Provider value={{ userName, saveUserName, userImage, saveUserImage, logout, isUserLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
