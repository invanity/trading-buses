export class Players {
  #airplane;
  #gameContainer;
  #totalLevel;

  constructor(gameContainer, totalLevel) {
    this.#gameContainer = gameContainer;
    this.#totalLevel = totalLevel;
  }

  #createAirplane(x = "30", y = "210") {
    const robot = `<div style="font-Size: 34px; z-index: 99">️✈️</div>`;
    const template = document.createElement("template");
    template.innerHTML = robot.trim();
    this.#airplane = template.content.firstChild;
    this.#airplane.style.position = "absolute";
    this.#airplane.style.left = `${x}px`;
    this.#airplane.style.bottom = `${y}px`;
    this.#gameContainer.appendChild(this.#airplane);
  }

  displayRobot(x, y) {
    this.#createAirplane(x, y);
  }

  #flyingRobot(a, b) {
    this.#airplane.style.left = `${a}px`;
    this.#airplane.style.top = `${b}px`;
    this.#airplane.style.transition =
      "left 4s cubic-bezier(0.35, 0.41, 0.16, 1.11), top 4s cubic-bezier(0.35, 0.41, 0.16, 1.11)";
  }

  animate(speed = 9000) {
    setInterval(() => {
      const cityNames = Object.keys(this.#totalLevel.getCitys());
      const randomCityName =
        cityNames[Math.floor(Math.random() * cityNames.length)];

      // Extract x and y from the selected city's data
      const [x, y] = this.#totalLevel.getCitys()[randomCityName];

      this.#flyingRobot(x, y);
    }, speed);
  }
}
