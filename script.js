const countriesContainer = document.getElementById('countriesContainer');
const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');

let countriesData = []; // To store the fetched countries data

async function fetchCountries() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const countries = await response.json();
  return countries;
}

function displayCountries(countries) {
  countriesContainer.innerHTML = '';

  countries.forEach(country => {
    const { name, flags, population, region, capital } = country;

    const countryCard = document.createElement('div');
    countryCard.classList.add('country-card');
    countryCard.innerHTML = `
      <img src="${flags.svg}" alt="${name.common}">
      <h2>${name.common}</h2>
      <p><strong>Population:</strong> ${population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${region}</p>
      <p><strong>Capital:</strong> ${capital}</p>
    `;

    countryCard.addEventListener('click', () => {
      // Implement code to show detailed information about the country
    });

    countriesContainer.appendChild(countryCard);
  });
}

function filterByRegion(region) {
  const filteredCountries = countriesData.filter(country => country.region === region || region === '');
  displayCountries(filteredCountries);
}

async function initializeApp() {
  countriesData = await fetchCountries();
  displayCountries(countriesData);

  regionFilter.addEventListener('change', event => {
    filterByRegion(event.target.value);
  });
}

initializeApp();
