// Utility functions for class manipulation
export const cList = {
  add: (el, cl) => el.classList.add(cl),
  rem: (el, cl) => el.classList.remove(cl),
  tog: (el, cl) => el.classList.toggle(cl),
  closest: (el, cl) => el.closest(cl),
  contains: (el, cl) => el.classList.contains(cl),
};

// Utility functions for element selection
export const select = {
  el: (sl, el) => sl.querySelector(el),
  eAll: (sl, el) => sl.querySelectorAll(el),
};

class Country {
  constructor() {
    this.isTrue = true;
    this.setInitialMode();
  }
  /**
   * ?Checks if the filter is currently active.
   * @returns {boolean} - True if active, false otherwise.
   */
  _filterIsActive() {
    const filter = select.el(document, `[data-display="filter"]`);
    const isActive = cList.contains(filter, "filter--is-active");
    return isActive;
  }

  /**
   * ?Sets focus on the specified elements by adding a tabindex attribute.
   * @param {HTMLElement[]} elements - The elements to focus.
   */
  _setFocus(elements) {
    elements.forEach((element) => element.setAttribute("tabindex", "0"));
  }

  /**
   *? Executes a function after a specified delay.
   * @param {Function} fuc - The function to execute.
   * @param {number} time - Delay time in seconds.
   */
  setTime(fuc, time) {
    setTimeout(() => fuc(), time * 1000);
  }

  /**
   * ?Toggles dark mode for the body and navigation elements.
   */
  switchMode() {
    const mode = select.el(document, `[data-display="figure"]`);
    const isDarkMode = cList.tog(document.body, "dark--mode");
    cList.tog(mode, "nav--dark");

    localStorage.setItem("darkMode", isDarkMode);
  }

  /**
   *? Toggles the filter and sets focus on region items if opened.
   */
  switchFilter() {
    const options = select.el(document, `[data-display="filter"]`);
    const regionItem = select.eAll(document, `[data-region]`);
    cList.tog(options, "filter--is-active");
    const isOpened = this._filterIsActive();
    if (isOpened);
    this._setFocus(regionItem);
  }

  /**
   * ?Transitions to the country detail view with animations.
   */
  switchToDetail() {
    let time = 0.6;
    let timeDisplay = 0.7;
    const find = select.el(document, `[data-display="find"]`);
    const country = select.el(document, `[data-display="country-card"]`);
    const countryDetail = select.el(
      document,
      `[data-display="country-details"]`
    );
    cList.add(find, "hidden");
    cList.add(country, "hidden");
    cList.add(countryDetail, "hidden");
    cList.rem(countryDetail, "hide");

    this.setTime(() => {
      cList.add(find, "hide");
      cList.add(country, "hide");
    }, time);
    this.setTime(() => cList.rem(countryDetail, "hidden"), timeDisplay);
  }

  /**
   *? Transitions back to the home view with animations.
   */
  switchToHome() {
    let time = 0.6;
    let timeDisplay = 0.7;
    const find = select.el(document, `[data-display="find"]`);
    const country = select.el(document, `[data-display="country-card"]`);
    const countryDetail = select.el(
      document,
      `[data-display="country-details"]`
    );

    cList.add(countryDetail, "hidden");
    this.setTime(() => {
      cList.add(countryDetail, "hide");
      cList.rem(find, "hide");
      cList.rem(country, "hide");
    }, time);

    this.setTime(() => {
      cList.rem(find, "hidden");
      cList.rem(country, "hidden");
    }, timeDisplay);
  }

  //
  /**
   *? Retrieves the region from the event target.
   * @param {Event} e - The event object.
   * @returns {string} - The region name.
   */
  getRegion(e) {
    const region = e.target.getAttribute("data-region");
    return region;
  }

  /**
   * ?Retrieves the country name from the search input.
   * @param {HTMLElement} e - The input element.
   * @returns {string} - The country name.
   */
  getCountryName(e) {
    const parent = e.parentNode;
    const target = select.el(parent, `[data-input="search"]`);
    return target.value;
  }

  /**
   * ?Retrieves the name of a country from the event target.
   * @param {HTMLElement} e - The event element.
   * @returns {string} - The country name.
   */
  getCountryDetail(e) {
    const nameElement = select.el(e, `[data-display="name"]`);
    const name = nameElement.textContent.trim();
    return name;
  }

