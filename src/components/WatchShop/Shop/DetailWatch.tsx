import React, {useState,useEffect,useReducer} from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'

import Loader from '../Loader';
import {TiDeleteOutline } from 'react-icons/ti';
import { AiFillLike,AiFillDislike} from 'react-icons/ai';
import { MdGrade} from 'react-icons/md';
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
      loading:true,
      post:{},
      err:action.payload
    }
    default:return state
  }
}

const DetailWatch:React.FC = (props:any) => {

  useEffect(() => {
    fetchUsers()
  },[])

  useEffect(() => {
    axios.get(`http://localhost:5000/Swiss/Watches/${props.match.params.id}`)
    .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
    .catch(err => dispatch({type:FETCH_FAIL,payload:'Błąd'}))
  },[props.match.params.id])

  const [photos,dispatch] = useReducer(reducer,initialState)
  const [picture,setPicture] = useState(0)
  const [ratio,setRatio] = useState(5)
  const [comment,setComment] = useState()
  console.log(photos)
  const jwt = getJwt()

  const addToFavorite = () => {
    axios.post(`http://localhost:5000/Swiss/addToFavorite/${props.match.params.id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
    .then(res => window.alert('Dodano do ulubionych'))
    .catch(err => window.alert("Produkt jest juz w ulubionych !"))
  }

  const addToShoppingCart = () => {
    axios.post(`http://localhost:5000/Swiss/addToShoppingCart/${props.match.params.id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
    .then(res => window.alert('Dodano do koszyka'))
    .catch(err => window.alert("Produkt jest juz w koszyku !"))
  }

  const addToWishList = () => {
    axios.post(`http://localhost:5000/Swiss/addToWishList/${props.match.params.id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
    .then(res => window.alert('Dodano do listy'))
    .catch(err => window.alert("Produkt jest juz na liscie życzeń !"))
  }

  const dodajKomentarz = () => {
    axios.post(`http://localhost:5000/Swiss/addComment/${props.match.params.id}`,{comment:comment,commentRatio:ratio},{headers:{Authorization:`Bearer ${jwt}`}})
    .then(res => setTimeout(() => window.location.href = `./${props.match.params.id}`,1000))
    .catch(err => window.alert("Nie dodano"))
  }

  const usunKomentarz = (comment:any,id:any) => {
    axios.post(`http://localhost:5000/Swiss/deleteComment/${id}/comment/${comment}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
    .then(res => setTimeout(() => window.location.href = `./${props.match.params.id}`,1000))
    .catch(err => window.alert("Nie usunięto"))
  }
  
  return (
    <div className="DetailWatch">
    {photos.loading || props.userData.loading ? <Loader/> :

      <React.Fragment>
       <div className="DetailWatch-one">

      <div   className="DetailWatch-one-images">
        <div  className="DetailWatch-one-images-big">
          <img src={photos.post.watchPhotos[picture]} height="300px"/>
        </div>

        <div   className="DetailWatch-one-images-small">
          {photos.post.watchPhotos.map((photo:any,index:any) => {
           return <div><img onClick={() => setPicture(index)} src={photo} width="75px" height="75px"/></div>
          })}
        </div>

      </div>

      <div className="DetailWatch-one-basic">
          <div><h1 style={{color:"white"}}>{photos.post.watchMark}</h1></div>
          {photos.post.watchSex== "Kobieta" ? <div><i style={{color:"Rosybrown"}}>Zegarek Damski</i></div> : <div><i style={{color:"lightseagreen"}}>Zegarek Męski</i></div> }
          <div><h3 style={{color:"grey",fontSize:"15px"}}>Cena: {photos.post.watchPrice} zł lub {photos.post.watchPrice/8}zł x 8</h3></div>
          <div className="DetailWatch-information">
            <div className="Skills">
              <span className="Name"><MdGrade/></span>
                <div className="Percent">
                  <div className="Progress" style={{width:`${photos.post.watchOverallRatio && photos.post.watchOverallRatio*10}%`}}></div>  
                </div>
              <span className="Value">{`${photos.post.watchOverallRatio && photos.post.watchOverallRatio*10}%`}</span>
            </div>
          </div>
          {jwt && 
          <React.Fragment>
          <div onClick={addToShoppingCart} className="DetailWatch-one-basic-button">Dodaj do koszyka</div>
          <div onClick={addToFavorite} className="DetailWatch-one-basic-button">Dodaj do ulubionych</div>
          <div onClick={addToWishList} className="DetailWatch-one-basic-button">Dodaj do listy życzeń</div>
          </React.Fragment> }
      </div>
      </div>
          <div className="DetailWatch-two">
          <table className="DetailWatch-two-table">
            <tr>
              <td><b>Szkło</b></td>
              <td>{photos.post.watchGlass}</td>
            </tr>
            <tr>
              <td><b>Rodzaj mechanizmu</b></td>
              <td>{photos.post.watchMechanism}</td>
            </tr>
            <tr>
              <td><b>Materiał Koperty</b></td>
              <td>{photos.post.watchEnvelopeMaterial}</td>
            </tr>
            <tr>
              <td><b>Materiał Paska</b></td>
              <td>{photos.post.watchBeltMaterial}</td>
            </tr>
            <tr>
              <td><b>Styl</b></td>
              <td>{photos.post.watchStyle}</td>
            </tr>
            <tr>
              <td><b>Kolekcja</b></td>
              <td>{photos.post.watchCollection}</td>
            </tr>
            <tr>
              <td><b>Kolor paska</b></td>
              <td>{photos.post.watchBeltColor}</td>
            </tr>
            <tr>
              <td><b>Kolor tarczy</b></td>
              <td>{photos.post.watchShieldColor}</td>
            </tr>
            <tr>
              <td><b>Kolor Koperty</b></td>
              <td>{photos.post.watchEnvelopeColor}</td>
            </tr>
            <tr>
              <td><b>Wodoszczelny</b></td>
              {photos.post.watchWaterproof ? <td>Tak</td> : <td>Nie</td>}
            </tr>
            <tr>
              <td><b>Szerokość Koperty</b></td>
              <td>{photos.post.watchWidth} mm</td>
            </tr>
            <tr>
              <td><b>Wysokość Koperty</b></td>
              <td>{photos.post.watchHeight} mm</td>
            </tr>
            <tr>
              <td><b>Grubość Koperty</b></td>
              <td>{photos.post.watchThickness} mm</td>
            </tr>
            <tr>
              <td><b>Średnica</b></td>
              <td>{photos.post.watchDiameter} mm</td>
            </tr>
      </table> 
          <div className="DetailWatch-two-pic">
            <img src="https://dcdn.swiss.com.pl/images/swiss_karta500.jpg" height="400px"/>
          </div>
          </div>
      
      <div className="Komentarze">
        <h3>Komentarze</h3>
        {photos.post.comments.map((item:any) => <Comments key={item._id} removeCom={() => usunKomentarz(item._id,props.match.params.id)} {...jwt && {userId:props.userData.users[0]._id}} item={item}/>)}
        {jwt &&
        <div className="Komentarze-inputarea">
          <input type="textarea" placeholder="Napisz komentarz" onChange={(e:any) => setComment(e.target.value)}/>
          <input type="range" min="0" max="10" onChange={(e:any) => setRatio(e.target.value)}/>
          <button onClick={dodajKomentarz}>Dodaj komentarz</button>
        </div> }
      </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(DetailWatch);

const Comments = (props:any) => {

  const jwt = getJwt()

  return (
    <div className="commentsContainer">
      <div className="comment">
        <div   className="commentText" >{props.item.comment}</div>
        {props.item.postedBy._id == props.userId &&  
        <div className="commentIcon"><TiDeleteOutline color="red" size="40px" onClick={props.removeCom} /></div>}
        {jwt ?
        <Link to={`/user/${props.item.postedBy._id}`} className="commentPicture"><img className="commentPictureImg" src={props.item.postedBy.userPhoto} alt="No Picture"/></Link>
        :
        <div className="commentPicture"><img className="commentPictureImg" src={props.item.postedBy.userPhoto} alt="No Picture"/></div> }
        <div  className="commentInfo">
          <div>{props.item.postedBy.login}</div>
          <div>Ocena: {props.item.commentRatio}</div>
        </div>
      </div>
    </div>
  )
}

