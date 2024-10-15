// CameraScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera } from 'expo-camera';

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />; // Waiting for permission response
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.preview} type={Camera.Constants.Type.back} ref={cameraRef}>
        <Text style={styles.text}>Camera is open for AR navigation!</Text>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  text: {
    color: '#fff',
    position: 'absolute',
    bottom: 50,
    left: 20,
    fontSize: 20,
  },
});

export default CameraScreen;
