import React, {useEffect} from 'react';
import {Link} from 'react-router-dom'

//ICONS
import { MdGrade} from 'react-icons/md';
import { AiFillHeart,AiOutlineShoppingCart} from 'react-icons/ai';
import { GiPresent } from 'react-icons/gi';
import { getJwt } from '../../../jwt';


interface Props {
    id:string,
    name:string,
    photo:[string],
    price:string,
    favorite?:boolean,
    shoppingCart?:boolean,
    wish?:boolean
    ratio?:number,
    comments?:number,
  }

const WatchCard = (props:Props) => {

  const jwt = getJwt()

    return (
        <Link to={`/Watches/${props.id}`} title={props.name} className="news-card">
          {jwt ? <React.Fragment>
        <img src={props.photo[0]} alt="Loading.."/>
        <div><h3 style={{color:"black",margin:"2px"}}>{props.name}</h3></div>
        <div><p style={{color:"red",margin:"5px"}}>Cena {props.price} zł</p></div>
        <div className="Card-icons">
            <div><AiFillHeart className="Card-Ulubione" size="2rem" color={props.favorite ? "red" : "grey"}/></div>
            <div><AiOutlineShoppingCart  size="2rem"  color={props.shoppingCart ? "yellow" : "grey"}/></div>
        </div>
        <div className="Card-icons-wish"><div><GiPresent  size="2rem"  color={props.wish ? "green" : "grey"}/></div></div>
        <div className="DetailWatch-information2">
          <div className="Skills2">
            <span className="Name2"><MdGrade color="gold"/></span>
              <div className="Percent2">
                <div className="Progress2" style={{width:`${props.ratio && props.ratio*10}%`}}></div>  
              </div>
            <span className="Value2">({props.comments})</span>
          </div>
        </div> 
        </React.Fragment>
        :
        <React.Fragment>
          <img src={props.photo[0]} alt="Loading.."/>
        <div><h3 style={{color:"black",margin:"2px"}}>{props.name}</h3></div>
        <div><p style={{color:"red",margin:"5px"}}>Cena {props.price} zł</p></div>
        <div className="DetailWatch-information2">
          <div className="Skills2">
            <span className="Name2"><MdGrade color="gold"/></span>
              <div className="Percent2">
                <div className="Progress2" style={{width:`${props.ratio && props.ratio*10}%`}}></div>  
              </div>
            <span className="Value2">({props.comments})</span>
          </div>
        </div>
      </React.Fragment> }
      </Link>
      
      
    )
  }

  export default WatchCard;