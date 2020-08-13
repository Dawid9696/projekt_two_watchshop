import React, {useState, useEffect} from 'react';
 
const fadeImages = [
  'https://dcdn.swiss.com.pl/uploads/mainpage/c1957ef8c155c6d1f4e319b86bdcf79b.png',
  'https://dcdn.swiss.com.pl/uploads/mainpage/9610bb656c7b824b5dca0a384714fa8a.png',
];


 
const Slider:React.FC = (props:any) => {

  const [slide,setSlide] = useState(0)

  useEffect(() => {
    var licznik = 0
    setInterval(function() {
      licznik++
      setSlide(licznik)
      if(licznik==2) {
        licznik=0
        setSlide(licznik)
      }
      setSlide(licznik)
    },3000)
  },[])

  return (
    <div className="Slider">
      <img className="Slider-photo" src={fadeImages[slide]}/>
    </div>
  )
}

export default Slider;