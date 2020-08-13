import React, {useEffect,useReducer} from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'
import Loader from '../Loader';
import { MdGrade} from 'react-icons/md';
import axios from 'axios'
import { getJwt } from '../../../jwt';
import { FaUserFriends} from 'react-icons/fa';
import { FcInvite} from 'react-icons/fc';

const ViewProfile:React.FC = ({userData,fetchUsers}:any) => {

  useEffect(() => {
    fetchUsers()
  },[])

  const acceptAnInvitation = (id:string) => {
    const jwt = getJwt()
    axios.post(`http://localhost:5000/Swiss//acceptInviteUserToFriends/${id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
      .then(res => window.alert('Akceptowano zaproszenie !'))
      .catch(err => console.log('Błąd!'+err.msg))
  }

  const rejectAnInvitation = (id:string) => {
    const jwt = getJwt()
    console.log(id)
    axios.post(`http://localhost:5000/Swiss/rejectInviteUserToFriends/${id}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
      .then(res => window.alert('Odrzucono zaproszenie !'))
      .catch(err => console.log('Błąd!'+err.msg))
  }

  console.log(userData)
  
  return (
    
    <div className="ViewProfilePage">
      {userData.loading ? <Loader /> :
        <div className="ViewProfilePage-container">
          <div className="ViewProfilePage-main">

          <div className="ViewProfilePage-LoginPic">
            <div><img className="ProfilePicture" src={userData.users[0].userPhoto} alt="NO pic"/></div>
            <div><h3>{userData.users[0].login}</h3></div>
            <div><p>e-mail: {userData.users[0].email}</p></div>
          </div>

          <div className="ViewProfilePage-personalData">
            <div><h3>Dane osobowe</h3></div>
            <table>
            <tr>
              <td><b>Imię</b></td>
              <td>{userData.users[0].name}</td>
            </tr>
            <tr>
              <td><b>Nazwisko</b></td>
              <td>{userData.users[0].surname}</td>
            </tr>
            <tr>
              <td><b>Miasto</b></td>
              <td>{userData.users[0].city}</td>
            </tr>
            <tr>
              <td><b>Ulica</b></td>
              <td>{userData.users[0].street}, {userData.users[0].numberOfHome}</td>
            </tr>
            <tr>
              <td><b>Kod pocztowy</b></td>
              <td>{userData.users[0].postalCode}</td>
            </tr>
            <tr>
              <td><b>Płeć</b></td>
              <td>{userData.users[0].sex=="Mężczyzna" ? "Mężczyzna" : "Kobieta"}</td>
            </tr>
            </table>
          </div>

          </div>
        
          <div className="ViewProfilePage-Invitations">
          {userData.users[0].friendsInvitation.length == 0 ? 
          
          <div className="alternative">
            <div><FcInvite size="100px" /></div>
            <div><p style={{margin:"0px"}}>Aktualnie nie masz żadnych zaproszeń</p></div>
          </div>
          
           : 
          
          userData.users[0].friendsInvitation.map((photo:any) => 
          <InvitationCard
            reject={() => rejectAnInvitation(photo.friendInvitation._id)}
            accept={() => acceptAnInvitation(photo.friendInvitation._id)}
            key={photo.friendInvitation._id} 
            id={photo.friendInvitation._id} 
            name={photo.friendInvitation.login} 
            userPhoto={photo.friendInvitation.userPhoto}
            />)}
          </div>
          <div className="ViewProfilePage-friends">
            
            {userData.users[0].friends.length == 0 ?
            <div className="alternative">
            <div><FaUserFriends size="100px" /> </div>
            <div><p style={{margin:"0px"}}>Aktualnie nie masz żadnych znajomych</p></div>
          </div>
            : userData.users[0].friends.map((friend:any) => 
              <FriendCard key={friend.friend._id} id={friend.friend._id} name={friend.friend.login} userPhoto={friend.friend.userPhoto}/>
            )}
          </div>
          <h3>ULUBIONE</h3>
          <div className="ViewProfilePage-favorite">
            {userData.users[0].favorite.map((photo:any) => <WatchCardProfile
            key={photo.favoriteProduct._id} 
            id={photo.favoriteProduct._id} 
            price={photo.favoriteProduct.watchPrice} 
            name={photo.favoriteProduct.watchMark} 
            photo={photo.favoriteProduct.watchPhotos}
            ratio={photo.favoriteProduct.watchOverallRatio}
            comments={photo.favoriteProduct.watchNumberOfComments}
            />)}
          </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(ViewProfile);

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

interface Props2 {
  id:string,
  name:string,
  userPhoto:string,
  reject:any,
  accept:any
}

export const InvitationCard = (props:Props2) => {

  return (
    <div className="InvitationCard">
      <Link to={`/user/${props.id}`} title={props.name}  className="InvitationCardPhoto">
        <img className="InvitationCardPhotoImg" src={props.userPhoto}/>
      </Link>
      <div className="InvitationCardData">
        <div><p>Użytkownik: {props.name}</p></div>
        <div className="InvitationCardDecision">
          <div onClick={props.accept} className="acceptButton">Zaakceptuj</div>
          <div onClick={props.reject} className="rejectButton">Odrzuć</div>
        </div>
      </div>
    </div>
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
        <div><p  style={{margin:"4px"}}>Zobacz profil</p></div>
      </div>
    </div>
  )
}