  /**
   *? Retrieves the border country name from an element.
   * @param {HTMLElement} el - The element containing the border name.
   * @returns {string} - The border country name.
   */
  getBorderName(el) {
    return el.textContent.trim();
  }

  //!=========================================================================[Async]

  /**
   * ?Fetches data for all countries from the API.
   * @returns {Promise<Object[]|null>} - Array of country data or null on error.
   */
  async _fetchData() {
    try {
      const res = await fetch(`https://restcountries.com/v3.1/all`);
      if (!res.ok) throw new Error("Poor Internet connection");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * ?Fetches data for countries in a specific region.
   * @param {string} region - The region to fetch.
   * @returns {Promise<Object[]|null>} - Array of country data or null on error.
   */
  async _fetchDataRegion(region) {
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/region/${region}`
      );
      if (!res.ok) throw new Error("Poor Internet connection");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   *? Fetches data for a country by name.
   * @param {string} name - The name of the country.
   * @returns {Promise<Object[]|null>} - Country data or null on error.
   */
  async _fetchDataName(name) {
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
      if (!res.ok) {
        this.isTrue = false;
        throw new Error("Country not Found");
      }
      const data = await res.json();
      this.isTrue = true;
      return data;
    } catch (error) {
      console.error(error);
      this.isTrue = false;
      return null;
    }
  }

  /**
   *? Fetches neighbor country data by border code.
   * @param {string} border - The border code of the neighbor country.
   * @returns {Promise<string|null>} - Neighbor country name or null on error.
   */
  async _fetchNeighborName(border) {
    try {
      const neighborResponse = await fetch(
        `https://restcountries.com/v3.1/alpha/${border}`
      );
      if (!neighborResponse.ok) throw new Error("Neighbor country not found");
      const neighborData = await neighborResponse.json();
      return neighborData[0].name.common;
    } catch (error) {
      console.error(error, "Something went wrong!");
    }
  }

  /**
   * ?Transforms fetched country data into a simplified format.
   * @param {Object[]} res - Array of country data.
   * @returns {Promise<Object[]>} - Simplified country data.
   */
  async _getDataAllCountries(res) {
    const [...data] = res;
    return data.map((data) => ({
      country: data.name.common,
      flag: data.flags.png,
      capital: data.capital,
      region: data.region,
      population: data.population,
    }));
  }

  /**
   * ?Extracts detailed information about a country.
   * @param {Object[]} res - Array of country data.
   * @returns {Promise<Object|null>} - Detailed country info or null.
   */
  async _getCountryDetails(res) {
    const [data] = await res;
    if (res)
      return {
        name: data.name.common,
        native: Object.values(data.name.nativeName)[0]?.official,
        population: data.population,
        region: data.region,
        flag: data.flags.png,
        subRegion: data.subregion,
        capital: data.capital.join(),
        tld: data.tld[0],
        currency: Object.values(data.currencies)[0]?.name,
        languages: Object.values(data.languages).join(),
      };
  }

  /**
   *? Returns country data based on criteria (region or name).
   * @param {string} criteria - The search criteria (region or name).
   * @param {boolean} isRegion - Whether the criteria is a region.
   * @param {boolean} isName - Whether the criteria is a name.
   * @returns {Promise<Object[]>} - Array of country data.
   */
  async returnCounty(criteria, isRegion, isName) {
    let data;
    switch (true) {
      case isRegion:
        data = await this._fetchDataRegion(criteria);
        break;
      case !isRegion && isName:
        data = await this._fetchDataName(criteria);
        break;
      default:
        data = await this._fetchData();
        break;
    }
    return data ? this._getDataAllCountries(data) : [];
  }

  /**
   * ?Returns detailed information about a specified country.
   * @param {string} name - The name of the country.
   * @returns {Promise<Object|null>} - Country details or null.
   */
  async returnDetailsCountry(name) {
    const data = await this._fetchDataName(name);
    if (!data || data.length === 0) return null;
    const countryDetails = await this._getCountryDetails(data);
    return countryDetails;
  }

