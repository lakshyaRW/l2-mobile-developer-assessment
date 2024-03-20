import Matter from "matter-js";
import { getRandomLocation } from "./utils/random";

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;

  touches
    .filter((t) => t.type === "press")
    .forEach((t) => {
      const touchX = t.event.pageX;
      const touchY = t.event.pageY;
      if (
        Math.abs(touchX - entities.Balloon1.body.position.x) < 50 &&
        Math.abs(touchY - entities.Balloon1.body.position.y) < 50
      ) {
        const newBalloonPos = getRandomLocation();
        Matter.Body.setPosition(entities.Balloon1.body, newBalloonPos);
        dispatch({ type: "new_point" });
      }

      if (
        Math.abs(touchX - entities.Balloon2.body.position.x) < 50 &&
        Math.abs(touchY - entities.Balloon2.body.position.y) < 50
      ) {
        const newBalloonPos = getRandomLocation();
        Matter.Body.setPosition(entities.Balloon2.body, newBalloonPos);
        dispatch({ type: "new_point" });
      }

      if (
        Math.abs(touchX - entities.Balloon3.body.position.x) < 50 &&
        Math.abs(touchY - entities.Balloon3.body.position.y) < 50
      ) {
        const newBalloonPos = getRandomLocation();
        Matter.Body.setPosition(entities.Balloon3.body, newBalloonPos);
        dispatch({ type: "new_point" });
      }

      if (
        Math.abs(touchX - entities.Balloon4.body.position.x) < 50 &&
        Math.abs(touchY - entities.Balloon4.body.position.y) < 50
      ) {
        const newBalloonPos = getRandomLocation();
        Matter.Body.setPosition(entities.Balloon4.body, newBalloonPos);
        dispatch({ type: "new_point" });
      }
    });

  Matter.Body.setVelocity(entities.Balloon1.body, {
    x: 0,
    y: -3,
  });
  Matter.Body.setVelocity(entities.Balloon2.body, {
    x: 0,
    y: -4,
  });
  Matter.Body.setVelocity(entities.Balloon3.body, {
    x: 0,
    y: -5,
  });
  Matter.Body.setVelocity(entities.Balloon4.body, {
    x: 0,
    y: -2,
  });

  const ballon1Pos = getRandomLocation();

  if (entities.Balloon1.body.bounds.max.y <= 0) {
    Matter.Body.setPosition(entities.Balloon1.body, ballon1Pos);
    dispatch({ type: "missed_point" });
  }

  if (entities.Balloon2.body.bounds.max.y <= 0) {
    Matter.Body.setPosition(entities.Balloon2.body, ballon1Pos);
    dispatch({ type: "missed_point" });
  }
  if (entities.Balloon3.body.bounds.max.y <= 0) {
    Matter.Body.setPosition(entities.Balloon3.body, ballon1Pos);
    dispatch({ type: "missed_point" });
  }
  if (entities.Balloon4.body.bounds.max.y <= 0) {
    Matter.Body.setPosition(entities.Balloon4.body, ballon1Pos);
    dispatch({ type: "missed_point" });
  }

  Matter.Engine.update(engine, time.delta);

  if (!entities.gameOverTimerStarted) {
    setTimeout(() => {
      // Game over logic here
      dispatch({ type: "game_over" });
    }, 2 * 60 * 1000 + 6 * 1000); //to make up for delay (no time to debug)
    entities.gameOverTimerStarted = true;
  }

  return entities;
};

export default Physics;
