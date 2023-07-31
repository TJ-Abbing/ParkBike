// Import necessary components from React Native and Expo libraries
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Modal, Button, Switch } from 'react-native';
import Text from './Text.js';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#1c1c1c', // Dark background color for the map
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1c1c1c', // Dark color for the map labels' text stroke
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#e0e0e0', // Light color for the map labels' text
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575', // Dark color for administrative areas
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2c2c2c', // Dark color for points of interest
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#424242', // Dark color for the roads
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#0D47A1', // Dark blue color for the water
      },
    ],
  },
];



// Define the main App component
export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showList, setShowList] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [bikeparkingspots, setBikeparkingspots] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAllMarkers, setShowAllMarkers] = useState(true);
  const [showRegularMarkers, setShowRegularMarkers] = useState(true);
  const [showFavoriteMarkers, setShowFavoriteMarkers] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  useEffect(() => {
    console.log(`Re-rendering map. Dark mode set to: ${darkMode}.`);
  
    let mapRenderSuccessful = true;
  
    // Fetch user location and bike parking data
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission not granted.');
        mapRenderSuccessful = false;
        return;
      }
  
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        });
        console.log('Location fetched successfully.');
      } catch (error) {
        console.error(`Error retrieving location. Error: ${error.message || error}`);
        setErrorMsg(
          'We’re unable to show the map because access to your location data was not granted. Please enable location services in order to use this application.'
        );
        mapRenderSuccessful = false;
      }
    };
  
    const getFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
          console.log('Favorites fetched successfully.');
        }
      } catch (error) {
        console.error(`Error retrieving favorites from storage: ${error.message || error}`);
        mapRenderSuccessful = false;
      }
    };
  
    const fetchBikeparkingspots = async () => {
      try {
        const response = await fetch(
          'https://stud.hosted.hr.nl/1014535/parkbike/api/bikeparkingspots.json'
        );
        const data = await response.json();
        setBikeparkingspots(data);
        console.log('Bike parking spots fetched successfully.');
      } catch (error) {
        console.error(`Error fetching bike parking spots: ${error.message || error}`);
        mapRenderSuccessful = false;
      }
    };
  
    // Fetch location, favorites, and bike parking data
    Promise.all([fetchLocation(), getFavorites(), fetchBikeparkingspots()]).then(() => {
      // Log when all asynchronous operations have completed
      if (mapRenderSuccessful === false) {
        console.error('Fetch operations failed.');
      } else if (mapRenderSuccessful === true) {
        console.log('Fetch operations completed successfully.');
      }
    });
  
  }, [darkMode]);
  

  const handleSpotPress = (spot) => {
    setMapRegion({
      latitude: spot.latitude + Math.random() * 0.000001,
      longitude: spot.longitude + Math.random() * 0.000001,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    });
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

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    console.log('Toggling dark mode.');
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView.Animated
          key={mapKey}
          style={[styles.map, darkMode && styles.darkMap]}
          region={mapRegion}
          mapType={'standard'}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          showsBuildings={true}
          showsTraffic={false}
          showsIndoors={false}
          showsCompass={false}
          rotateEnabled={true}
          onMapReady={() => setMapLoaded(true)}
          customMapStyle={darkMode ? darkMapStyle : []}// Apply dark map style here
        >
          {/* Markers and Callouts */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="You are here."
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

          {showAllMarkers &&
            bikeparkingspots.map((spot) => (
              <Marker
                key={spot.id}
                coordinate={{
                  latitude: spot.latitude,
                  longitude: spot.longitude,
                }}
                title={spot.name}
                description={`Capacity: ${spot.capacity}`}
                opacity={
                  (showRegularMarkers && !favorites.includes(spot.id)) ||
                  (showFavoriteMarkers && favorites.includes(spot.id))
                    ? 1
                    : 0
                }
              >
                <Image
                  source={
                    favorites.includes(spot.id)
                      ? require('./images/biycle_parking_spot_favorite.png')
                      : require('./images/biycle_parking_spot_regular.png')
                  }
                  style={{ width: 32, height: 32, borderRadius: 8 }}
                />
                <Callout
                  tooltip
                  onPress={() => {
                    if (favorites.includes(spot.id)) {
                      updateFavorites(favorites.filter((id) => id !== spot.id));
                    } else {
                      updateFavorites([...favorites, spot.id]);
                    }
                  }}
                >
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{spot.name}</Text>
                    <Text>Capacity: {spot.capacity}</Text>
                    <Text>
                      {favorites.includes(spot.id)
                        ? 'Click to remove from favorites'
                        : 'Click to add to favorites'}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
        </MapView.Animated>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{errorMsg}</Text>
        </View>
      ) : (
        <Text>Loading map...</Text>
      )}

      {mapLoaded && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setShowList(!showList)}>
            <Text style={styles.buttonText}>Show List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setShowMenu(!showMenu)}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}

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
          {(showFavorites
            ? bikeparkingspots.filter((spot) => favorites.includes(spot.id))
            : bikeparkingspots
          ).map((spot) => (
            <TouchableOpacity key={spot.id} onPress={() => handleSpotPress(spot)}>
              <Text>{spot.name} - Capacity: {spot.capacity}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal transparent={true} visible={showMenu} onRequestClose={() => setShowMenu(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.menu}>
            {/* Add dark mode switch */}
            <View style={styles.darkModeContainer}>
              <Text style={styles.darkModeText}>Dark Mode</Text>
              <Switch value={darkMode} onValueChange={toggleDarkMode} />
            </View>

            {/* Other menu options */}
            <Button
              title={showAllMarkers ? 'Hide All Markers' : 'Show All Markers'}
              onPress={() => setShowAllMarkers(!showAllMarkers)}
            />
            <Button
              title={showRegularMarkers ? 'Hide Regular Markers' : 'Show Regular Markers'}
              onPress={() => setShowRegularMarkers(!showRegularMarkers)}
            />
            <Button
              title={showFavoriteMarkers ? 'Hide Favorite Markers' : 'Show Favorite Markers'}
              onPress={() => setShowFavoriteMarkers(!showFavoriteMarkers)}
            />
            <Button title="Close Menu" onPress={() => setShowMenu(false)} />
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

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
  darkMap: {
    backgroundColor: '#333333', // Dark mode map background color
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
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    position: 'absolute',
    backgroundColor: '#F0F0F0',
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
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  switch: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  activeSwitch: {
    backgroundColor: '#2196F3',
  },
  calloutTitle: {
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: 250,
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  darkModeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