  /**
   * ?Returns names of neighboring countries for a specified country.
   *
   * @param {string} name - The name of the country.
   * @returns {Promise<Object|null>} - Object containing neighbor names or null.
   */
  async returnBorderCountry(name) {
    const data = await this._fetchDataName(name);
    const [borderObj] = data;
    const borderArray = borderObj.borders;
    if (!borderArray || borderArray.length < 1) return;
    const neighborNames = await Promise.all(
      borderArray.map((border) => this._fetchNeighborName(border))
    );
    return { neighborNames };
  }
  //!========================================[Lazy load]
  /**
   * ?Initiates lazy loading for images with the 'data-lazy-img' attribute.
   */
  lazyLoadImages() {
    const images = select.eAll(document, `[data-lazy-img]`);
    const observerOptions = this._options(0.1);
    const lazyImgObserver = new IntersectionObserver(
      this._handleLazyImg,
      observerOptions
    );
    images.forEach((img) => lazyImgObserver.observe(img));
  }

  /**
   * ?Handles image loading when the observed image enters the viewport.
   *
   * @param {IntersectionObserverEntry[]} entries - The observed entries.
   * @param {IntersectionObserver} observer - The observer instance.
   */
  _handleLazyImg(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const imgScr = img.dataset.src;
      img.src = imgScr;
      img.addEventListener("load", () => {
        const parent = img.parentNode;
        cList.rem(parent, "lazy--img-container");
        cList.rem(img, "lazy--img");
      });
      observer.unobserve(img);
    });
  }

  /**
   * ?Returns options for the IntersectionObserver.
   * @param {number} threshold - The visibility threshold for triggering the observer.
   * @returns {Object} - The options object.
   */
  _options(threshold) {
    return {
      root: null,
      threshold: threshold,
    };
  }
  //!===========================================[MutationObserver]

  /**
   * ?Toggles classes on an element based on the state.
   *
   * @param {HTMLElement} el - The element to update.
   * @param {number} time - Delay time for class changes.
   * @param {boolean} state - Indicates if the element is found.
   */
  countryState(el, time, state) {
    if (state) {
      cList.rem(el, "is--not-found");
      this.setTime(() => cList.add(el, "hide"), time);
    }
    if (!state) {
      cList.add(el, "is--not-found");
      this.setTime(() => cList.rem(el, "hide"), time);
    }
  }

  /**
   * ?Updates the error state based on the existence of a country.
   */
  updateState() {
    let time = 0.41;
    const errorElement = select.el(document, `[data-display="not-found"]`);
    const countryExist = this.isTrue;
    countryExist
      ? this.countryState(errorElement, time, true)
      : this.countryState(errorElement, time, false);
  }

  /**
   * ?Observes changes to the country card and updates the state accordingly.
   * @returns {MutationObserver} The observer instance.
   */
  observeCountryState() {
    const container = select.el(document, `[data-display="country-card"]`);
    const observer = new MutationObserver(() => this.updateState());
    return observer.observe(container, { childList: true });
  }
  // !========================================================================[Popup Observer]

  /**
   *? Initializes an IntersectionObserver to show a popup when the header is in view.
   *@returns {IntersectionObserver} The observer instance
   */
  displayPopup() {
    const header = document.getElementById("header");
    const headerOption = this._options(0.7);
    const observer = new IntersectionObserver(this._handlePopup, headerOption);
    observer.observe(header);
  }

  /**
   * ?Handles visibility of the popup based on intersection changes.
   * @param {IntersectionObserverEntry[]} entries - Intersection entries.
   */
  _handlePopup(entries) {
    const popup = select.el(document, `[data-display="popup"]`);
    const [entry] = entries;
    !entry.isIntersecting
      ? cList.add(popup, "is-active")
      : cList.rem(popup, "is-active");
  }

  //!=============================================[Local storage]
  /**
   * ?Sets the initial mode based on the user's saved preference in local storage.
   * This method checks if the dark mode was previously enabled and applies the appropriate classes to the body and navigation elements.
   * @returns {void} - This method does not return any value.
   */
  setInitialMode() {
    const savedMode = localStorage.getItem("darkMode");
    const isSaved = savedMode === "true";
    if (isSaved) {
      const mode = select.el(document, `[data-display="figure"]`);
      cList.add(document.body, "dark--mode");
      cList.add(mode, "nav--dark");
    }
  }
}

export const fun = new Country();
