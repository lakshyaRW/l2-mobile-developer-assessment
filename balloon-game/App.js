import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const BalloonGame = () => {
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  
  
   useEffect(() => {
    let timerInterval;
    if (gameRunning) {
      timerInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime === 0) {
            clearInterval(timerInterval);
            setGameRunning(false);
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [gameRunning]);

 useEffect(() => {
  let gameTimer;
  let balloonInterval;

  if (gameRunning) {
  
    balloonInterval = setInterval(() => {
      if (balloons.length < 8) { // Limiting balloons to a maximum of 5
        setBalloons(prevBalloons => [...prevBalloons, {
          id: Math.random().toString(),
          position: {
            x: Math.random() * (width - 50),
            y: height,
          },
          speed: Math.random() * 5+5,
          opacity: new Animated.Value(1),
        }]);
      }
    }, 1000); 

    gameTimer = setTimeout(() => {
      clearInterval(balloonInterval);
      setGameRunning(false);
    }, 120000); 

    return () => {
      clearInterval(balloonInterval);
      clearTimeout(gameTimer);
    };
  }
}, [gameRunning, balloons.length]);


  const handleBalloonPress = balloonId => {
    setBalloons(prevBalloons => prevBalloons.filter(balloon => balloon.id !== balloonId));
    setScore(prevScore => prevScore + 2);
  };

  const handleBalloonMiss = () => {
    setScore(prevScore => Math.max(0, prevScore - 1)); 
  };

  const moveBalloons = () => {
    setBalloons(prevBalloons =>
      prevBalloons.map(balloon => ({
        ...balloon,
        position: {
          x: balloon.position.x,
          y: balloon.position.y - balloon.speed,
        },
      })).filter(balloon => {
        if (balloon.position.y < -50) {
          handleBalloonMiss();
          return false;
        }
        return true;
      })
    );
  };

  useEffect(() => {
    if (gameRunning) {
      const moveInterval = setInterval(moveBalloons, 50);
      return () => clearInterval(moveInterval);
    }
  }, [moveBalloons]);

  const handleStartGame = () => {
    setScore(0);
    setBalloons([]);
    setTimeLeft(120);
    setGameRunning(true);
  };

  return (
    <View style={styles.container}>
      {gameRunning && (
        <>
          {balloons.map(balloon => (
            <TouchableOpacity
              key={balloon.id}
              style={[styles.balloon, { top: balloon.position.y, left: balloon.position.x, opacity: balloon.opacity }]}
              onPress={() => {
                Animated.timing(balloon.opacity, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }).start(() => {
                  handleBalloonPress(balloon.id);
                });
              }}
            />
          ))}
          <Text style={styles.timer}>Time Left: {timeLeft}</Text>
          <Text style={styles.score}>Score: {score}</Text>
        </>
      )}
      {!gameRunning && (
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
          <Text style={styles.finalScore}>Score: {score}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE5B4', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  balloon: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 25,
  },
  score: {
    position: 'absolute',
    top: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', 
  },
  timer: {
    position: 'absolute',
    top: 80,
    fontSize: 20,
    color: 'red',
  },
  startButton: {
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 15,
    backgroundColor: "black",
    color: "#fff",
    borderRadius: 10
  },
  finalScore: {
    fontSize: 20,
    color: 'purple', 
  },
});


export default BalloonGame;
