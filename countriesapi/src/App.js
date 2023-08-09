// Import required packages
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
  }
`;

// Theme styles
const lightTheme = {
  backgroundColor: '#f5f5f5',
  textColor: '#333',
};

const darkTheme = {
  backgroundColor: '#333',
  textColor: '#fff',
};

// Homepage component
function HomePage() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedRegion === '' || country.region === selectedRegion)
  );

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <div>
        <button onClick={() => setIsDarkMode(prevMode => !prevMode)}>
          Toggle Dark Mode
        </button>
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          {/* Add more options for other regions */}
        </select>
        {filteredCountries.map(country => (
          <div key={country.cca3}>
            <Link to={`/country/${country.cca3}`}>
              <h2>{country.name.common}</h2>
            </Link>
            <p>Region: {country.region}</p>
          </div>
        ))}
      </div>
    </ThemeProvider>
  );
}

// Detail page component
function CountryDetailPage({ match }) {
  const cca3 = match.params.cca3;
  const [country, setCountry] = useState(null);

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/alpha/${cca3}`)
      .then(response => {
        setCountry(response.data);
      })
      .catch(error => {
        console.error('Error fetching country:', error);
      });
  }, [cca3]);

  if (!country) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Population: {country.population}</p>
      <h3>Border Countries:</h3>
      {country.borders.map(border => (
        <BorderCountry key={border} cca3={border} />
      ))}
    </div>
  );
}

// Border country component
function BorderCountry({ cca3 }) {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/alpha/${cca3}`)
      .then(response => {
        setCountry(response.data);
      })
      .catch(error => {
        console.error('Error fetching border country:', error);
      });
  }, [cca3]);

  if (!country) {
    return null;
  }

  return (
    <div>
      <Link to={`/country/${cca3}`}>
        {country.name.common}
      </Link>
    </div>
  );
}

// App component
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/country/:cca3" component={CountryDetailPage} />
      </Switch>
    </Router>
  );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
