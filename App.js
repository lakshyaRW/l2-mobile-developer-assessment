import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import entities from "./entities";
import Physics from "./physics";
import { useEffect, useState } from "react";

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setgameEngine] = useState(null);
  const [currentpoints, setCurrentpoints] = useState(0);
  const [missedpoints, setMissedpoints] = useState(0);
  const [timer, settimer] = useState(120);

  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    var formattedSeconds =
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    return formattedMinutes + ":" + formattedSeconds;
  }

  useEffect(() => {
    if (running && timer > 0) {
      const interval = setInterval(() => {
        settimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [running, timer]);

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          fontSize: 32,
          fontWeight: "bold",
        }}
      >
        Score: {currentpoints * 2 - missedpoints}
      </Text>
      <Text
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          fontSize: 32,
          fontWeight: "bold",
        }}
      >
        Popped: {currentpoints}
      </Text>
      <Text
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          fontSize: 32,
          fontWeight: "bold",
        }}
      >
        Missed: {missedpoints}
      </Text>
      <Text
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          fontSize: 32,
          fontWeight: "bold",
        }}
      >
        {formatTime(timer)}
      </Text>

      <GameEngine
        ref={(ref) => {
          setgameEngine(ref);
        }}
        onEvent={(e) => {
          switch (e.type) {
            case "game_over":
              setRunning(false);
              gameEngine.stop();
              break;

            case "new_point":
              setCurrentpoints(currentpoints + 1);
              break;

            case "missed_point":
              setMissedpoints(missedpoints + 1);
              break;
          }
        }}
        systems={[Physics]}
        entities={entities()}
        running={running}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <StatusBar style="auto" hidden={true} />
      </GameEngine>

      {!running ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            onPress={() => {
              setCurrentpoints(0);
              setMissedpoints(0);
              setRunning(true);
              settimer(120);
              gameEngine.swap(entities());
            }}
            style={{
              backgroundColor: "black",
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 30,
              }}
            >
              Start Game
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
