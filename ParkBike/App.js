// Import libraries and components
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Modal, Button, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from './Text.js';
import translate from './i18n';
import styles from './styles';
import MapViewComponent from './MapViewComponent';
import ListScreen from './ListScreen';
import SettingsScreen from './SettingsScreen';

// Create Stack Navigator for navigation between screens
const Stack = createStackNavigator();

// Main App component
export default function App() {
  // Declare state variables
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
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Fetch location, favorites, and bike parking data on initial render
  useEffect(() => {

    // Log when the app is first opened or re-rendered due to a change in dark mode setting
    console.log(`Selected language: ${selectedLanguage}`);
    console.log(`Re-rendering map. Dark mode set to: ${darkMode}.`);

    // Declare variable to track whether map rendered successfully
    let mapRenderSuccessful = true;

    // Fetch user's location
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission not granted.');
        mapRenderSuccessful = false;
        return;
      }

      try { // Try to fetch location and set map region
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

    // Fetch favorites from local storage
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

    // Fetch bike parking data from API
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

  }, [darkMode]); // Re-render map when dark mode setting changes

  // Handle spot press event by updating map region and hiding list
  const handleSpotPress = (spot) => {
  setMapRegion({
    latitude: spot.latitude + Math.random() * 0.000001,
    longitude: spot.longitude + Math.random() * 0.000001,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  });
  setShowList(false);
};

// Update favorites in local storage and re-render map when favorites change
const updateFavorites = async (newFavorites) => {
  setFavorites(newFavorites);
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  } catch (error) {
    console.log(error);
  }
  setMapKey(mapKey + 1);
};

// Function to toggle dark mode setting and re-render map
  const toggleDarkMode = () => {
    console.log('Toggling dark mode.');
    setDarkMode((prevMode) => !prevMode); // Toggle dark mode setting and re-render map
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          options={{ headerShown: false }}
        >
          {({ navigation }) => (
            <View style={styles.container}>
              {location ? (
                <MapViewComponent
                  location={location}
                  mapRegion={mapRegion}
                  bikeparkingspots={bikeparkingspots} 
                  showAllMarkers={showAllMarkers}
                  showRegularMarkers={showRegularMarkers}
                  showFavoriteMarkers={showFavoriteMarkers}
                  darkMode={darkMode}
                  selectedLanguage={selectedLanguage}
                  handleSpotPress={handleSpotPress}
                  updateFavorites={updateFavorites}
                  mapKey={mapKey}
                  favorites={favorites}
                  setMapLoaded={setMapLoaded}
                />
              ) : errorMsg ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.error}>{errorMsg}</Text>
                </View>
              ) : (
                <Text>{translate('loadingMap', selectedLanguage)}</Text>
              )}
  
              {/* Buttons for Show List and Settings */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowList((prevShowList) => !prevShowList)}
                >
                  <Text style={styles.buttonText}>
                    {translate('showList', selectedLanguage)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowMenu(true)}
                >
                  <Text style={styles.buttonText}>
                    {translate('settings', selectedLanguage)}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* List with bike parking spots */}
              {showList && (
                <View style={styles.listContainer}>
                  <View style={styles.switchContainer}>
                    <TouchableOpacity onPress={() => setShowFavorites(false)}>
                      <Button
                        title={translate('allMarkers', selectedLanguage)}
                        onPress={() => setShowFavorites(false)}
                        color={showFavorites ? 'gray' : '#2196F3'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowFavorites(true)}>
                      <Button
                        title={translate('favoriteMarkers', selectedLanguage)}
                        onPress={() => setShowFavorites(true)}
                        color={showFavorites ? '#2196F3' : 'gray'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* List of favorited bike parking spots */}
                  {showFavorites
                    ? bikeparkingspots.filter((spot) => favorites.includes(spot.id))
                        .map((spot) => (
                          <TouchableOpacity key={spot.id} onPress={() => handleSpotPress(spot)}>
                            <Text>{spot.name} - {translate('capacity', selectedLanguage)}: {spot.capacity}</Text>
                          </TouchableOpacity>
                        ))
                    : bikeparkingspots.map((spot) => (
                        <TouchableOpacity key={spot.id} onPress={() => handleSpotPress(spot)}>
                          <Text>{spot.name} - {translate('capacity', selectedLanguage)}: {spot.capacity}</Text>
                        </TouchableOpacity>
                      ))
                  }
                </View>
              )}
              
              {/* Settings Screen */}
              <SettingsScreen
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                showAllMarkers={showAllMarkers}
                setShowAllMarkers={setShowAllMarkers}
                showRegularMarkers={showRegularMarkers}
                setShowRegularMarkers={setShowRegularMarkers}
                showFavoriteMarkers={showFavoriteMarkers}
                setShowFavoriteMarkers={setShowFavoriteMarkers}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                translate={translate}
                setShowMenu={setShowMenu}
                showMenu={showMenu}
              />
            </View>
          )}
        </Stack.Screen>
        {/* List and Settings screens are separate components that are imported from ListScreen.js and SettingsScreen.js respectively */}
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );  
}