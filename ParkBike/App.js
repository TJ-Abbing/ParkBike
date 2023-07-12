import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import bikeparkingspots from './bikeparkingspots.json';

export default function App() {
  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showList, setShowList] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {

    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
    
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.log(error);
        setErrorMsg('We’re unable to show the map because access to your location data was not granted. Please enable location services to use this feature.');
      }
    }; 

    fetchLocation();
    
  }, []);

  const handleSpotPress = (spot) => {
    setMapRegion({
      latitude: spot.latitude,
      longitude: spot.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setShowList(false);
  };

  return (

    <View style={styles.container}>

      {location ? (
        <MapView.Animated
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
          </Marker>

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
              source={require('./images/biycle_parking_spot_regular.png')}
              style={{ width: 32, height: 32, borderRadius: 8 }}
            />
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

      <View style={styles.buttonContainer}>
        <Button
          title="Show List"
          onPress={() => setShowList(!showList)}
        />
      </View>

      {showList && (
        <View style={styles.listContainer}>
          {bikeparkingspots.map((spot) => (
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
    bottom: 20,
    alignSelf:'center'
  },
  listContainer:{
    position:'absolute',
    backgroundColor:'white',
    paddingVertical:'5%',
    paddingHorizontal:'2%',
    borderRadius: 5
  }
});