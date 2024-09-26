class Index {
  /**
   * ?Convert a number to a localized string format.
   * @param {Number} number - The number to format.
   * @returns {String} - The formatted string.
   */
  localString(number) {
    const options = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    };
    if (number) return number.toLocaleString("en-US", options);
  }

  /**
   * ?Generate markup for country cards from data.
   * @param {Array} countryData - Array of country data objects.
   * @returns {String} - HTML markup for country cards.
   */
  markupCard(countryData) {
    return countryData
      .map(
        (item) => `
        <section class="country__card" data-display="country-card" tabindex="0">
          <div class="country__img lazy--img-container">
            <img class="img lazy--img" data-src="${
              item.flag
            }" data-lazy-img alt="The flag of ${item.country}" />
          </div>
          <div class="country__text">
            <h2 class="heading-secondary heading--details" data-display="name">${
              item.country
            }</h2>
            <ul class="country__details">
              <li class="heading-details">Population: <span class="heading-item heading--details ">
             ${this.localString(item.population)} </span></li>
              <li class="heading-details">Region: <span class="heading-item heading--details ">${
                item.region
              }</span></li>
              <li class="heading-details">Capital: <span class="heading-item heading--details ">${
                item.capital ? item.capital.join(", ") : "N/A"
              }</span></li>
            </ul>
          </div>
        </section>
      `
      )
      .join("");
  }

  /**
   * ? Create detailed markup for a specific country.
   * @param {Object} item - Country data object.
   * @returns {String} - HTML markup for country details.
   */
  markupCountryDetails(item) {
    return `
<section class="country-details">

      <section class="country-details__flag">
        <div class="btn-wrapper">
          <a href="#" class="btn" data-action="home">
            <!--? Svg  -->
            <div class="svg flag--svg">
              <svg aria-label="Icon arrow back">
                <use
                  xlink:href="./assets/image/icon.svg#icon-arrow-back"
                ></use>
              </svg>
            </div>
            Back
          </a>
        </div>
        <!-- ?Flag -->
        <div class="country-details__img lazy--img-container">
          <img class="img lazy--img" data-src="${
            item.flag
          }" data-lazy-img alt="An image of ${item.name} flag" />
        </div>
      </section>
<div class="county--wrapper__details">
      <section class="country-details__detail">
      <div class="country-details__wrapper">
          <!--!----------------------------[Details Primary]  -->
          <ul class="details-primary">
          <li>
          <h2 class="heading-secondary heading--country-details">
            ${item.name}
          </h2>
        </li>
            <li class="heading-details country--details">
              Native Name:
              <span class="heading-details country--sub">${item.native}</span>
            </li>
            <li class="heading-details country--details">
              Population:
              <span class="heading-details country--sub">${this.localString(
                item.population
              )}</span>
            </li>
            <li class="heading-details country--details">
              Region:
              <span class="heading-details country--sub">${item.region}</span>
            </li>
            <li class="heading-details country--details">
              Sub Region:
              <span class="heading-details country--sub">${
                item.subRegion ? item.subRegion : "None"
              }</span>
            </li>
            <li class="heading-details country--details">
              Capital:
              <span class="heading-details country--sub">${item.capital}</span>
            </li>
          </ul>

          <!-- !-----------------------------------------Details Secondary -->
          <ul class="details-secondary">
            <li class="heading-details country--details">
              Top Level Domain:
              <span class="heading-details country--sub"> ${item.tld}</span>
            </li>
            <li class="heading-details country--details">
              Currencies:
              <span class="heading-details country--sub"> ${
                item.currency
              }</span>
            </li>

            <li class="heading-details country--details">
              Languages:
              <span class="heading-details country--sub">${
                item.languages
              }</span>
            </li>
          </ul>
        </div>
      </section>
    
      <section class="country-details__border">
        <h2 class="heading-secondary heading--details">
          Border Countries:
        </h2>
        <div
          class="country-details__border-grid"
          data-display="border-countries"
        ></div>
      </section>
      </div>
    </section>
  
  `;
  }

  /**
   *? Generate markup for neighboring countries.
   * @param {Object} countryData - Border country data.
   * @returns {String} - HTML markup for border countries.
   */
  markupBorder(countryData) {
    if (!countryData) return "";
    const [neighbor] = Object.values(countryData);

    return neighbor.map(
      (item) =>
        `
      <div>
        <div class="btn-wrapper btn--border" data-display="border">
            <a href="#" class="btn">${item}</a>
        </div>
        </div>
      `
    );
  }

  /**
   *? Insert country card markup into the specified container.
   * @param {Element} container - The target DOM element.
   * @param {Array} countryData - Country card data.
   **/
  htmlCardMarkup(container, countryData) {
    container.innerHTML = "";
    container.insertAdjacentHTML("afterbegin", this.markupCard(countryData));
  }

  /**
   *? Insert detailed country markup into the specified container.
   * @param {Element} container - The target DOM element.
   * @param {Array} countryData - Country card data.
   **/

  htmlCountryMarkup(container, borderData) {
    container.innerHTML = "";
    container.insertAdjacentHTML(
      "afterbegin",
      this.markupCountryDetails(borderData)
    );
  }

  /**
   *? Insert border country  markup into the specified container.
   * @param {Element} container - The target DOM element.
   * @param {Array} countryData - Country card data.
   * */

  htmlBorderMarkup(container, borderData) {
    container.innerHTML = "";
    container.insertAdjacentHTML("afterbegin", this.markupBorder(borderData));
  }
}

export const index = new Index();
