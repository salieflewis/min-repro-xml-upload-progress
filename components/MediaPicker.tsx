import React, { useState } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Buffer } from "@craftzdog/react-native-buffer";

export function MediaPicker() {
  const [mediaObject, setMediaObject] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        setMediaObject(result.assets[0]);
        uploadMedia(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking media: ", error);
    }
  };

  const uploadMedia = (media: ImagePicker.ImagePickerAsset) => {
    try {
      const mediaBase64 = media.base64;
      if (!mediaBase64) {
        throw new Error("Base64 data is missing");
      }

      const mediaBytes = Buffer.from(mediaBase64, 'base64');
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'http://localhost:3030/upload');
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          console.log(`Upload progress: ${percentComplete}%`);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log('Upload successful:', xhr.responseText);
        } else {
          console.error('Upload failed:', xhr.statusText);
        }
      };

      xhr.onerror = () => {
        console.error('Upload error:', xhr.statusText);
      };

      xhr.send(mediaBytes);
    } catch (error) {
      console.error("Error uploading media: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image or video" onPress={pickMedia} />
      {mediaObject && (
        <Image source={{ uri: mediaObject.uri }} style={styles.media} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    width: 200,
    height: 200,
  },
});