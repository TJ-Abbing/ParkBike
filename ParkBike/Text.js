import React from 'react';
import { Text as RNText } from 'react-native';

const Text = (props) => {
  return <RNText {...props} style={[{ fontSize: 16 }, props.style]} />;
};

export default Text;