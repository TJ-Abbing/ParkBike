// i18n.js

const translations = {
    en: {
      yourLocation: 'Your Location',
      youAreHere: 'You are here.',
      loadingMap: 'Loading map...',
      showList: 'Show List',
      settings: 'Settings',
      darkMode: 'Dark Mode',
      hideAllMarkers: 'Hide All Markers',
      showAllMarkers: 'Show All Markers',
      hideRegularMarkers: 'Hide Regular Markers',
      showRegularMarkers: 'Show Regular Markers',
      hideFavoriteMarkers: 'Hide Favorite Markers',
      showFavoriteMarkers: 'Show Favorite Markers',
      removeFromFavorites: 'Click to remove from favorites',
      addToFavorites: 'Click to add to favorites',
      closeMenu: 'Close Menu',
    },
    nl: {
      yourLocation: 'Jouw locatie',
      youAreHere: 'Je bent hier.',
      loadingMap: 'Kaart laden...',
      showList: 'Toon lijst',
      settings: 'Instellingen',
      darkMode: 'Donkere modus',
      hideAllMarkers: 'Verberg alle markers',
      showAllMarkers: 'Toon alle markers',
      hideRegularMarkers: 'Verberg gewone markers',
      showRegularMarkers: 'Toon gewone markers',
      hideFavoriteMarkers: 'Verberg favoriete markers',
      showFavoriteMarkers: 'Toon favoriete markers',
      removeFromFavorites: 'Klik om uit favorieten te verwijderen',
      addToFavorites: 'Klik om aan favorieten toe te voegen',
      closeMenu: 'Sluit menu',
    },
    // Add more languages and translations as needed
  };
  
  export default function translate(key, language = 'en') {
    console.log(`Translating ${key} to ${language}`);
    const translation = translations[language] && translations[language][key];
    return translation || key;
  } 