export default class Zone {
  #container;
  #zone;
  #menu;
  #totalLevel;
  #options;

  constructor(container, totalLevel, options) {
    this.#container = container;
    this.#options = options;
    this.#totalLevel = totalLevel;
  }

  #makeCity(name, x, y, data) {
    const city = document.createElement("div");
    city.innerHTML = `<p>${name} 👨🏻‍✈️</p>
    <span style="--i:0"></span>
    <span style="--i:1"></span>
    <span style="--i:2"></span>
    `;

    city.classList.add("pulse");
    city.style.position = "absolute";
    city.style.zIndex = "5";
    city.style.color = "#FFF";
    city.style.left = `${x}px`;
    city.style.top = `${y}px`;
    city.style.padding = "5px";
    city.style.backgroundColor = "#cffafe";
    this.#zone = city;
  }

  #renderAllCities() {
    Object.entries(this.#totalLevel.getCitys()).forEach(
      ([cityName, [x, y, data]]) => {
        this.#makeCity(cityName, x, y, data);
        this.#makeMenu(cityName, x, y, data);
        this.#zone.appendChild(this.#menu);
        this.#container.appendChild(this.#zone);
      }
    );
  }

  createHostZone() {
    this.#renderAllCities();
  }

  updateHostZone(mainAirportData) {
    const mainAirportMenu = document.querySelector("#menu-main-airport"); // Select the Main Airport menu
    if (mainAirportMenu) {
      mainAirportMenu.innerHTML = `
        <li>P:${mainAirportData[2].people}</li>
        <li>B:${mainAirportData[2].box}</li>
        <li style="color: red;"> F:${mainAirportData[2]?.required ?? "1"}</li>`;
    } else {
      console.error("Main Airport menu not found.");
    }
  }

  #makeMenu(name, x, y, data) {
    const menu = document.createElement("ul");
    menu.innerHTML = `
      <li>P:${data.people}</li>
      <li>B:${data.box}</li>
      <li style="color: red;"> F:${data?.required ?? "1"}</li>`;
    menu.id = `menu-${name.toLowerCase().replace(/\s+/g, "-")}`;
    menu.classList.add("menu");
    menu.style.display = "flex";
    menu.style.gap = "2px";
    menu.style.flexDirection = "row";
    menu.style.gap = "3px";
    menu.style.listStyle = "none";
    menu.style.position = "absolute";
    menu.style.zIndex = "5";
    menu.style.fontSize = "13px";
    menu.style.color = "#FFF";
    menu.style.left = `-40px`;
    menu.style.top = `30px`;
    this.#menu = menu;
  }
}
