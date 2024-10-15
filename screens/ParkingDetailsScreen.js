import React from 'react';
import { View, Text, TouchableOpacity, Linking, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Importing icons

// Import building images
const buildingImages = {
    "Shores Building": require('../assets/pics/shores-building.jpg'), // Path to the image
    "Cawthon Hall": require('../assets/pics/cawthon.jpg'), // Path to the image
    "Dirac Science Library": require('../assets/pics/dirac.jpg'), // Path to the image
};

export default function ParkingDetailsScreen({ route, navigation }) {
  const { building } = route.params;

  // Function to handle walking (AR navigation can be added here)
  const handleWalk = () => {
    navigation.navigate('CameraScreen'); // Navigate to CameraScreen
  };

  // Function to handle driving using Google Maps
  const handleDrive = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${building.location.latitude},${building.location.longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Display the building image above the name */}
      <Image
        source={buildingImages[building.name]} // Dynamically load the building image
        style={styles.image}
        resizeMode="cover"
      />
      
      <Text style={styles.title}>Building: {building.name}</Text>

      <View style={styles.buttonContainer}>
        {/* Walk Icon */}
        <TouchableOpacity onPress={handleWalk} style={styles.button}>
          <Icon name="walk-outline" size={80} color="#b05c2f" />
          <Text style={styles.buttonText}>Walk</Text>
        </TouchableOpacity>

        {/* Drive Icon */}
        <TouchableOpacity onPress={handleDrive} style={styles.button}>
          <Icon name="car-outline" size={80} color="#b05c2f" />
          <Text style={styles.buttonText}>Drive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1c1c1c', // Dark background
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#ffffff', // Light text color
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 10,
    color: '#ffffff', // Light text color for button text
  },
});
