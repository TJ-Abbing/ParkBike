// This file provides the map view component for the app so that the user can see the bike parking spots on a map
import React from 'react';
import { Image, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import translate from './i18n';
import styles from './styles'; 
import Text from './Text.js';
import darkMapStyle from './darkMapStyle';

const MapViewComponent = ({
  location,
  mapRegion,
  bikeparkingspots,
  showAllMarkers,
  showRegularMarkers,
  showFavoriteMarkers,
  darkMode,
  selectedLanguage,
  updateFavorites,
  mapKey,
  favorites,
  setMapLoaded,
}) => {
  return (
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
      customMapStyle={darkMode ? darkMapStyle : []}
    >
      <Marker // Marker for the user's location
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        title={translate('yourLocation', selectedLanguage)}
        description={translate('youAreHere', selectedLanguage)}
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

      {showAllMarkers && // Marker for each bike parking spot in the bikeparkingspots array 
        bikeparkingspots.map((spot) => ( // map function to iterate through the bikeparkingspots array and display each spot name
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
            <Callout // Callout for each bike parking spot marker that displays the spot name and a button to add/remove the spot from favorites
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
                <Text>{translate(
                  favorites.includes(spot.id) ? 'removeFromFavorites' : 'addToFavorites',
                  selectedLanguage
                )}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
    </MapView.Animated>
  );
};

export default MapViewComponent;