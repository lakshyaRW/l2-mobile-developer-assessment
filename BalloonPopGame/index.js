import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import StartScreen from './StartScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StartScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

