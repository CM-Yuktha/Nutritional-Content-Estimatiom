// Components/Home/Home.jsx — no extra Navbar/Footer here
import React from 'react';

import Hero from '../Hero/Hero.jsx';
import Title from '../Title/Title.jsx';
import Programs from '../Programs/Programs.jsx';
import Desc from '../Desc/Desc.jsx';

const Home = () => (
    <div>
    <Hero />
    <div className="container">
      <Title subTitle="Discover your nutrition" title="Encourages you to not just count your calories but to focus on your nutrition as a whole." />
      <Programs />
      <Desc />
    </div>
 </div>
);

export default Home;
