import React,{useState,useReducer, useEffect,useRef} from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'

//ICONS
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

const Best:React.FC = ({fetchUsers,userData}:any) => {

  const jwt = getJwt()

  var inputRef = useRef<any>(1)

  useEffect(() => {
    fetchUsers()
  },[])

  useEffect(() => {
    axios.get('http://localhost:5000/Swiss/bestWatches')
    .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
    .catch(err => dispatch({type:FETCH_SUCCESS,payload:'Błąd'}))
  },[])

  const [move,setMove] = useState(-800)
  const [move2,setMove2] = useState(2000)
  const [opacity,setOpacity] = useState(0)
  const [opacity2,setOpacity2] = useState(0)
  const [photos,dispatch] = useReducer(reducer,initialState)


  if(photos.loading == false) {
    window.addEventListener('scroll',() => {
      if(window.scrollY > 300) {
        setOpacity(1)
        setOpacity2(0.8)
        setMove(180)
        setTimeout(() => {
        setMove2(-10)
        },500)
      }   
    })
  }


  return (
    <div className="Best" id="Da" ref={inputRef}>

      <div style={{left:move,opacity:opacity2}} className="Best-hidden-desc">
        <div className="Best-desc-content">
          <h3 style={{margin:"10px",color:"white"}}>BESTSELLERY</h3>
        </div>
      </div>
    {jwt ? 
      <div className="Best-cards" style={{left:move2,opacity:opacity}}>
        {photos.loading || userData.loading ? <p style={{color:"white"}}>Loading...</p> : photos.post.map((photo:any,index:any) => <WatchCard key={photo._id} 
        shoppingCart={userData.users[0].shoppingCart.some((item:any) => item.product._id == photo._id )} 
        favorite={userData.users[0].favorite.some((item:any) => item.favoriteProduct._id == photo._id )}
        wish={userData.users[0].wishList.some((item:any) => item.wishProduct._id == photo._id )} 
        id={photo._id} price={photo.watchPrice} 
        name={photo.watchMark} 
        photo={photo.watchPhotos}
        ratio={photo.watchOverallRatio}
        comments={photo.watchNumberOfComments}/>)}
      </div>
      :
      <div className="Best-cards" style={{left:move2,opacity:opacity}}>
      {photos.loading ? <p style={{color:"white"}}>Loading...</p> : photos.post.map((photo:any,index:any) => <WatchCard key={photo._id} 
        id={photo._id} price={photo.watchPrice} 
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

export default connect(mapStateToProps,mapDispatchToProps)(Best);

