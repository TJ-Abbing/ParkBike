import React, { useState } from 'react';
import { View, TouchableOpacity, Button, Switch, Modal } from 'react-native';
import Text from './Text.js';
import styles from './styles';

const SettingsScreen = ({
  darkMode,
  toggleDarkMode,
  showAllMarkers,
  setShowAllMarkers,
  showRegularMarkers,
  setShowRegularMarkers,
  showFavoriteMarkers,
  setShowFavoriteMarkers,
  selectedLanguage,
  setSelectedLanguage,
  translate,
  setShowMenu,
  showMenu
}) => {
  return (
    <Modal transparent={true} visible={showMenu} onRequestClose={() => setShowMenu(false)}>
    <View style={styles.modalContainer}>
      <View style={styles.menu}>

        {/* Language selection and dark mode toggle */}
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

        {/* Buttons to show/hide markers and close menu */}
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
  );
};

export default SettingsScreen;
