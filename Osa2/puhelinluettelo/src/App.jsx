import { useState, useEffect } from 'react'
import noteService from './services/notes'
import './index.css'


const FilterForm = ({ filter, handleFilterChange}) => {
  return (
    <div>
      Filter shown with <input value={filter} onChange={handleFilterChange}></input>
    </div>
  )
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => {
  return (
    <form id='personForm'>
        <div>Name: <input value={newName} onChange={handleNameChange} /></div>
        <div>Number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div><button id='addBtn' type="submit" onClick={addPerson}>add</button></div>
    </form>
  )
}

const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.name}>{person.name} {person.number} 
        <button id='deleteBtn' onClick={() => handleDelete(person.id)}>Delete</button>
        </p>
      ))}
    </div>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  let notificationClass = ''
  if (type === 'success') {
    notificationClass = 'success'
  } else {
    notificationClass = 'error'
  }

  return (
    <div className={`notification ${notificationClass}`}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1231244' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    console.log('effect')
    noteService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (confirmUpdate) {
        const changedPerson = {...existingPerson, number: newNumber}
        noteService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewNumber('')
            setSuccessMessage('Number updated succesfully!')
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${changedPerson.name} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      noteService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage('Person added succesfully!')
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
        })
      }
    }

    const handleDelete = (id) => {
      const personToDelete = persons.find(person => person.id === id)
      const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`)

      if (confirmDelete) {
        noteService
          .remove(id)
          .then(() => {
            setPersons(persons.filter(person => person.id !== id))
            setSuccessMessage('Person deleted succesfully!')
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
      }
    }

  const filteredPersons = persons.filter(person => {
    if (person.name) {
      return person.name.toLowerCase().includes(filter ? filter.toLowerCase() : '')
    }
    return false
  })

  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage ? <Notification message={successMessage} type="success" /> : null}
      {errorMessage ? <Notification message={errorMessage} type="error" /> : null}
      <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App
