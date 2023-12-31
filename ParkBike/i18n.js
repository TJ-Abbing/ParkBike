// This file contains all the translations for the app
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
    allMarkers: 'All Markers',
    favoriteMarkers: 'Favorite Markers',
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
    allMarkers: 'Alle Markers',
    favoriteMarkers: 'Favoriete Markers',
  },
  de: {
    yourLocation: 'Dein Standort',
    youAreHere: 'Du bist hier.',
    loadingMap: 'Karte wird geladen...',
    showList: 'Liste anzeigen',
    settings: 'Einstellungen',
    darkMode: 'Dunkler Modus',
    hideAllMarkers: 'Alle Markierungen ausblenden',
    showAllMarkers: 'Alle Markierungen anzeigen',
    hideRegularMarkers: 'Gewöhnliche Markierungen ausblenden',
    showRegularMarkers: 'Gewöhnliche Markierungen anzeigen',
    hideFavoriteMarkers: 'Favorisierte Markierungen ausblenden',
    showFavoriteMarkers: 'Favorisierte Markierungen anzeigen',
    removeFromFavorites: 'Zum Entfernen von Favoriten klicken',
    addToFavorites: 'Zum Hinzufügen zu Favoriten klicken',
    closeMenu: 'Menü schließen',
    allMarkers: 'Alle Markierungen',
    favoriteMarkers: 'Favorisierte Markierungen',
  },
  // Add more languages and translations as needed. Would suggest French and Spanish next.
};

export default function translate(key, language = 'en') {
  console.log(`Translating ${key} to ${language}`);
  const translation = translations[language] && translations[language][key];
  return translation || key;
}