// This file provides the settings screen for the app
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from './Text.js';

const SettingsScreen = ({ navigation, route }) => {
  const { selectedLanguage } = route.params;

  return (
    <View>
      <Text>Selected Language: {selectedLanguage}</Text>
    </View>
  );
};

export default SettingsScreen;