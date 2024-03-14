import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import "./assets/balloon2.png"

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
      if (balloons.length < 5) { 
        setBalloons(prevBalloons => [...prevBalloons, {
          id: Math.random().toString(),
          position: {
            x: Math.random() * (width - 50),
            y: height,
          },
          speed: Math.random() * 2 + 2,
          opacity: new Animated.Value(1),
        }]);
      }
    }, 1000);

    gameTimer = setTimeout(() => {
      clearInterval(balloonInterval);
      setGameRunning(false);
    }, 120000); // 120 seconds or 2 minutes

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
            <Text key={balloon.id}
              style={[styles.balloon, { top: balloon.position.y, left: balloon.position.x, opacity: balloon.opacity }]}
              onPress={() => {
                Animated.timing(balloon.opacity, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }).start(() => {
                  handleBalloonPress(balloon.id);
                });
              }}><Image style={styles.balloonimg} source={require('./assets/balloon3.png')} /></Text>
            
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
    backgroundImage: 'url("https://images.pexels.com/photos/4976595/pexels-photo-4976595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balloon: {
    position: 'absolute',
    fontSize: 50,
}
,
  score: {
    position: 'absolute',
    top: 20,
    fontWeight: 'bold',
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
  fontSize: 14
    
  },
    timer: {
    position: 'absolute',
    top: 75,
    backgroundColor: "#fff",
    padding: 10,
   fontSize: 14



  },
  startButton: {
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: 10
  },
  finalScore: {
    fontSize: 20,
    color : "#fff"
  },
  balloonimg: {
    width: 50,
    height: 50
  }
});

export default BalloonGame;
