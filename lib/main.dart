import 'package:flutter/material.dart';
import 'balloon_pop_game.dart'; // Import the file you created

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Balloon Pop Game'),
        ),
        body: BalloonPopScreen(), // Use the BalloonPopScreen widget
      ),
    );
  }
}
