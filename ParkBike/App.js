import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import bikeparkingspots from './bikeparkingspots.json';

export default function App() {
  // State variables for location and error messages.
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // UseEffect hook to fetch location data when component mounts.
  useEffect(() => {
    // Async function to request location permissions and get current position.
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };

    // Call the fetchLocation function.
    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      // Conditionally render the map or loading text based on location availability.
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          // Map over bikeparkingspots array and render markers on the map.
          {bikeparkingspots.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              title={spot.name}
              description={`Capacity: ${spot.capacity}`}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}
      // StatusBar component for controlling the status bar style.
      <StatusBar style="auto" />
    </View>
  );
}

// Styling.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});