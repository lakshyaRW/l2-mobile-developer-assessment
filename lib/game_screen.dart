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
  List<ScoreChange> _scoreChanges = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background Image
          Image.asset(
            'assets/background_image.png', 
            fit: BoxFit.cover,
          ),
          // Game UI
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (!_gameStarted)
                  ElevatedButton(
                    onPressed: _startGame,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      padding: EdgeInsets.symmetric(horizontal: 50, vertical: 20),
                    ),
                    child: Text(
                      'Start Game',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                SizedBox(height: 20),
                if (_gameStarted)
                  Text(
                    'Time Remaining: ${_secondsRemaining ~/ 60}:${_secondsRemaining % 60 < 10 ? '0' : ''}${_secondsRemaining % 60}',
                    style: TextStyle(fontSize: 20),
                  ),
                if (_gameStarted)
                  Expanded(
                    child: Stack(
                      children: [
                        _buildGameContent(),
                        // Trophy Box
                        Positioned(
                          bottom: 10,
                          left: 10,
                          child: Container(
                            padding: EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.emoji_events,
                                  color: Colors.yellow,
                                  size: 24,
                                ),
                                SizedBox(width: 10),
                                Text(
                                  '$_score',
                                  style: TextStyle(fontSize: 20),
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Score Change Widgets
                        ..._scoreChangeWidgets,
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGameContent() {
    return GestureDetector(
      onTap: _popBalloon,
      child: Stack(
        children: [
          ..._balloons.map((balloon) => Positioned(
                left: balloon.position.dx,
                bottom: balloon.position.dy,
                child: Image.asset(
                  balloon.imagePath,
                  width: MediaQuery.of(context).size.width * 0.5, 
                  height: MediaQuery.of(context).size.width * 0.5,
                ),
              )),
        ],
      ),
    );
  }

  List<Widget> get _scoreChangeWidgets {
    return _scoreChanges
        .map((scoreChange) => Positioned(
              left: scoreChange.position.dx,
              bottom: scoreChange.position.dy,
              child: Material(
                color: Colors.transparent,
                child: Text(
                  scoreChange.text,
                  style: TextStyle(
                    color: scoreChange.text.startsWith('+') ? Colors.green : Colors.red,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ))
        .toList();
  }

  void _startGame() {
    setState(() {
      _gameStarted = true;
    });
    _startBalloons();
    _startTimer();
  }

  void _startBalloons() {
    const balloonSpeed = 2;
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

      Timer.periodic(const Duration(milliseconds: 16), (timer) {
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
            _scoreChanges.add(ScoreChange(position: _balloons.first.position, text: '-1'));
            _removeScoreChangeAfterDelay(_scoreChanges.last); // Remove score change after 1 second
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
        _scoreChanges.add(ScoreChange(position: _balloons.first.position, text: '+2'));
        _removeScoreChangeAfterDelay(_scoreChanges.last); // Remove score change after 1 second
        _score += 2;
        _balloons.removeAt(0);
      });
    }
  }

  void _startTimer() {
    const gameDuration = Duration(minutes: 2);
    _gameTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
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
      _scoreChanges.clear();
    });
  }

  void _removeScoreChangeAfterDelay(ScoreChange scoreChange) {
    Future.delayed(Duration(seconds: 1), () {
      setState(() {
        _scoreChanges.remove(scoreChange);
      });
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

class ScoreChange {
  final Offset position;
  final String text;

  ScoreChange({required this.position, required this.text});
}

void main() {
  runApp(MaterialApp(
    home: GameScreen(),
  ));
}
