export class Box {
  #levels;
  #zone;
  #robots;

  constructor(level, zone, robots) {
    this.#levels = level;
    this.#zone = zone;
    this.#robots = robots;
  }

  makeTrades(cityName) {
    const cities = this.#levels.getCitys();

    const checkItems = async () => {
      await new Promise((resolve) => {
        if (cityName === "Main Airport") {
          const mainAirportData = cities[cityName];
          const boxesAtMain = this.#levels.getCurrentBoxCount();
          this.#levels.displayMessage(
            `👩🏼‍✈️ : Processing: Box, fuel, and onBoarding`,
            "green"
          );

          if (boxesAtMain > 0) {
            mainAirportData[2].box += boxesAtMain;
            const fuelGained = boxesAtMain / mainAirportData[2].exchangeRate;
            this.#levels.showLevel().totalFuel += Math.floor(fuelGained);
            this.#levels.setBox(0);
            this.#levels.showLevel().boxes = 0;
            mainAirportData[2].people += this.#levels.showLevel().people;
            this.#levels.showLevel().people = 0;
            this.#zone.updateHostZone(mainAirportData);
            this.#levels.updateNumberTrades();
          }
          resolve();
        }
      });

      await new Promise((resolve) => {
        if (this.#levels.getTrades() >= 0 && cityName === "Main Airport") {
          const mainAirportData = cities[cityName];
          if (mainAirportData[2].people >= 1300) {
            setTimeout(() => {
              this.#levels.displayMessage("You won this Level!");
              this.#levels.updateLevel();

              document
                .querySelectorAll(".pulse")
                .forEach((item) => item.remove());

              document
                .querySelectorAll(".menu")
                .forEach((item) => item.remove());
              this.#zone.createHostZone();
            }, 5000);

            if ((this.#levels.number = 1)) {
              this.#robots.displayRobot(400, 240, 5000);
              this.#robots.animate(5000);
            }

            document.getElementById("fuel").textContent = 4;
            document.getElementById("level").textContent = `Level ${
              this.#levels.number + 1
            }`;
          }

          if (this.#levels.getTrades() === 0) {
            this.#levels.makeGameOver();
            setTimeout(() => {
              setTimeout(() => {
                this.#levels.displayMessage("Game over, you have 0 Trades");
              }, 5000);
            }, 5000);
          }
        }
        resolve();
      });
    };

    checkItems();
  }
}
