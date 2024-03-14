import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';

void main() {
  runApp(BalloonPopApp());
}

class BalloonPopApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Balloon Pop Game',
      home: BalloonPopScreen(),
    );
  }
}

class BalloonPopScreen extends StatefulWidget {
  @override
  _BalloonPopScreenState createState() => _BalloonPopScreenState();
}

class _BalloonPopScreenState extends State<BalloonPopScreen> {
  static const double SCREEN_WIDTH = 400; // Adjusted for mobile
  static const double SCREEN_HEIGHT = 600; // Adjusted for mobile
  static const double BALLOON_RADIUS = 20;
  static const double BALLOON_SPEED = 1;
  static const double FONT_SIZE = 24; // Adjusted for mobile
  static const Color WHITE = Colors.white;
  static const Color BLACK = Colors.black;
  static const Color RED = Colors.red;
  static const Color GREEN = Colors.green;
  static const Color YELLOW = Colors.yellow;
  static const Color BLUE = Colors.blue;
  static const double BALLOON_SPAWN_RATE = 0.01;
  static const String GAME_FONT = 'freesansbold.ttf';
  static const double START_FONT_SIZE = FONT_SIZE + 10; // Adjusted for mobile
  static const double GAME_FONT_SIZE = FONT_SIZE;

  List<Balloon> balloons = [];
  int score = 0;
  int missed = 0;
  double timer = 120;
  bool gameStarted = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedContainer(
        duration: Duration(milliseconds: 16),
        color: WHITE,
        child: gameStarted ? buildGameScreen() : buildStartScreen(),
      ),
    );
  }

  Widget buildStartScreen() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'Balloon Pop Game',
            style: TextStyle(fontSize: START_FONT_SIZE, color: BLUE),
          ),
          SizedBox(height: 50),
          ElevatedButton(
            onPressed: () {
              setState(() {
                resetGame();
              });
            },
            child: Text('Start'),
          ),
        ],
      ),
    );
  }

  Widget buildGameScreen() {
    return GestureDetector(
      onTap: () {
        if (!gameStarted) {
          resetGame();
        } else {
          handleGameLogic();
        }
      },
      child: Stack(
        children: [
          // Draw sky background
          Container(
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/sky_image.jpg'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          // Draw balloons
          ...balloons.map((balloon) => Positioned(
                left: balloon.x - BALLOON_RADIUS,
                top: balloon.y - BALLOON_RADIUS,
                child: GestureDetector(
                  onTap: () {
                    setState(() {
                      balloons.remove(balloon);
                      score++;
                      // Play pop sound
                    });
                  },
                  child: Container(
                    width: 2 * BALLOON_RADIUS,
                    height: 2 * BALLOON_RADIUS,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: balloon.color,
                    ),
                  ),
                ),
              )),
          // Draw score
          Positioned(
            left: 20,
            top: 20,
            child: Text(
              'Score: $score',
              style: TextStyle(fontSize: GAME_FONT_SIZE, color: GREEN),
            ),
          ),
          // Draw missed count
          Positioned(
            left: 20,
            top: 50,
            child: Text(
              'Missed: $missed',
              style: TextStyle(fontSize: GAME_FONT_SIZE, color: RED),
            ),
          ),
          // Draw timer
          Positioned(
            left: 20,
            top: 80,
            child: Text(
              'Time: ${timer.toInt()}',
              style: TextStyle(fontSize: GAME_FONT_SIZE, color: YELLOW),
            ),
          ),
        ],
      ),
    );
  }

  void resetGame() {
    setState(() {
      balloons.clear();
      score = 0;
      missed = 0;
      timer = 120;
      gameStarted = true;
      startGameLoop();
    });
  }

  void startGameLoop() {
    Timer.periodic(Duration(milliseconds: 16), (timer) {
      if (!gameStarted) {
        timer.cancel();
        // Show game over dialog
      } else {
        setState(() {
          handleGameLogic();
        });
      }
    });
  }

  void handleGameLogic() {
    timer -= 1 / 60;
    if (timer <= 0) {
      gameStarted = false;
    }

    if (Random().nextDouble() < BALLOON_SPAWN_RATE) {
      Color color = [RED, GREEN, BLUE, YELLOW][Random().nextInt(4)];
      double x = Random().nextDouble() * (SCREEN_WIDTH - 2 * BALLOON_RADIUS) + BALLOON_RADIUS;
      double y = SCREEN_HEIGHT;
      balloons.add(Balloon(x: x, y: y, color: color));
    }

    balloons.forEach((balloon) {
      balloon.y -= BALLOON_SPEED;
    });

    balloons.removeWhere((balloon) {
      if (balloon.y + BALLOON_RADIUS < 0) {
        missed++;
        return true;
      }
      return false;
    });
  }
}

class Balloon {
  final double x;
  final double y;
  final Color color;

  Balloon({required this.x, required this.y, required this.color});
}
