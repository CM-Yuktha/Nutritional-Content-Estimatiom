import React from 'react'
import './Hero.css'
import heroo from '../../assets/heroo.png';

const Hero = () => {
  return (
    <div className='hero container'>
       <div className="hero-text">
        <h1>NOT JUST A PRETTY BOWL, IT'S DATA </h1>
        <p>DataBowl analyzes your food photos instantly, turning the "pretty bowl" into deep nutritional insights for effortless diet tracking.</p>
        <button className="btn" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
  Explore more
</button>
<section id="features" className="features container"></section>


        </div>
      
    </div>
  )
}

export default Hero
