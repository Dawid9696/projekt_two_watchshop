import React,{useState,useReducer, useEffect,useRef} from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'

//ICONS
import { TiDeleteOutline } from 'react-icons/ti';
import { GiPointyHat,GiWatch} from 'react-icons/gi';
import Loader from '../Loader';
import { getJwt } from '../../../jwt';

const Favorite:React.FC = ({userData,fetchUsers}:any) => {

    useEffect(() => {
        fetchUsers()
      },[])
    
      const [ava,setAva] = useState(0)
      const [link,setLink] = useState()
      const jwt = getJwt()

      const deleteFromFavorite = (id:string) => {
        axios.post(`http://localhost:5000/Swiss/removeFromFavorite/${id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => console.log('Deleted from favorite'))
        .catch(err => console.log("Not deleted"))
        setTimeout(() => {window.location.href = './Favorite'},500)
      }

  return (
    <div className="Favorite">
        {userData.loading ? <Loader/> :
       
        <React.Fragment>
          {userData.users[0].favorite.length == 0 ? <p>Nie masz ulubionych</p> : 
          <React.Fragment>
          <div>
            <div className="Favorite-description">
              <div className="Favorite-description-div"><div className="Favorite-description-div-div"><h3>Twoje ulubione produkty</h3></div></div>
              <div className="Favorite-description-div"><div className="Favorite-description-div-div"><h3>Ilość produktów: {userData.users[0].favorite.length}</h3></div></div>
            </div>
            <div className="Favorite-container"  onLoad={() => {setLink(userData.users[0].favorite[0].favoriteProduct._id)}}>
              {userData.users[0].favorite.map((photo:any,index:any) => 
                  <div className="Favorite-card" onClick={() => {setAva(index)}}>
                      <img onClick={() => {setLink(photo.favoriteProduct._id)}}  className="Favorite-favSmallCart" src={photo.favoriteProduct.watchPhotos[0]}/>
                  </div>
              )}
            </div>
          </div>
        <div> 
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <img className="favBigCart" src={userData.users[0].favorite[ava].favoriteProduct.watchPhotos[0]} alt="Avatar"/>
                        <h3>Namierz aby sprawdzić szczegóły</h3>
                        <div><GiPointyHat color="black" size="50px"/></div>
                    </div>
                    <div className="flip-card-back">
                        <h1>{userData.users[0].favorite[ava].favoriteProduct.watchMark}</h1>
                        <p>Cena: {userData.users[0].favorite[ava].favoriteProduct.watchPrice} zł</p>
                        <p>Styl: {userData.users[0].favorite[ava].favoriteProduct.watchStyle}</p>
                        <p>Kolekcja: {userData.users[0].favorite[ava].favoriteProduct.watchCollection}</p>
                        <p>Szkło: {userData.users[0].favorite[ava].favoriteProduct.watchGlass}</p>
                        <p>Mechanizm: {userData.users[0].favorite[ava].favoriteProduct.watchMechanism}</p>
                        <Link to={`/Watches/${link}`} className="flip-card-back-style">
                            <GiWatch color="white" size="5rem"/>
                            <p>Zobacz zegarek</p>
                        </Link>
                        <div  className="flip-card-back-style">
                            <TiDeleteOutline color="white" size="5rem" onClick={() => deleteFromFavorite(userData.users[0].favorite[ava]._id)}/>
                            <p style={{color:"red"}}>Usuń z ulubionych</p>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        </React.Fragment> }
        </React.Fragment>
            }
    </div>
  );
}

const mapStateToProps = (state:any) => {
  return {
    userData:state.user
  }
}

const mapDispatchToProps = (dispatch:any) => {
  return {
    fetchUsers:() => dispatch(fetchUsers())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Favorite);