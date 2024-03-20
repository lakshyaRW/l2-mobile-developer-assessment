import { Dimensions } from "react-native";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomLocation = () => {
  const randomX = Math.floor(Math.random() * (windowWidth - 50));

  return { x: randomX, y: windowHeight + 100 };
};

export const getRandomColor = () => {
  const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
