// This file contains the dark map style for the map component
const darkMapStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#1c1c1c', // Dark background color for the map
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#1c1c1c', // Dark color for the map labels' text stroke
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#e0e0e0', // Light color for the map labels' text
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [
        {
          color: '#757575', // Dark color for administrative areas
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#2c2c2c', // Dark color for points of interest
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#424242', // Dark color for the roads
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#0D47A1', // Dark blue color for the water
        },
      ],
    },
  ];

export default darkMapStyle;