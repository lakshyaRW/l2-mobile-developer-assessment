import Matter, { Engine, Render } from "matter-js";
import React from "react";
import { View } from "react-native";

const Balloon = (props) => {
  const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
  const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

  const xBody = props.body.position.x - widthBody / 2;
  const yBody = props.body.position.y - heightBody / 2;

  const color = props.color;

  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 50,
        position: "absolute",
        left: xBody,
        top: yBody,
        width: widthBody,
        height: heightBody,
      }}
    />
  );
};

export default (world, color, pos, size) => {
  const initialBalloon = Matter.Bodies.circle(pos.x, pos.y, size.width, {
    label: "Balloon",
  });

  Matter.World.add(world, initialBalloon);

  return {
    body: initialBalloon,
    color,
    pos,
    renderer: <Balloon />,
  };
};
