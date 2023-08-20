// This file provides the list screen for the app
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from './Text.js';

const ListScreen = ({ navigation, route }) => {
  
  const { bikeparkingspots } = route.params; 

  return (
    <View>
      {bikeparkingspots.map(spot => ( // map function to iterate through the bikeparkingspots array and display each spot name
        <TouchableOpacity key={spot.id} onPress={() => handleSpotPress(spot)}>
          <Text>{spot.name}</Text> 
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ListScreen;