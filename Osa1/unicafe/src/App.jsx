
import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick= {handleClick}>{text}</button>
  )
}

const Statistics = ({ good, neutral, bad, total, average, positivePercentage }) => {
  if (total === 0) {
    return (
    <div>
      <h1>Statistics</h1>
      <p>No feedback given</p>
    </div>
    )
  }
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <tr>
            <td>Good</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>Neutral</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>Bad</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>All</td>
            <td>{total}</td>
          </tr>
          <tr>
            <td>Average</td>
            <td>{average}</td>
          </tr>
          <tr>
            <td>Positive</td>
            <td>{positivePercentage} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positivePercentage, setPositivePercentage] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    const updatedTotal = updatedGood + neutral + bad
    const updatedAverage = (updatedGood - bad) / updatedTotal
    setGood(updatedGood)
    setTotal(updatedTotal)
    setAverage(updatedAverage)
    setPositivePercentage((updatedGood / updatedTotal) * 100 || 0)
  }
  
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    const updatedTotal = good + updatedNeutral + bad
    const updatedAverage = (good - bad) / updatedTotal
    setNeutral(updatedNeutral)
    setTotal(updatedTotal)
    setAverage(updatedAverage)
    setPositivePercentage((good / updatedTotal) * 100 || 0)
  }
  
  const handleBadClick = () => {
    const updatedBad = bad + 1
    const updatedTotal = good + neutral + updatedBad
    const updatedAverage = (good - updatedBad) / updatedTotal
    setBad(updatedBad)
    setTotal(updatedTotal)
    setAverage(updatedAverage)
    setPositivePercentage((good / updatedTotal) * 100 || 0)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick= {handleGoodClick} text="Good" />
      <Button handleClick= {handleNeutralClick} text="Neutral" />
      <Button handleClick= {handleBadClick} text="Bad" />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positivePercentage={positivePercentage}
      />
    </div>
  )
}

export default App
