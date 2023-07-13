// Import necessary components from React Native and Expo libraries
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Text from './Text.js';
import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the main App component
export default function App() {
  
  // Define state variables for location, error message, showList and mapRegion
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showList, setShowList] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Define a state variable to store the bike parking spots data
  const [bikeparkingspots, setBikeparkingspots] = useState([]);

  // Use the useEffect hook to fetch the user's location and bike parking spots data when the component mounts
  useEffect(() => {

    // Define an async function to fetch the user's location
    const fetchLocation = async () => {
      // Request permission to access the user's location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
    
      try {
        // Get the user's current position
        let location = await Location.getCurrentPositionAsync({});
        // Update the location state variable with the user's location
        setLocation(location);
        // Set the initial map region to center on the user's location
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        });        
      } catch (error) {
        console.log(error);
        // If there was an error getting the user's location, set an error message
        setErrorMsg('We’re unable to show the map because access to your location data was not granted. Please enable location services to use this feature.');
      }
    }; 

    // Call the fetchLocation function to get the user's location
    fetchLocation();

    // Add this code inside your existing useEffect hook
    const getFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getFavorites();

    // Define an async function to fetch the bike parking spots data
    const fetchBikeparkingspots = async () => {
      try {
        // Send a GET request to the API endpoint
        const response = await fetch('https://stud.hosted.hr.nl/1014535/parkbike/api/bikeparkingspots.json');
        // Parse the response as JSON
        const data = await response.json();
        // Update the bikeparkingspots state variable with the fetched data
        setBikeparkingspots(data);
      } catch (error) {
        console.log(error);
      }
    };

    // Call the fetchBikeparkingspots function to fetch the bike parking spots data
    fetchBikeparkingspots();
    
  }, []);

  // Define a function to handle when a bike parking spot is pressed in the list
  const handleSpotPress = (spot) => {
    // Update the map region to center on the selected bike parking spot
    setMapRegion({
      latitude: spot.latitude + Math.random() * 0.000001,
      longitude: spot.longitude + Math.random() * 0.000001,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    });
    // Hide the list of bike parking spots
    setShowList(false);
  };

  const updateFavorites = async (newFavorites) => {
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.log(error);
    }
    setMapKey(mapKey + 1);
  };

  // Render the app UI
  return (

    <View style={styles.container}>

      {/* If we have the user's location, render the map */}
      {location ? (
        <MapView.Animated
          key={mapKey}
          style={styles.map}
          region={mapRegion}

          mapType="standard"
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          showsBuildings={true}
          showsTraffic={false}
          showsIndoors={false}
          showsCompass={false}
          rotateEnabled={true}
        >
          {/* Render a marker for the user's current location */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description='You are here.'
          >
            <Image
              source={require('./images/bicycle.png')}
              style={{ width: 48, height: 48 }}
            />
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Your Location</Text>
                <Text>You are here.</Text>
              </View>
            </Callout>
          </Marker>

          {/* Render markers for each bike parking spot */}
          {bikeparkingspots.map((spot) => (

            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              title={spot.name}
              description={`Capacity: ${spot.capacity}`}
            >
              <Image
                source={
                  favorites.includes(spot.id)
                    ? require('./images/biycle_parking_spot_favorite.png')
                    : require('./images/biycle_parking_spot_regular.png')
                }
                style={{ width: 32, height: 32, borderRadius: 8 }}
              />
              <Callout tooltip onPress={() => {
                if (favorites.includes(spot.id)) {
                  updateFavorites(favorites.filter((id) => id !== spot.id));
                } else {
                  updateFavorites([...favorites, spot.id]);
                }
              }}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{spot.name}</Text>
                  <Text>Capacity: {spot.capacity}</Text>
                  <Text>{favorites.includes(spot.id) ? 'Click to remove from favorites' : 'Click to add to favorites'}</Text>
                </View>
              </Callout>
            </Marker>

          ))}

        </MapView.Animated>

      ) : errorMsg ? (
        // If there was an error getting the user's location, show an error message
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{errorMsg}</Text>
        </View>
      ) : (
        // Otherwise, show a loading message while we wait for the user's location
        <Text>Loading map...</Text>
      )}

      {/* Render a button to show/hide the list of bike parking spots */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowList(!showList)}
        >
          <Text style={styles.buttonText}>Show List</Text>
        </TouchableOpacity>
      </View>

      {/* If showList is true, render the list of bike parking spots */}
      {showList && (
        <View style={styles.listContainer}>
          <View style={styles.switchContainer}>
            <TouchableOpacity onPress={() => setShowFavorites(false)}>
              <Text style={[styles.switch, !showFavorites && styles.activeSwitch]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowFavorites(true)}>
              <Text style={[styles.switch, showFavorites && styles.activeSwitch]}>Favorites</Text>
            </TouchableOpacity>
          </View>
          {(showFavorites ? bikeparkingspots.filter((spot) => favorites.includes(spot.id)) : bikeparkingspots).map((spot) => (
            <TouchableOpacity key={spot.id} onPress={() => handleSpotPress(spot)}>
              <Text>{spot.name} - Capacity: {spot.capacity}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <StatusBar style="auto" />

    </View>
  );
}

// Define styles for the app
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },  
  listContainer:{
    position:'absolute',
    backgroundColor:'#F0F0F0',
    paddingVertical: 80,
    paddingHorizontal: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    margin: 8,
  },
  callout: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    maxWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchContainer:{
    flexDirection:'row',
    marginBottom:8
  },
  switch:{
    backgroundColor:'#CCCCCC',
    paddingVertical:4,
    paddingHorizontal:8,
    borderRadius:4,
    marginRight:4
  },
  activeSwitch:{
    backgroundColor:'#2196F3'
  },
  calloutTitle:{
    fontWeight:'bold'
  }
});
