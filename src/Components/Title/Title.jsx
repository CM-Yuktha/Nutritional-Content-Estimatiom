import React from 'react'
import './Title.css'

const Title = ({subTitle, title}) => {
  return (
    <div className='title'>
        <p>{subTitle}</p>
        <h4>{title}</h4>
      
    </div>
  )
}

export default Title
