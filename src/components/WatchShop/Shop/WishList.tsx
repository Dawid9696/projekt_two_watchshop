import React, {useEffect,useReducer} from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'
import {TiDeleteOutline } from 'react-icons/ti';

import Loader from '../Loader';
import { getJwt } from '../../../jwt';

const WishList:React.FC = ({userData,fetchUsers}:any) => {

  useEffect(() => {
    fetchUsers()
  },[])

  const jwt = getJwt()
  const removeFromWishList = (id:string) => {
    console.log(id)
    axios.post(`http://localhost:5000/Swiss/removeFromWishList/${id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
    .then(res => setTimeout(() => window.location.href = `./WishList`,500))
    .catch(err => console.log('not deleted !' + err.msg))
  }

  return (
    <div className="WishList">
      {userData.loading || userData.wishList ? <Loader/> :
      <React.Fragment>
        <div><h1>Lista życzeń</h1></div>
        <div className="WishList-Cards">
          {userData.users[0].wishList.map((photo:any) => <WishListCard key={photo.wishProduct._id} removeFromWish={() => removeFromWishList(photo._id)} ratio={photo.wishProduct.watchOverallRatio} id={photo.wishProduct._id}  price={photo.wishProduct.watchPrice} collection={photo.wishProduct.watchCollection} name={photo.wishProduct.watchMark} image={photo.wishProduct.watchPhotos[0]}/>)}
        </div>
      </React.Fragment> }
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

export default connect(mapStateToProps,mapDispatchToProps)(WishList);

const WishListCard = (props:any) => {
    return (
      <div className="WishList-Card">
        <Link to={`/Watches/${props.id}`} title={props.name}  className="WishList-Card-img"><img src={props.image} /></Link>
        <div className="WishList-Card-name">
          <div><h3 style={{color:"black"}}>{props.name}</h3></div>
          <div><p style={{color:"#888888"}}>{props.collection}</p></div>
        </div>
        <div className="WishList-Card-price">
          <div><h3>Cena: {props.price} zł</h3></div>
          <div>Ocena: {props.ratio}</div>
          <div  className="WishList-Card-icon"><TiDeleteOutline color="red" size="40px" onClick={props.removeFromWish}/></div>
        </div>
      </div>
    );
  }