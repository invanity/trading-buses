import "./styles.css";
import { Airplane, AirplaneController } from "./airplanes.js";
import { Box } from "./Box.js";
import Zone from "./Zone.js";
import { Levels } from "./levels.js";
import { Players } from "./players.js";

document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game");

  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  const isMobile = isMobileDevice();

  const totalLevel = new Levels(isMobile);

  new AirplaneController(totalLevel);
  const zone = new Zone(gameContainer, totalLevel);
  zone.createHostZone();
  const robots = new Players(gameContainer, totalLevel);
  const robot2 = new Players(gameContainer, totalLevel);

  robots.displayRobot();
  robots.animate();
  const bx = new Box(totalLevel, zone, robot2);
  const controller = AirplaneController.getInstance();
  const airplane1 = Airplane.createAirplane(
    controller,
    gameContainer,
    totalLevel,
    bx
  );
  airplane1.paintAirplane();
});
