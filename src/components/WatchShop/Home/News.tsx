import React,{useState,useReducer, useEffect,useRef} from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'


import Loader from '../Loader';
import { MdGrade} from 'react-icons/md';
import WatchCard from './Card'
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

const News:React.FC = ({userData,fetchUsers}:any) => {

  const jwt = getJwt()

  const inputRef = useRef<any>(1)

  useEffect(() => {
    fetchUsers()
  },[])

  useEffect(() => {
    axios.get('http://localhost:5000/Swiss/newWatches')
    .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
    .catch(err => dispatch({type:FETCH_SUCCESS,payload:'Błąd'}))
  },[])

  const [photos,dispatch] = useReducer(reducer,initialState)

  console.log(userData)

  return (
    <div className="news" id="Da" ref={inputRef}>
      <h3>NOWOŚCI</h3>
      {jwt ?
      <div className="news-cards">
        {photos.loading || userData.loading ?  <Loader/> : photos.post.map((photo:any) => <WatchCard 
        key={photo._id} 
        shoppingCart={userData.users[0].shoppingCart.some((item:any) => item.product._id == photo._id )} 
        favorite={userData.users[0].favorite.some((item:any) => item.favoriteProduct._id == photo._id )}
        wish={userData.users[0].wishList.some((item:any) => item.wishProduct._id == photo._id )} 
        id={photo._id} 
        price={photo.watchPrice} 
        name={photo.watchMark} 
        photo={photo.watchPhotos}
        ratio={photo.watchOverallRatio}
        comments={photo.watchNumberOfComments}/>)}
      </div>
      :
      <div className="news-cards">
      {photos.loading ? <Loader/> : photos.post.map((photo:any) => <WatchCard 
        key={photo._id} 
        id={photo._id} 
        price={photo.watchPrice} 
        name={photo.watchMark} 
        photo={photo.watchPhotos}
        ratio={photo.watchOverallRatio}
        comments={photo.watchNumberOfComments}/>)}
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

export default connect(mapStateToProps,mapDispatchToProps)(News);

// interface Props {
//   id:string,
//   name:string,
//   photo:[string],
//   price:string
// }
