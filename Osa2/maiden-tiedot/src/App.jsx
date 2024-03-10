import { useState, useEffect } from 'react'
import axios from 'axios'


const FilterForm = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Filter shown with <input value={filter} onChange={handleFilterChange}></input>
    </div>
  )
}

const Country = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area}</p>
    <h3>Languages:</h3>
    <ul>
      {Object.values(country.languages).map((language, index) => (
        <li key={index}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.png}  alt="Flag" style={{width: '100px', height: '75px'} }/>
    {console.log(country)}
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const filteredCountries = countries.filter(country => {
      return country.name.common.toLowerCase().includes(filter.toLowerCase())
    })
  
    
  return (
    <div>
      <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
      {filter && filteredCountries.length > 1 && filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        filteredCountries.map(country => (
          <div key={country.name.common}>
            <p>{country.name.common}</p>
          </div>
        ))
      )}
      {filteredCountries.length === 1 ? (
        <Country country={filteredCountries[0]} />
      ) : null}
    </div>
  )
}

export default App
