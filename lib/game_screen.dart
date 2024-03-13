import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';

class GameScreen extends StatefulWidget {
  @override
  _GameScreenState createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  bool _gameStarted = false;
  int _score = 0;
  List<Balloon> _balloons = [];
  late Timer _gameTimer;
  int _secondsRemaining = 120;
  bool _showScoreAnimation = false; // Flag to control the animation visibility

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Balloon Pop Game'),
      ),
      body: Center(
        child: Column(
          children: [
            if (_gameStarted) // Show time display only when game is started
              SizedBox(height: 20),
            if (_gameStarted)
              Text(
                'Time Remaining: ${_secondsRemaining ~/ 60}:${_secondsRemaining % 60 < 10 ? '0' : ''}${_secondsRemaining % 60}',
                style: TextStyle(fontSize: 20),
              ),
            Expanded(
              child: _gameStarted
                  ? Stack(
                      children: [
                        _buildGameContent(),
                        Positioned(
                          top: 10,
                          right: 10,
                          child: Text(
                            'Score: $_score',
                            style: TextStyle(fontSize: 20),
                          ),
                        ),
                        if (_showScoreAnimation)
                          Center(
                            child: Text(
                              '+2',
                              style: TextStyle(fontSize: 24, color: Colors.green),
                            ),
                          ),
                      ],
                    )
                  : Center(
                      child: ElevatedButton(
                        onPressed: _startGame,
                        style: ElevatedButton.styleFrom(
                          primary: Colors.orange,
                          padding: EdgeInsets.symmetric(horizontal: 40, vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          elevation: 5,
                        ),
                        child: Text(
                          'Start Game',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGameContent() {
    return GestureDetector(
      onTap: () => _popBalloon(),
      child: Stack(
        children: _balloons
            .map((balloon) => Positioned(
                  left: balloon.position.dx,
                  bottom: balloon.position.dy,
                  child: Image.asset(
                    balloon.imagePath,
                    width: 80, // Adjust the size as needed
                    height: 120,
                  ),
                ))
            .toList(),
      ),
    );
  }

  void _startGame() {
    setState(() {
      _gameStarted = true;
    });
    _startBalloons();
    _startTimer();
  }

  void _startBalloons() {
    const balloonSpeed = 1.0;
    const balloonInterval = Duration(seconds: 1);

    _gameTimer = Timer.periodic(balloonInterval, (timer) {
      setState(() {
        _balloons.add(Balloon(
          position: Offset(
            Random().nextInt(MediaQuery.of(context).size.width.toInt()).toDouble(),
            0,
          ),
          imagePath: 'assets/balloons${Random().nextInt(5) + 1}.png',
        ));
      });

      Timer.periodic(Duration(milliseconds: 16), (timer) {
        setState(() {
          _balloons = _balloons.map((balloon) {
            return Balloon(
              position: Offset(balloon.position.dx, balloon.position.dy + balloonSpeed),
              imagePath: balloon.imagePath,
            );
          }).toList();
        });

        if (_balloons.isNotEmpty && _balloons.first.position.dy > MediaQuery.of(context).size.height) {
          setState(() {
            _balloons.removeAt(0);
            _score--;
          });
          timer.cancel();
        }
      });
    });
  }

  void _popBalloon() {
    if (_balloons.isNotEmpty) {
      setState(() {
        _score += 2;
        _showScoreAnimation = true; // Display the +2 animation
      });
      Future.delayed(Duration(milliseconds: 500), () {
        setState(() {
          _showScoreAnimation = false; // Hide the +2 animation after a delay
        });
      });
      _balloons.removeAt(0);
    }
  }

  void _startTimer() {
    const gameDuration = Duration(minutes: 2);
    _gameTimer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        if (_secondsRemaining > 0) {
          _secondsRemaining--;
        } else {
          _endGame();
        }
      });
    });
  }

  void _endGame() {
    _gameTimer.cancel();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Game Over'),
        content: Text('Your score: $_score'),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _resetGame();
            },
            child: Text('Play Again'),
          ),
        ],
      ),
    );
  }

  void _resetGame() {
    setState(() {
      _gameStarted = false;
      _score = 0;
      _secondsRemaining = 120;
      _balloons.clear();
    });
  }

  @override
  void dispose() {
    _gameTimer.cancel();
    super.dispose();
  }
}

class Balloon {
  final Offset position;
  final String imagePath;

  Balloon({required this.position, required this.imagePath});
}
