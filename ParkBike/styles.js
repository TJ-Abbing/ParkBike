// This file contains the default styles for the app
import { StyleSheet } from 'react-native';

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
      bottom: 16,
      alignSelf: 'center',
      flexDirection: 'row',
    },
    button: {
      backgroundColor: '#2196F3',
      padding: 16,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    listContainer: {
      position: 'absolute',
      backgroundColor: '#F0F0F0',
      paddingVertical: 80,
      paddingHorizontal: 80,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#CCCCCC',
      margin: 8,
    },
    callout: {
      backgroundColor: 'white',
      padding: 8,
      borderRadius: 8,
      width: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    switchContainer: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    selectedLanguage: {
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menu: {
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
      width: 250,
    },
    darkModeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    darkModeText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
});

export default styles;