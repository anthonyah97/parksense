import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const parkingLots = [
  { id: '1', name: 'Shores Building', location: { latitude: 30.4439, longitude: -84.2930 } },
  { id: '2', name: 'Dirac Science Library', location: { latitude: 30.4412, longitude: -84.2922 } },
  { id: '3', name: 'Cawthon Hall', location: { latitude: 30.4447, longitude: -84.2978 } },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredParkingLots, setFilteredParkingLots] = useState(parkingLots);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [suggestedParkingLots, setSuggestedParkingLots] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Start watching the user's location
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          setCurrentLocation(location.coords);
        }
      );

      // Clean up subscription on unmount
      return () => {
        locationSubscription.remove();
      };
    })();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      const closestLots = parkingLots
        .map(lot => ({
          ...lot,
          distance: calculateDistance(currentLocation, lot.location),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);
      setSuggestedParkingLots(closestLots);
    }
  }, [currentLocation]);

  const calculateDistance = (loc1, loc2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(loc1.latitude);
    const φ2 = toRad(loc2.latitude);
    const Δφ = toRad(loc2.latitude - loc1.latitude);
    const Δλ = toRad(loc2.longitude - loc1.longitude);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  const searchParkingLots = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = parkingLots.filter((lot) =>
        lot.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredParkingLots(filtered);
      setAutocompleteSuggestions(filtered); // Update suggestions based on the query
    } else {
      setFilteredParkingLots(parkingLots);
      setAutocompleteSuggestions([]); // Clear suggestions if the query is empty
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredParkingLots(parkingLots); // Reset to show all parking lots
    setAutocompleteSuggestions([]); // Clear suggestions
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion.name);
    setFilteredParkingLots([suggestion]); // Show only the selected suggestion
    setAutocompleteSuggestions([]); // Clear suggestions
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#FFC72C" style={styles.searchIcon} />
        <TextInput
          placeholder="Search Parking Lots..."
          value={searchQuery}
          onChangeText={searchParkingLots}
          style={styles.searchInput}
          placeholderTextColor="#CCCCCC" // Lighter color for placeholder text
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearch}>
            <Ionicons name="close-circle" size={24} color="#FFC72C" style={styles.clearIcon} />
          </Pressable>
        )}
      </View>

      {/* Autocomplete Suggestions */}
      {autocompleteSuggestions.length > 0 && (
        <FlatList
          data={autocompleteSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionPress(item)} style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}

      <FlatList
        data={filteredParkingLots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ParkingDetailsScreen', { building: item })}>
            <Text style={styles.parkingLotText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.suggestedTitle}>Suggested Parking Lots</Text>
      <FlatList
        data={suggestedParkingLots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ParkingDetailsScreen', { building: item })}>
            <Text style={styles.parkingLotText}>
              {item.name} - <Text style={styles.distanceText}>{item.distance} meters away</Text>
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#1E1E1E', // Dark background color
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C', // Darker input background
    borderColor: '#FFC72C', // Gold border
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#FFFFFF', // White text color
  },
  clearIcon: {
    marginLeft: 10,
  },
  suggestionList: {
    maxHeight: 150,
    marginBottom: 20,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#FFC72C', // Gold background for suggestions
    borderBottomColor: '#A50034',
    borderBottomWidth: 1,
  },
  suggestionText: {
    color: '#1E1E1E', // Dark text color for suggestions
    fontSize: 16,
  },
  suggestedTitle: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    color: '#FFC72C', // Gold color for title
    fontWeight: 'bold',
  },
  parkingLotText: {
    padding: 20,
    fontSize: 18,
    backgroundColor: '#2C2C2C', // Darker background for parking lots
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    color: '#FFC72C', // Gold text color for parking lots
  },
  distanceText: {
    color: '#66FF66', // Lighter green color for distance
    fontWeight: 'bold',
  },
});
