import React, {useEffect,useReducer} from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'
import axios from 'axios'
import Loader from '../Loader';
import { MdGrade} from 'react-icons/md';
import { getJwt } from '../../../jwt';
import { FaUserFriends} from 'react-icons/fa';
import { FcInvite} from 'react-icons/fc';

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

const OtherProfil:React.FC = (props:any) => {

  useEffect(() => {
    fetchUsers()
  },[])

  useEffect(() => {
    axios.get(`http://localhost:5000/Swiss/user/${props.match.params.id}`)
    .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
    .catch(err => dispatch({type:FETCH_SUCCESS,payload:'Błąd'}))
  },[])

  const jwt = getJwt()

  const [photos,dispatch] = useReducer(reducer,initialState)

  const sendAnInvitation = (id:string) => {
    axios.post(`http://localhost:5000/Swiss/inviteUserToFriends/${id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
      .then(res => window.alert('Wyslano zaproszenie !'))
      .catch(err => console.log('Błąd!'+err.msg))
  }

  const deleteFromFriends = (id:string) => {
    console.log(id)
    axios.post(`http://localhost:5000/Swiss/deleteUserFromMyFriends/${id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
      .then(res => window.alert('Usunięto ze znajomych !'))
      .catch(err => console.log('Błąd!'+err.msg))
  }

  const opcja1 = () => {
    switch(photos.post.invitations) {
    case "Wszyscy":  
         return (<div className="DetailWatch-one-basic-button">
             <p style={{margin:"0px",padding:"0px"}} 
                 onClick={() => sendAnInvitation(photos.post._id)}>
                 Dodaj do znajomych
             </p>
           </div>)
    break;
    case "Znajomi znajomych":  
    const tab1 = photos.post.friends.map((item:any) => {return item.friend._id})
    const tab2 = props.userData.users[0].friends.map((item:any) => {return item.friend._id})
    const check = tab1.filter(function(n:any) {return tab2.indexOf(n) !== -1;})
    if(check.length > 0) {
      return <div className="DetailWatch-one-basic-button">
        <p  style={{margin:"0px",padding:"0px"}} 
            onClick={() => sendAnInvitation(photos.post._id)}>
              Dodaj do znajomych
        </p>
      </div>
    } else {
      return <div className="DetailWatch-one-basic-button">
        <p style={{margin:"0px",padding:"0px"}}>
          Zaproszenie tylko dla znajomych znajomych użytkownika
        </p>
      </div>
    }
    // return (<div className="DetailWatch-one-basic-button">
    //          <p style={{margin:"0px",padding:"0px"}}>
    //              Zaproszenie tylko dla znajomych znajomych użytkownika
    //          </p>
    //        </div>)
    break;
    case "Nikt":  
    return (<div className="DetailWatch-one-basic-button">
              <p style={{margin:"0px",padding:"0px"}}>
                  Nie możesz wysłać zaproszenia
              </p>
            </div>)
    break;
    default: console.log('Default')
  }}

  const PrivacyValidation = () => {
    if(!photos.post.displayData) {
      return false
    }
    if(!photos.post.displayDataForUnknown) {
      console.log(photos.post.displayDataForUnknown)
      console.log('Jest ustawiona funkcja')
      const displayDataForUnknown = photos.post.friendsInvitation.some((friend:any) => {
        return friend._id == props.userData.users[0]._id
      })
      if(displayDataForUnknown) {
        console.log('Znaleziono')
        return true
      } else {
        console.log('Nie znaleziono')
        return false
      }
    } else {
      console.log('Funkcja nie jest ustawiona')
      return true
    }
  }

  // console.log('Wynik' + PrivacyValidation())
  console.log(photos)

  const opcja2 = () => {
    const check = photos.post.friendsInvitation.some((invitation:any) => {
      {return invitation.friendInvitation === props.userData.users[0]._id}
    })
    const match = props.userData.users[0].friends.some((friend:any) => {
      return friend._id == photos.post._id
    })
    if(check) {
      return <div><h5>Zaproszenie, czekanie na opowiedź...</h5></div>
    } else {
      switch(match) {
        case true:  
             return (<div className="DetailWatch-one-basic-button" onClick={() => deleteFromFriends(photos.post._id)}>Usun ze znajomych</div>)
        break;
        case false:  
         return opcja1()
        break;
        default: console.log('Default')
      }
    }
    }

  return (
    
    <div className="ViewProfilePage">
      {photos.loading ? <Loader /> :
        <div className="ViewProfilePage-container">
        <div className="ViewProfilePage-main">

            <div className="ViewProfilePage-LoginPic">
                <div><img className="ProfilePicture" src={photos.post.userPhoto} alt="NO pic"/></div>
                <div><h3>{photos.post.login}</h3></div>
                <div><p>e-mail: {photos.post.email}</p></div>
            </div>
            {PrivacyValidation() && 
            <div className="ViewProfilePage-personalDataMain">
            
                <div className="ViewProfilePage-personalData">
                    <div><h3>Dane osobowe</h3></div>
                    <table>
                      {photos.post.name != undefined &&
                        <tr>
                          <td><b>Imię</b></td>
                          <td>{photos.post.name}</td>
                        </tr> }
                        {photos.post.surname != undefined &&
                        <tr>
                        <td><b>Nazwisko</b></td>
                        <td>{photos.post.surname}</td>
                        </tr>}
                        {photos.post.city != undefined &&
                        <tr>
                        <td><b>Miasto</b></td>
                        <td>{photos.post.city}</td>
                        </tr>}
                        {photos.post.streen != undefined &&
                        <tr>
                        <td><b>Ulica</b></td>
                        <td>{photos.post.street}, {photos.post.numberOfHome}</td>
                        </tr>}
                        {photos.post.postalCode != undefined &&
                        <tr>
                        <td><b>Kod pocztowy</b></td>
                        <td>{photos.post.postalCode}</td>
                        </tr>}
                        {photos.post.sex != undefined &&
                        <tr>
                        <td><b>Płeć</b></td>
                        <td>{photos.post.sex=="Mężczyzna" ? "Mężczyzna" : "Kobieta"}</td>
                        </tr>}
                    </table>
                  </div> 
                </div> }
        </div>
      
        <div className="ViewProfilePage-Buttons">
            {props.userData.loading ? <p>Loading..</p> : opcja2()}
        </div>
        {PrivacyValidation() &&
        <div className="ViewProfilePage-friends"> 
            {photos.post.friends.length == 0 ?
            <div className="alternative">
            <div><FaUserFriends size="100px" /> </div>
            <div><p style={{margin:"0px"}}>Aktualnie nie masz żadnych znajomych</p></div>
          </div>
            : photos.post.friends.map((friend:any) => 
              <FriendCard key={friend.friend._id} id={friend.friend._id} name={friend.friend.login} userPhoto={friend.friend.userPhoto}/>
            )}
          </div> }
          {PrivacyValidation() && 
          <React.Fragment>
          <h3>ULUBIONE</h3>
          {photos.post.favorite.length == 0 ? <div><p>Użytkownik nie ma polubionych zegarków</p></div> :
          <div className="ViewProfilePage-favorite">
            {photos.post.favorite.map((photo:any) => <WatchCardProfile
            key={photo.favoriteProduct._id} 
            id={photo.favoriteProduct._id} 
            price={photo.favoriteProduct.watchPrice} 
            name={photo.favoriteProduct.watchMark} 
            photo={photo.favoriteProduct.watchPhotos}
            ratio={photo.favoriteProduct.watchOverallRatio}
            comments={photo.favoriteProduct.watchNumberOfComments}
            />)} 
          </div>} </React.Fragment>}
        </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(OtherProfil);

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

const WatchCardProfile = (props:Props) => {

  return (
    <Link to={`/Watches/${props.id}`} title={props.name} className="news-card">
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
    </Link>
  )
}

interface Props3 {
  key:string,
  id:string,
  name:string,
  userPhoto:string,
}

const FriendCard = (props:Props3) => {

  return (
    <div className="friendCard">

      <div className="friendCard-one">
        <div className="friendCard-photo">
          <img className="friendCard-photo-img"src={props.userPhoto}/>
        </div>
      </div>

      <div className="friendCard-two">
        <div><h5 style={{margin:"4px"}}>{props.name}</h5></div>
        <div><a href={`/user/${props.id}`} style={{margin:"4px"}}>Zobacz profil</a></div>
      </div>
    </div>
  )
}