// This file is a custom component that provides a default font size of 16

import React from 'react';
import { Text as RNText } from 'react-native';

const Text = (props) => {
  return <RNText {...props} style={[{ fontSize: 16 }, props.style]} />;
};

export default Text;