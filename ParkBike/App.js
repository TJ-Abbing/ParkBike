  import { StatusBar } from 'expo-status-bar';
  import React, { useEffect, useState } from 'react';
  import { View, TouchableOpacity, Modal, Button, Switch } from 'react-native';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import MapView, { Marker, Callout } from 'react-native-maps';
  import * as Location from 'expo-location';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import Text from './Text.js';
  import translate from './i18n';
  import styles from './styles';
  import darkMapStyle from './darkMapStyle';
  import MapViewComponent from './MapViewComponent';
  import ListScreen from './ListScreen';
  import SettingsScreen from './SettingsScreen';

  const Stack = createStackNavigator();

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
    const [darkMode, setDarkMode] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    useEffect(() => {
      console.log(`Selected language: ${selectedLanguage}`);
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

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setShowList((prevShowList) => !prevShowList)}>
                  <Text style={styles.buttonText}>{translate('showList', selectedLanguage)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setShowMenu(true)}>
                  <Text style={styles.buttonText}>{translate('settings', selectedLanguage)}</Text>
                </TouchableOpacity>
              </View>

                {/* List Modal */}
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
  {(showFavorites
            ? bikeparkingspots.filter((spot) => favorites.includes(spot.id))
            : bikeparkingspots
          ).map((spot) => (
            <TouchableOpacity key={spot.id} onPress={() => handleSpotPress(spot)}>
              <Text>{spot.name} - {translate('capacity', selectedLanguage)}: {spot.capacity}</Text>
            </TouchableOpacity>
          ))}
                  </View>
                )}

                {/* Settings Modal */}
                <Modal transparent={true} visible={showMenu} onRequestClose={() => setShowMenu(false)}>
                  <View style={styles.modalContainer}>
                    <View style={styles.menu}>
                      <Text style={styles.menuItem}>{translate('selectLanguage', selectedLanguage)}</Text>
        <TouchableOpacity onPress={() => setSelectedLanguage('en')}>
          <Text style={[styles.menuItem, selectedLanguage === 'en' && styles.selectedLanguage]}>
            English{selectedLanguage === 'en' && '  ✔'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedLanguage('nl')}>
          <Text style={[styles.menuItem, selectedLanguage === 'nl' && styles.selectedLanguage]}>
            Nederlands{selectedLanguage === 'nl' && '  ✔'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedLanguage('de')}>
          <Text style={[styles.menuItem, selectedLanguage === 'de' && styles.selectedLanguage]}>
            Deutsch{selectedLanguage === 'de' && '  ✔'}
          </Text>
        </TouchableOpacity>
              <View style={styles.darkModeContainer}>
                <Text style={styles.darkModeText}>{translate('darkMode', selectedLanguage)}</Text>
                <Switch value={darkMode} onValueChange={toggleDarkMode} />
              </View>

              <Button
                title={translate(
                  showAllMarkers ? 'hideAllMarkers' : 'showAllMarkers',
                  selectedLanguage
                )}
                onPress={() => setShowAllMarkers(!showAllMarkers)}
              />
              <Button
                title={translate(
                  showRegularMarkers ? 'hideRegularMarkers' : 'showRegularMarkers',
                  selectedLanguage
                )}
                onPress={() => setShowRegularMarkers(!showRegularMarkers)}
              />
              <Button
                title={translate(
                  showFavoriteMarkers ? 'hideFavoriteMarkers' : 'showFavoriteMarkers',
                  selectedLanguage
                )}
                onPress={() => setShowFavoriteMarkers(!showFavoriteMarkers)}
              />
              <Button
                title={translate('closeMenu', selectedLanguage)}
                onPress={() => setShowMenu(false)}
              />
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          </Stack.Screen>
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }