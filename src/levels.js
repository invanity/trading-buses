export class Levels {
  #level1;
  #number;
  #trades;
  #capacity;
  #people;

  constructor(container) {
    this.container = container;
    this.#number = 0;
    this.#capacity = { people: 520, box: 120, altitude: "31.000f - 433kts" };
    this.#people = 0;
    this.#trades = 5;
    if (container) {
      this.#level1 = [
        {
          boxes: 0,
          totalFuel: 4,
          people: 0,
          timeFly: 5,
          cTower: "👩‍✈️ Make transactions on the Main Airport, Low Fuel",
          cities: {
            Gdansk: [220, 440, { box: 13, people: 10, load: 6, fuel: 2 }],
            London: [100, 350, { box: 2, people: 130, load: 5, fuel: 1 }],
            Stockholm: [50, 520, { box: 5, people: 130, load: 6, fuel: 1 }],
            Oslo: [30, 50, { box: 10, people: 13, load: 5, fuel: 2 }],
            Bogota: [
              60,
              220,
              { box: 20, people: 300, load: 6, fuel: 5, required: 6 },
            ],
            "Main Airport": [
              200,
              100,
              { box: 0, people: 0, load: 6, fuel: 0, exchangeRate: 2 },
              [
                "KRK-AIRBUS: Complete 1300 passengers to Main Airport",
                "Max trades: 5",
              ],
            ],
          },
        },
        {
          boxes: 0,
          totalFuel: 4,
          people: 0,
          timeFly: 5,
          cTower: "👩‍✈️ Make transactions on the Main Airport, Low Fuel",
          cities: {
            Krakow: [
              60,
              220,
              { box: 1, people: 10, load: 5, fuel: 2, required: 3 },
            ],
            Triskaidekaphobia: [
              210,
              100,
              { box: 13, people: 13, load: 13, fuel: 13, required: 13 },
            ],
            Stavanger: [250, 360, { box: 2, people: 130, load: 5, fuel: 1 }],
            Dublin: [
              250,
              570,
              { box: 10, people: 13, load: 6, fuel: 2, required: 4 },
            ],
            Bratislava: [
              100,
              440,
              { box: 20, people: 100, load: 6, fuel: 5, required: 10 },
            ],
            "Main Airport": [
              60,
              100,
              { box: 0, people: 0, load: 1, fuel: 0, exchangeRate: 2 },
              [
                "KRK-AIRBUS: Complete 1300 passengers to Main Airport",
                "Max trades: 4",
              ],
            ],
          },
        },
      ];
    } else {
      this.#level1 = [
        {
          boxes: 0,
          totalFuel: 4,
          people: 0,
          timeFly: 5,
          cTower: "👩‍✈️ Make transactions on the Main Airport, Low Fuel",
          cities: {
            Gdansk: [290, 240, { box: 13, people: 10, load: 5, fuel: 2 }],
            London: [400, 150, { box: 2, people: 130, load: 6, fuel: 1 }],
            Stockholm: [350, 40, { box: 5, people: 130, load: 5, fuel: 1 }],
            Oslo: [30, 50, { box: 10, people: 13, load: 6, fuel: 2 }],
            Bogota: [
              60,
              220,
              { box: 20, people: 300, load: 6, fuel: 5, required: 6 },
            ],
            "Main Airport": [
              200,
              100,
              { box: 0, people: 0, load: 1, fuel: 0, exchangeRate: 2 },
              [
                "KRK-AIRBUS: Complete 1300 passengers to Main Airport",
                "Max trades: 5",
              ],
            ],
          },
        },
        {
          boxes: 0,
          totalFuel: 4,
          people: 0,
          timeFly: 5,
          cTower: "👩‍✈️ Make transactions on the Main Airport, Low Fuel",
          cities: {
            Krakow: [
              50,
              50,
              { box: 1, people: 10, load: 5, fuel: 2, required: 3 },
            ],
            Triskaidekaphobia: [
              400,
              240,
              { box: 13, people: 13, load: 13, fuel: 13, required: 13 },
            ],
            Stavanger: [250, 200, { box: 2, people: 130, load: 5, fuel: 1 }],
            Dublin: [
              350,
              70,
              { box: 10, people: 13, load: 6, fuel: 2, required: 4 },
            ],
            Bratislava: [
              100,
              240,
              { box: 20, people: 100, load: 6, fuel: 5, required: 10 },
            ],
            "Main Airport": [
              200,
              100,
              { box: 0, people: 0, load: 1, fuel: 0, exchangeRate: 2 },
              [
                "KRK-AIRBUS: Complete 1300 passengers to Main Airport",
                "Max trades: 4",
              ],
            ],
          },
        },
      ];
    }
  }

  displayMessage(msg, color = "white") {
    const gameTargets = async () => {
      try {
        await new Promise((resolve) => {
          const options = document.createElement("div");
          options.id = "warning";

          options.innerHTML = `${msg}`;
          options.classList.add("messages");
          options.style.color = `${color}`;
          document.querySelector(".airport").style.display = "block";
          document.querySelector(".airport").appendChild(options);

          setTimeout(() => {
            document.querySelector(".airport").style.display = "none";
            document.querySelector(".messages").remove();
          }, 4000);

          resolve();
        });
      } catch (error) {
        console.log(error);
      }
    };

    gameTargets();
  }

  getCitys() {
    return this.#level1[this.#number].cities;
  }

  showLevel() {
    return this.#level1[this.#number];
  }

  getTotalFuel() {
    return this.showLevel().totalFuel;
  }

  addBox(matchingCity) {
    const cityData = this.getCitys()[matchingCity];

    if (matchingCity !== "Main Airport" && cityData) {
      const activateChecks = async () => {
        try {
          await new Promise((resolve) => {
            this.#level1[this.#number].boxes += cityData[2].box;
            let passengersToAdd = cityData[2].people;
            if (this.#capacity.people >= this.#people + passengersToAdd) {
              this.#people += passengersToAdd;
              this.#level1[this.#number].people = this.#people;
            } else {
              setTimeout(() => {
                console.log("check capacity");
                this.displayMessage(
                  `👩🏼‍✈️ : Check KRK-AIRBUS Capacity Passengers or Fuel at: ${matchingCity}`,
                  "red"
                );
              }, 4000);
            }

            resolve();
          });
        } catch (error) {
          console.log(error);
        }
      };

      activateChecks();
    }
  }

  getCurrentBoxCount() {
    return this.#level1[this.#number].boxes;
  }

  setBox(newValue) {
    this.#level1[this.#number].boxes = newValue;
    this.#people = newValue;
  }

  getCurrentOnTripulation() {
    return this.#level1[this.#number].people;
  }

  makeTransactions() {
    const currentLevel = this.showLevel();
    if (currentLevel.totalFuel > 0) {
      currentLevel.totalFuel += 3;
    }
  }

  deductFuel() {
    const currentLevel = this.showLevel();
    if (currentLevel.totalFuel > 0) {
      currentLevel.totalFuel--;
    }

    const currentFuel = this.showLevel().totalFuel;
    if (currentFuel === 1) {
      this.displayMessage(this.showLevel().cTower);
    }

    if (currentFuel === 0) {
      this.makeGameOver();
      this.displayMessage("Game Over: The airplane ran out of fuel");
    }
  }

  makeGameOver() {
    const pulseElements = document.querySelectorAll(".pulse");
    pulseElements.forEach((element) => {
      element.remove();
    });
  }

  updateNumberTrades() {
    this.#trades--;
  }

  updateLevel() {
    this.#number++;
    this.#number;
  }

  getTrades() {
    return this.#trades;
  }
}
