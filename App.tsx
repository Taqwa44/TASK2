import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Camera, useCameraDevices, CameraProps } from 'react-native-vision-camera';
import { PermissionsAndroid } from 'react-native';
import { MediaStore } from 'react-native-media-kit'; // Import MediaStore

function App(): JSX.Element {
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState('');

  const savePhoto = async (photoPath: string) => {
    try {
      const mediaStoreOptions = {
        path: photoPath,
        album: 'YourAlbumName', // Change to the desired album name
        title: 'Captured Photo',
        type: 'image/jpeg', // Change to the desired image type
      };

      const assetId = await MediaStore.saveAssetAsync(mediaStoreOptions);

      console.log('Photo saved with asset ID: ' + assetId);
    } catch (error) {
      console.error('Failed to save the photo: ' + error);
    }
  };

  useEffect(() => {
    (async () => {
      const newCameraPermission = await Camera.requestCameraPermission();
      const newMicrophonePermission = await Camera.requestMicrophonePermission();

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Cool Photo App Camera Permission",
            message: "Your app needs permission.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Handle permission granted
        } else {
          console.log("Camera permission denied");
          // Handle permission denied
        }
      } catch (err) {
        console.warn(err);
        // Handle permission request error
      }
    })();
  }, []);

  const capturePhoto = async () => {
    if (camera.current !== null) {
      try {
        const photo = await camera.current.takePhoto({});
        setImageSource(photo.path);
        setShowCamera(false);

        // Save the captured photo using the MediaStore API
        savePhoto(photo.path);
      } catch (error) {
        console.error('Failed to capture photo: ' + error);
      }
    }
  };

  if (device == null) return <ActivityIndicator />;

  return (
    <View style={styles.camera}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        zoom={1}
      />
      <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
        <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Capture Photo</Text>
      </TouchableOpacity>

      {imageSource !== '' && (
        <TouchableOpacity onPress={() => savePhoto(imageSource)} style={styles.captureButton}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Save Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flex: 0.3,
  },
  all: {
    flex: 1,
  },
  camera: {
    flex: 1,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});

export default App;