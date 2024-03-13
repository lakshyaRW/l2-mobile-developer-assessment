import React from 'react';
import { View, Text, Button } from 'react-native';
import GameScreen from './GameScreen';

const StartScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Balloon Pop Game</Text>
      <Button
        title="Start"
        onPress={() => navigation.navigate('GameScreen')}
      />
    </View>
  );
};

export default StartScreen;
