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

function filterByRegionAndSearch(region, searchQuery) {
  const filteredCountries = countriesData.filter(country =>
    (region === '' || country.region === region) &&
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );
  displayCountries(filteredCountries);
}

async function initializeApp() {
  countriesData = await fetchCountries();
  displayCountries(countriesData);

  regionFilter.addEventListener('change', event => {
    const searchQuery = searchInput.value;
    filterByRegionAndSearch(event.target.value, searchQuery);
  });

  searchInput.addEventListener('input', () => {
    const region = regionFilter.value;
    const searchQuery = searchInput.value;
    filterByRegionAndSearch(region, searchQuery);
  });
}

initializeApp();
