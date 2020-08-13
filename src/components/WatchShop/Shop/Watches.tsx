import React,{useState,useReducer, useEffect} from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'


import Loader from '../Loader';
import { MdGrade} from 'react-icons/md';
import WatchCard from '../Home/Card'
import { getJwt } from '../../../jwt';

const FETCH_SUCCESS = 'FETCH_SUCCESS'
const FETCH_FAIL = 'FETCH_FAIL'

const initialState = {
  loading:true,
  post:{},
  err:''
}

const reducer = (state:any,action:any) => {
  switch(action.type) {
    case FETCH_SUCCESS: return {
      loading:false,
      post:action.payload,
      err:''
    }
    case FETCH_FAIL: return {
      loading:false,
      post:{},
      err:action.payload
    }
    default:return state
  }
}

const Watches:React.FC = ({userData,fetchUsers}:any) => {

  const jwt = getJwt()

  useEffect(() => {
    fetchUsers()
  },[])

  useEffect(() => {
    axios.get('http://localhost:5000/Swiss/Watches')
    .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
    .catch(err => dispatch({type:FETCH_SUCCESS,payload:'Błąd'}))
  },[])

  const show = (c:string) => {
      var x = document.getElementsByClassName(c)[0]! as HTMLDivElement
      var v = x.nextSibling as HTMLDivElement
      if(v.hidden) {
        v.hidden = false
      } else {
        v.hidden = true
      }
    
  }

  const [photos,dispatch] = useReducer(reducer,initialState)

  return (
    <div className="Watches">

        <div className="Watches-filtertab">

          <div>
            <div onClick={() => show("Watches-filtertab-showed")} style={{transition:"2s"}} className="Watches-filtertab-showed">Marki</div>
            <div className="Watches-filtertab-hidden">
              <ul style={{listStyle:"none"}}>
                <li><input type="checkbox"/>Roamer</li>
              </ul>
            </div>
          </div>

          <div>Damski/Męski</div>
          <div>Cena</div>
          <div>Pasek</div>
          <div>Koperta</div>
          <div>Tarcza</div>
          <div>Kolor</div>
          <div>Szkło</div>
          <div>Styl</div>
          <div>Mechanizm</div>
          <div>Wodoszczelność</div>
          <div>Wymiary</div>
        </div>  
      {jwt ? 
      <div className="Watches-cards">
        {photos.loading || userData.loading ? <Loader/> : photos.post.map((photo:any) =>
          <WatchCard 
          key={photo._id} 
          id={photo._id} 
          shoppingCart={userData.users[0].shoppingCart.some((item:any) => item.product._id == photo._id )}
          favorite={userData.users[0].favorite.some((item:any) => item.favoriteProduct._id == photo._id )}
          wish={userData.users[0].wishList.some((item:any) => item.wishProduct._id == photo._id )}
          price={photo.watchPrice} 
          name={photo.watchMark} 
          photo={photo.watchPhotos}
          ratio={photo.watchOverallRatio}
          comments={photo.watchNumberOfComments}
          />)}
      </div>
      :
      <div className="Watches-cards">
        {photos.loading || userData.loading ? <Loader/> : photos.post.map((photo:any) =>
          <WatchCard 
          key={photo._id} 
          id={photo._id} 

          price={photo.watchPrice} 
          name={photo.watchMark} 
          photo={photo.watchPhotos}
          ratio={photo.watchOverallRatio}
          comments={photo.watchNumberOfComments}
        />)} }
      </div> }

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

export default connect(mapStateToProps,mapDispatchToProps)(Watches);
