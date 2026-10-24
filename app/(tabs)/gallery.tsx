// Camera and Photo Picker App (TypeScript)
// Install first:  npx expo install expo-image-picker
// Use: save this file as App.tsx in your project (delete the old App.js)

import React, { useState } from 'react';
import { View, Text, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  // image address (uri) is a string, or null when no photo is chosen yet
  const [image, setImage] = useState<string | null>(null);

  // choose a photo from the phone gallery
  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // take a new photo with the camera
  const takePhoto = async (): Promise<void> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', marginTop: 80, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Photo Picker</Text>

      <Button title="Choose from Gallery" onPress={pickImage} />
      <View style={{ height: 10 }} />
      <Button title="Take a Photo" onPress={takePhoto} />

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 280, height: 280, marginTop: 30, borderRadius: 10 }}
        />
      )}
    </View>
  );
}
