
import React from 'react'

const Header = ({ course }) => {
    console.log(course)
    return (
      <div>
        <h1>
          {course.name}
        </h1>
      </div>
    )
  }
  
  const Part = ({ name, exercises }) => {
    console.log(name, exercises)
    return (
      <p>
        {name} {exercises}
      </p>
    )
  }
  
  const Content = ({ parts }) => {
    console.log(parts)
    return (
      <div>
        {parts.map(part => 
          <Part key={part.id} name={part.name} exercises={part.exercises} />
          )}
      </div>
    )
  }

  const Total = ({ parts }) => {
    const initialValue = 0
    const exerciseCount = parts.reduce((sum, part) => {
        console.log("Mitä tapahtuu", sum, part)
        return sum + part.exercises
     }, initialValue)
      
    return (
      <div>
        <p><strong>Total of {exerciseCount} exercises </strong></p>
      </div>
    )
  }
  
  const Course = ({ course }) => {
    console.log(course)
    return (
      <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

export default Course
  