import Matter from "matter-js";

import { getRandomColor, getRandomLocation } from "../utils/random";
import Balloon from "../components/Balloon";

export default (restart) => {
  let engine = Matter.Engine.create({ enableSleeping: false });

  let world = engine.world;

  const ballon1Pos = getRandomLocation();
  const ballon2Pos = getRandomLocation();
  const ballon3Pos = getRandomLocation();
  const ballon4Pos = getRandomLocation();

  Matter.gravity = 0;

  return {
    physics: { engine, world },

    Balloon1: Balloon(world, getRandomColor(), ballon1Pos, { width: 40 }),
    Balloon2: Balloon(world, getRandomColor(), ballon2Pos, { width: 40 }),
    Balloon3: Balloon(world, getRandomColor(), ballon3Pos, { width: 40 }),
    Balloon4: Balloon(world, getRandomColor(), ballon4Pos, { width: 40 }),
  };
};
