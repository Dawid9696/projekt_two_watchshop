import React from 'react';

//Imports
import Slider from './Slider'
import News from './News'
import BestWatches from './Best'

const Home:React.FC = () => {
  return (
    <div className="Home">
        <Slider/>
        <News/>
        <BestWatches/>
    </div>
  );
}

export default Home;