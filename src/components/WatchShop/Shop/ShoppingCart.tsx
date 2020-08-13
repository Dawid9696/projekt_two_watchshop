import React,{useState,useReducer, useEffect,useRef} from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'

import { MdDelete } from 'react-icons/md';
import Loader from '../Loader';
import { FiShoppingCart } from 'react-icons/fi';
import { getJwt } from '../../../jwt';

const ShoppingCart:React.FC = ({fetchUsers,userData}:any) => {

  useEffect(() => {
    fetchUsers()
  },[])
  const jwt = getJwt()
  const removeFromShoppingCart = (id:string) => {
    console.log(id)
    axios.post(`http://localhost:5000/Swiss//removeFromShoppingCart/${id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
    .then(res => setTimeout(() => window.location.href = `./ShoppingCart`,500))
    .catch(err => window.alert('Not deleted'))
  }

  const removeAllFromShoppingCart = () => {
    axios.post(`http://localhost:5000/Swiss//removeAllFromShoppingCart`,'',{headers:{Authorization:`Bearer ${jwt}`}})
    .then(res => setTimeout(() => window.location.href = `./ShoppingCart`,500))
    .catch(err => window.alert('Not deleted'))
  }

console.log(userData)
  return (
    <div className="ShoppingCart">
      {userData.loading ? <Loader/> : 
      <React.Fragment>
        <div className="Products">
          <div className="cart-containter">
          {userData.users[0].shoppingCart.length == 0 ? <p>Koszyk jest pusty</p> : userData.users[0].shoppingCart.map((photo:any) => 
              <div className="cart-box">
              <Link to={`/Watches/${photo.product._id}`} className="cart-box-img">
                  <img  className="cart-img"src={photo.product.watchPhotos[0]}/>
              </Link>
              <div className="cart-box-content">
                <div>
                <p style={{color:"red"}}>{photo.product.watchPrice} zł</p>
                <p>Ocena: {photo.product.watchOverallRatio} ({photo.product.comments != null ? photo.product.comments.length : '0'})</p>
                </div>
                  <div><MdDelete color="black" size="30px" onClick={() => removeFromShoppingCart(photo._id)}/></div>
              </div>
              <div className="cart-box-pre-content">
                {photo.product.watchMark}
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="ShopPanel">
          <div  className="ShopPanel-card-one">
            <div><FiShoppingCart size="4rem"/></div>
            <div><h2>Twój koszyk</h2></div>
          </div>
          <div  className="ShopPanel-card-one">
            <div><h5>Suma: {userData.users[0].shoppingCartTotalPrice} </h5></div>
            <div><h5>Ilość: {userData.users[0].shoppingCartTotalQuantity}</h5></div>
            <div className="DetailWatch-one-basic-button" onClick={removeAllFromShoppingCart}>Wyczyść koszyk</div>
            <div className="DetailWatch-one-basic-button">Zapłać</div>
          </div>
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


export default connect(mapStateToProps,mapDispatchToProps)(ShoppingCart);