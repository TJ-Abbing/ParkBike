import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from './Text.js';

const ListScreen = ({ navigation, route }) => {
  const { bikeparkingspots } = route.params; 

  return (
    <View>
      {bikeparkingspots.map(spot => (
        <TouchableOpacity key={spot.id} onPress={() => handleSpotPress(spot)}>
          <Text>{spot.name}</Text> 
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ListScreen;