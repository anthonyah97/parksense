import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ParkingDetailsScreen from './screens/ParkingDetailsScreen';
import CameraScreen from './screens/CameraScreen'; // Import the camera screen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
       <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ParkingDetailsScreen" component={ParkingDetailsScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} /> 

        </Stack.Navigator>
    </NavigationContainer>
  );
}