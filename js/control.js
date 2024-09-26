import { fun, select, cList } from "./script.js";
import { index } from "./index.js";

class Control {
  constructor() {
    this.initCountry = this.initCountry.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  /**
   * ?Handles click events and triggers corresponding actions.
   * @param {Event} e - The click event.
   */
  async handleClick(e) {
    //?---------------------------------[Action]
    const switchMode = cList.closest(e.target, `[data-action="switch"]`);
    const switchFilter = cList.closest(e.target, `[data-action="filter"]`);
    const switchHome = cList.closest(e.target, `[data-action="home"]`);
    const search = cList.closest(e.target, `[data-action="search"]`);
    const region = cList.closest(e.target, `[data-region]`);
    const country = cList.closest(e.target, `[data-display="country-card"]`);
    const border = cList.closest(e.target, `[data-display="border"]`);
    //?------------------------------[Condition]
    if (switchMode) fun.switchMode();
    if (switchFilter) fun.switchFilter();
    if (switchHome) fun.switchToHome();
    if (region) this.initRegion(e);
    if (search) this.initName(search);
    if (country) this.initDetails(country);
    if (border) this.initBorderDetails(border, e);
  }

  /**
   *? Handles keydown events for keyboard interactions.
   * @param {Event} e - The keydown event.
   */
  async handleKey(e) {
    // ?--------------------------------[Elements]
    const input = cList.closest(e.target, `[data-input="search"]`);
    const switchModeElement = cList.closest(e.target, `[data-action="switch"]`);
    const switchFilterElement = cList.closest(
      e.target,
      `[data-action="filter"]`
    );
    const regionElement = cList.closest(e.target, `[data-region]`);
    const countryElement = cList.closest(
      e.target,
      `[data-display="country-card"]`
    );
    //  ?--------------------------------[Actions]
    const key = e.key === "Enter";
    const submit = input && key;
    const switchMode = switchModeElement && key;
    const switchFilter = switchFilterElement && key;
    const region = regionElement && key;
    const country = countryElement && key;
    // ?>--------------------------------[Condition]
    if (submit) this.initName(input);
    if (switchMode) fun.switchMode();
    if (switchFilter) fun.switchFilter();
    if (region) this.initRegion(e);
    if (country) this.initDetails(countryElement);
  }

  /**
   * ?Initializes country data and renders it on the page.
   */
  async initCountry() {
    const countryData = await fun.returnCounty();
    const grid = select.el(document, `[data-display="country-card"]`);
    index.htmlCardMarkup(grid, countryData);
    fun.lazyLoadImages();
  }

  /**
   * ?Initializes country data based on the selected region.
   * @param {Event} e - The event from which to extract the region.
   */
  async initRegion(e) {
    const region = fun.getRegion(e);
    const countryData = await fun.returnCounty(region, true);
    const grid = select.el(document, `[data-display="country-card"]`);
    index.htmlCardMarkup(grid, countryData);
    fun.lazyLoadImages();
  }

  /**
   *? Initializes country data based on the search input.
   * @param {Event} e - The search input event.
   */
  async initName(e) {
    const regex = /^[A-Za-z]+$/;
    const country = fun.getCountryName(e).trim();
    if (!regex.test(country)) return;
    const countryData = await fun.returnCounty(country, false, true);
    const grid = select.el(document, `[data-display="country-card"]`);
    index.htmlCardMarkup(grid, countryData);
    fun.lazyLoadImages();
  }

  /**
   *? Initializes detailed view for the selected country or border.
   * @param {HTMLElement} e - The element representing the country or border.
   * @param {boolean} border - Indicates if it's a border country.
   */
  async initDetails(e, border) {
    let name;
    border ? (name = fun.getBorderName(e)) : (name = fun.getCountryDetail(e));
    const countryData = await fun.returnDetailsCountry(name);
    const article = select.el(document, `[data-display="country-details"]`);
    index.htmlCountryMarkup(article, countryData);
    fun.switchToDetail();
    fun.lazyLoadImages();
    //?---------------------[border]
    const borderData = await fun.returnBorderCountry(name);
    const grid = select.el(document, `[data-display="border-countries"]`);
    index.htmlBorderMarkup(grid, borderData);
  }

  /**
   * ?Initializes details for a border country.
   * @param {HTMLElement} el - The border element.
   * @param {Event} e - The event object.
   */
  async initBorderDetails(el, e) {
    e.preventDefault();
    this.initDetails(el, true);
  }
}

const control = new Control();

/**
 *? Initializes the DOM elements and sets up event listeners.
 */
const initDom = async () => {
  const form = select.el(document, `[data-display="find"]`);
  control.initCountry();
  fun.setInitialMode();
  fun.observeCountryState();
  fun.displayPopup();
  form.addEventListener("submit", (e) => e.preventDefault());
  document.body.addEventListener("click", control.handleClick);
  document.addEventListener("keydown", control.handleKey);
};

document.addEventListener("DOMContentLoaded", initDom);
