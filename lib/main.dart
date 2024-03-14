import 'package:flutter/material.dart';
import 'game_screen.dart'; // Import your game screen file

void main() {
  runApp(GameApp());
}

class GameApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Balloon Poping',
      home: GameScreen(),
    );
  }
}