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
    // Generate balloons at a constant rate
    balloonInterval = setInterval(() => {
  if (balloons.length < 10) { // 10 balloons at a time
    setBalloons(prevBalloons => [...prevBalloons, {
      id: Math.random().toString(),
      position: {
        x: Math.random() * (width - 50),
        y: height,
      },
      speed: Math.random() * 7 +7, // Range from 4 to 8
      opacity: new Animated.Value(1),
    }]);
  }
}, Math.random() * 2000 + 500); // Generate a balloon with a random interval between 500ms and 2500ms


    // timer for 2 minutes
    gameTimer = setTimeout(() => {
      clearInterval(balloonInterval);
      setGameRunning(false);
    }, 120000); //120 seconds or 2 minutes

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
          
          <Text style={[styles.timer, {fontSize: 20, fontWeight: 'bold'}]}>Timer: {timeLeft}</Text>
          <Text style={[styles.score, {fontSize: 20, fontWeight: 'bold'}]}>Score: {score}</Text>

        
        </>
      )}
      
      {!gameRunning && (
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.title}>Balloon Game</Text>
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
    backgroundColor: '#2D7A6E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#FFF',
  marginBottom: 20, // Adjust spacing as needed
},

  
  balloon: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#F3C9F2',
    borderRadius: 25,
  },
  score: {
  position: 'absolute',
  top: 50,
  fontSize: 24,
  fontWeight: 'bold',
  color: '#FFF',
  right: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  padding: 5,
  borderRadius: 10, 
},
timer: {
  position: 'absolute',
  top: 50,
  fontSize: 20,
  fontWeight: 'bold',
  color: '#FFF',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  padding: 5, 
  borderRadius: 10,
},

  startButton: {
    alignItems: 'center',
  },
  startButtonText: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 10,
  padding: 15,
  backgroundColor: "#000",
  color: "#FFF",
  borderRadius: 15
},
finalScore: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#FFF',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  padding: 5, 
  borderRadius: 10, 
},

});

export default BalloonGame;
