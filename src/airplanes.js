export class Airplane {
  #controller;
  #airplaneElement;
  #leftX;
  #topY;
  #color;
  #gameContainer;
  #previouslyInZones = new Set(); // Track zones currently being touched
  #Levels;
  #isAvailable;
  #capacity;
  #box;
  #name;
  #lastValidX = 0; // Store the last valid X position
  #lastValidY = 0; // Store the last valid Y position

  constructor(controller, gameContainer, Levels, box) {
    if (new.target !== Airplane) {
      throw new Error("Airplane instances can't be created in this way");
    }
    this.#box = box;
    this.#isAvailable = true;
    this.#controller = controller;
    this.#airplaneElement = null;
    this.#leftX = 0;
    this.#topY = 0;
    this.#color = "red";
    this.#gameContainer = gameContainer;
    this.#Levels = Levels;
    this.#controller.addAirplane(this);
    this.#controller.setSelectedAirplane(this);
    this.#checkZones();
    this.#capacity = 54; // play with this
    this.#name = "Main Airport";
  }

  static createAirplane(controller, gameContainer, box, Levels) {
    return new Airplane(controller, gameContainer, box, Levels);
  }

  //make method to display capacity airplane

  #createAirplaneSVG() {
    const svgString = `
    <div style="font-Size: 34px; z-index: 99">️✈️</div>`;

    const template = document.createElement("template");
    template.innerHTML = svgString.trim();
    this.#airplaneElement = template.content.firstChild;

    this.#airplaneElement.addEventListener("mouseenter", () => {
      document.querySelector(".airplane-options").style.display = "block";
    });

    this.#airplaneElement.addEventListener("mouseleave", () => {
      document.querySelector(".airplane-options").style.display = "none";
    });
  }

  #setInitialPosition() {
    this.#leftX = 200;
    this.#topY = 100;
  }

  paintAirplane() {
    if (this.#airplaneElement === null) {
      this.#createAirplaneSVG();
    }

    this.#setInitialPosition();
    this.#airplaneElement.classList.add("airplane");
    this.#airplaneElement.style.position = "absolute";
    this.#airplaneElement.style.left = `${this.#leftX}px`;
    this.#airplaneElement.style.top = `${this.#topY}px`;
    this.#gameContainer.appendChild(this.#airplaneElement);
    this.#checkZones();
  }

  makeAvailable() {
    this.#isAvailable = !this.#isAvailable;
  }

  updateDisplays() {
    document.getElementById(
      "packages"
    ).innerHTML = `Box: ${this.#Levels.getCurrentBoxCount()}`;

    document.getElementById("fuel").innerHTML =
      this.#Levels.showLevel().totalFuel;

    document.getElementById(
      "tripulation"
    ).innerHTML = `Passengers: ${this.#Levels.getCurrentOnTripulation()}`;

    document.getElementById(
      "trades"
    ).innerHTML = `Trades: ${this.#Levels.getTrades()}`;

    if (this.#Levels.showLevel().totalFuel === 0) {
      this.#isAvailable = false;
    }
  }

  moveAirplane(targetX, targetY, duration) {
    if (this.#airplaneElement === null) return;
    if (!this.#isAvailable) return;

    const deltaX = targetX - (this.#leftX + 25);
    const deltaY = targetY - (this.#topY + 25);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    this.#airplaneElement.style.transform = `rotate(${angle}deg)`;
    this.#airplaneElement.style.transition = `left ${duration}s cubic-bezier(0.35, 0.41, 0.16, 1.11), top ${duration}s cubic-bezier(0.35, 0.41, 0.16, 1.11)`;
    this.#airplaneElement.style.left = `${targetX - 25}px`;
    this.#airplaneElement.style.top = `${targetY - 25}px`;
    this.#leftX = targetX - 25;
    this.#topY = targetY - 25;

    const onTransitionEnd = () => {
      this.#checkZones();

      this.#airplaneElement.removeEventListener(
        "transitionend",
        onTransitionEnd
      );
    };

    this.#airplaneElement.addEventListener("transitionend", onTransitionEnd);
  }

  #checkZones() {
    const zones = document.querySelectorAll(".pulse");
    const currentlyInZones = new Set();
    let enteredNewZone = false;
    let currentZone;

    zones.forEach((zone) => {
      if (this.isTouchingZone(zone)) {
        currentlyInZones.add(zone);
        currentZone = zone;

        if (!this.#previouslyInZones.has(zone)) {
          const cityText = zone.querySelector("p").textContent.trim();
          const cityName = cityText.replace(/[^a-zA-Z\s]/g, "").trim();

          const cities = this.#Levels.getCitys();
          const matchingCity = Object.keys(cities).find(
            (cityNameInList) =>
              cityNameInList.toLowerCase() === cityName.toLowerCase()
          );

          if (matchingCity) {
            const cityData = this.#Levels.getCitys()[matchingCity];

            if (this.#Levels.showLevel().totalFuel >= cityData[2].fuel) {
              this.#Levels.addBox(matchingCity);
              this.#box.makeTrades(matchingCity);
              this.#Levels.deductFuel();
              this.updateDisplays();
              enteredNewZone = true;
            }
          } else {
            console.log("City not found for:", cityName);
          }
        }
      }
    });

    if (enteredNewZone) {
      this.updateDisplays();

      const cityText = currentZone.querySelector("p").textContent.trim();
      const cityName = cityText.replace(/[^a-zA-Z\s]/g, "").trim();
      const cities = this.#Levels.getCitys();
      const matchingCity = Object.keys(cities).find(
        (cityNameInList) =>
          cityNameInList.toLowerCase() === cityName.toLowerCase()
      );

      if (matchingCity) {
        let time = 0; //reaplce by load
        let loading = 0;
        const cityData = cities[matchingCity];
        const load = cityData[2].load;
        const charging = document.createElement("progress");
        charging.setAttribute("max", "100");
        charging.setAttribute("value", time);
        charging.style.height = "10px";
        charging.style.width = "30px";
        charging.style.border = "none";
        charging.style.background = this.#color;
        currentZone.querySelector("p").appendChild(charging);
        const spans = currentZone.querySelectorAll("span");

        const makeIt = async () => {
          try {
            this.makeAvailable();

            await new Promise((resolve) => {
              const timeId = setInterval(() => {
                time++;
                const toLoad = 100 / load;
                loading = loading + toLoad;

                spans.forEach((span) => {
                  span.style.background = "red";
                });

                charging.setAttribute("value", `${loading}`);

                if (time === load) {
                  clearInterval(timeId);
                  currentZone.querySelector("p").removeChild(charging);
                  resolve();
                }
              }, 1000);
            });

            await new Promise((resolve) => {
              this.makeAvailable();
              spans.forEach((span) => {
                span.style.background = "#312e81";
              });

              setTimeout(() => {
                spans.forEach((span) => {
                  span.style.background = "#a5f3fc";
                });
              }, 5000);

              resolve();
            });
          } catch (error) {
            console.log(error);
          }
        };

        makeIt();
      } else {
        console.log("City not found for:", cityName);
      }
    }

    this.#previouslyInZones = currentlyInZones;
  }

  isTouchingZone(zoneElement) {
    if (!this.#airplaneElement) return false;

    const airplaneRect = this.#airplaneElement.getBoundingClientRect();
    const zoneRect = zoneElement.getBoundingClientRect();

    return !(
      airplaneRect.right < zoneRect.left ||
      airplaneRect.left > zoneRect.right ||
      airplaneRect.bottom < zoneRect.top ||
      airplaneRect.top > zoneRect.bottom
    );
  }
}

export class AirplaneController {
  #airplanes = [];
  #selectedAirplane = null;
  #Levels;
  #name;

  constructor(Levels) {
    this.#name = "Main Airport";
    this.#Levels = Levels;
    if (AirplaneController.instance) {
      return AirplaneController.instance;
    }
    AirplaneController.instance = this;
    this.showMission();

    document.addEventListener("click", (event) => {
      const targetElement = event.target;
      const isCityZone = targetElement.closest(".pulse");

      if (this.#selectedAirplane && isCityZone) {
        const gameRect = document
          .getElementById("game")
          .getBoundingClientRect();

        const targetX = event.clientX - gameRect.left;
        const targetY = event.clientY - gameRect.top;

        const clampedX = Math.max(25, Math.min(gameRect.width - 25, targetX));
        const clampedY = Math.max(25, Math.min(gameRect.height - 25, targetY));

        const cityText = isCityZone.querySelector("p").textContent.trim();
        const cityName = cityText.replace(/[^a-zA-Z\s]/g, "").trim();

        const cities = this.#Levels.getCitys();
        const matchingCity = Object.keys(cities).find(
          (cityNameInList) =>
            cityNameInList.toLowerCase() === cityName.toLowerCase()
        );

        if (matchingCity) {
          const cityData = this.#Levels.getCitys()[matchingCity];
          if (this.#Levels.showLevel().totalFuel >= cityData[2].fuel) {
            this.#selectedAirplane.moveAirplane(
              clampedX,
              clampedY,
              this.#Levels.showLevel().timeFly
            );
          } else {
            this.#Levels.displayMessage(
              `Check Airbus A13 Capacity at: ${matchingCity} `,
              "red"
            );
          }
        } else {
          console.log("City not found for:", cityName);
        }
      }
    });
  }

  #displayTargets() {
    const existingTarget = document.getElementById("target");
    if (existingTarget) {
      existingTarget.remove();
    }

    const target = document.createElement("div");
    target.id = "target";
    const msg = this.#Levels.getCitys()[this.#name][3];
    let x = ` <ul><li>Target: ${msg[0]}</li><li> ${msg[1]}</li></ul>`;

    target.innerHTML = x;
    document.getElementById("game").appendChild(target);

    setTimeout(() => {
      target.remove();
    }, 7000);
  }

  showMission() {
    setInterval(() => {
      this.#displayTargets();
    }, 10000);
  }

  addAirplane(airplane) {
    this.#airplanes.push(airplane);
  }

  setSelectedAirplane(airplane) {
    this.#selectedAirplane = airplane;
  }

  static getInstance() {
    return AirplaneController.instance || new AirplaneController();
  }
}
