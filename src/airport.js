export default class Airport {
  #element;
  constructor(element) {
    this.state_loading = 0;
    this.#element = element;
  }

  #airportStatus() {
    return this.state_loading;
  }

  show() {
    console.log(this.#airportStatus());
  }

  drawAirport() {
    const airport = document.createElement("div");
    airport.classList.add("airport");
    this.#element.appendChild(airport);
  }
}
