import 'package:flutter/material.dart';
import 'game_screen.dart'; // Import your game screen file

void main() {
  runApp(GameApp());
}

class GameApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Balloon Pop Game',
      home: GameScreen(),
      theme: ThemeData(
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.orange, // Set the app bar background color to orange
        ),
      ),
      debugShowCheckedModeBanner: false,
    );
  }
}
