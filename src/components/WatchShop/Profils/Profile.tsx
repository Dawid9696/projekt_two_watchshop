import React, {useState,useEffect,useReducer} from 'react';
import axios from 'axios'
import { BrowserRouter as Router,Route,Switch,Link } from 'react-router-dom';
import {connect} from 'react-redux'
import {fetchUsers} from '../../../redux/user'

// //Imports
import UpdateProfile from './UpdateProfile'
import ProfilePrivacy from './ProfilePrivacy';
import ProfilePhoto from './ProfilePhoto';
import DeleteProfile from './DeleteProfile';
import AccProfile from './AccProfile';
import Loader from '../Loader';

const Profile:React.FC = ({fetchUsers,userData}:any) => {

  useEffect(() => {
    fetchUsers()
  },[])

  return (
    <div className="Profile">
      {userData.loading ? <Loader /> :
      <Router>
        <div className="Profile-Panel">
          <div className="Profile-Panel-Image">
            <div  className="Profile-Panel-Image-Logo">
              {userData.users[0].userPhoto ? <img width="100px" src={userData.users[0].userPhoto}/> : "DM"}
            </div>
            <div>{userData.users[0].name} {userData.users[0].surname}</div>
          </div>
          <div className="Profile-Panel-Options">
            {userData.users[0].admin &&
            <div><Link to="/Profile/">Panel admina</Link></div> }
            <div><a href="/user">Wyświetl profil</a></div>
            <div><Link to="/Profile/">Profil</Link></div>
            <div><Link to="/Profile/ProfilePhoto">Zdjęcie</Link></div>
            <div><Link to="/Profile/AccProfile">Konto</Link></div>
            <div><Link to="/Profile/ProfilePrivacy">Prywatność</Link></div>
            <div><Link to="/Profile/DeleteProfile">Usuń konto</Link></div>
          </div>
        </div>

        <div className="Profile-Window">
          <div className="Profile-Window-Content">
            <Switch>
              <Route path='/Profile/' exact component={UpdateProfile}/>
              <Route path='/Profile/ProfilePrivacy' exact component={ProfilePrivacy}/>
              <Route path='/Profile/ProfilePhoto' exact component={ProfilePhoto}/>
              <Route path='/Profile/DeleteProfile' exact component={DeleteProfile}/>
              <Route path='/Profile/AccProfile' exact component={AccProfile}/>
            </Switch>
          </div>
        </div> 
      </Router> }
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

export default connect(mapStateToProps,mapDispatchToProps)(Profile);