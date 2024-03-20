import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const App = () => {
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [missedCount, setMissedCount] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);

  const [fadeInAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let timerInterval;
    if (gameRunning) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
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
        if (balloons.length < 8) {
          setBalloons((prevBalloons) => [...prevBalloons, generateBalloon()]);
        }
      }, 2000);

      gameTimer = setTimeout(() => {
        clearInterval(balloonInterval);
        setGameRunning(false);
      }, 10000); // Game lasts for 30 seconds
      return () => {
        clearInterval(balloonInterval);
        clearTimeout(gameTimer);
      };
    }
  }, [gameRunning, balloons.length]);

  const generateBalloon = () => {
    const colors = ["#FF1493", "#800080", "#FFA500", "red", "green"];
    const shapes = ["circle", "heart", "star", "triangle"];
    const patterns = ["stripes", "polka dots", "chevron", "zigzag"];
    
    const balloonSize = 60;
    const borderRadius = balloonSize / 2;
    
    return {
      id: Math.random().toString(),
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      position: {
        x: Math.random() * (windowWidth - balloonSize),
        y: windowHeight,
      },
      size: balloonSize,
      borderRadius: borderRadius,
      speed: Math.random() * 5 + 5,
    };
  };
  

  const handleBalloonMiss = () => {
    setMissedCount((prevCount) => prevCount + 1);
    setScore((prevScore) => Math.max(0, prevScore - 1));
  };

  const moveBalloons = () => {
    setBalloons((prevBalloons) =>
      prevBalloons
        .map((balloon) => ({
          ...balloon,
          position: {
            x: balloon.position.x,
            y: balloon.position.y - balloon.speed,
          },
        }))
        .filter((balloon) => {
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
  }, [moveBalloons, gameRunning]);

  const handleStartGame = () => {
    setScore(0);
    setBalloons([]);
    setTimeLeft(30);
    setMissedCount(0);
    setPoppedCount(0);
    setGameRunning(true);
  };

  const handlePlayAgain = () => {
    setScore(0);
    setMissedCount(0);
    setPoppedCount(0);
    setTimeLeft(30);
    setGameRunning(true);
    setBalloons([]);
  };

  return (
    <View style={styles.container}>
      {gameRunning ? (
        <>
          <Text style={styles.timer}>Time Left: {timeLeft}</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.missed}>Balloons Missed: {missedCount}</Text>
          <Text style={styles.popped}>Balloons Popped: {poppedCount}</Text>
          <View style={styles.balloonContainer}>
            {balloons.map((balloon) => (
              <TouchableOpacity
                key={balloon.id}
                onPress={() => handleBalloonPress(balloon.id)}
                style={[
                  styles.balloon,
                  {
                    backgroundColor: balloon.color,
                    top: balloon.position.y,
                    left: balloon.position.x,
                  },
                ]}
              />
            ))}
          </View>
        </>
      ) : timeLeft > 0 ? (
        <>
          <Animated.Text style={[styles.title, { opacity: fadeInAnim }]}>
            Balloon Popper
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { opacity: fadeInAnim }]}>
            Pop as many balloons as you can!
          </Animated.Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartGame}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.endScreen}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text style={styles.scoreText}>Your Score: {score}</Text>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={handlePlayAgain}
          >
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E86C1",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#6C3483",
  },
  startButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "blue",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  topContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timer: {
    position: "absolute",
    top: 30,
    left: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  score: {
    position: "absolute",
    top: 30,
    right: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  missed: {
    position: "absolute",
    top: 70,
    left: 90,
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
  },
  popped: {
    position: "absolute",
    top: 100,
    right: 95,
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  balloonContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  balloon: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  finalScore: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  playAgainButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  playAgainButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 10,
  },
  gameOverText: {
    left: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "red", // Example color
    marginBottom: 10,
  },
});

export default App;
