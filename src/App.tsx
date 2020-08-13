import React from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import './App.scss'
import { Provider } from 'react-redux'
import store from './redux/user'

//Imported components
import Navbar from './components/WatchShop/Navbar'
import Home from './components/WatchShop/Home/Home';
import Watches from './components/WatchShop/Shop/Watches';
import LoginRegister from './components/WatchShop/Profils/LoginRegister';
import DetailWatch from './components/WatchShop/Shop/DetailWatch';
import Profile from './components/WatchShop/Profils/Profile';
import ShoppingCart from './components/WatchShop/Shop/ShoppingCart';
import Footer from './components/WatchShop/Footer';
import Favorite from './components/WatchShop/Shop/Favorite';
import WishList from './components/WatchShop/Shop/WishList';

//Imports
import UpdateProfile from './components/WatchShop/Profils/UpdateProfile'
import ProfilePrivacy from './components/WatchShop/Profils/ProfilePrivacy';
import ProfilePhoto from './components/WatchShop/Profils/ProfilePhoto';
import DeleteProfile from './components/WatchShop/Profils/DeleteProfile';
import AccProfile from './components/WatchShop/Profils/AccProfile';
// import ForumMainPage from './components/WatchShopForum/ForumMainPage';
// import ForumDetailPage from './components/WatchShopForum/ForumDetailPage';
import ViewProfile from './components/WatchShop/Profils/ViewProfile';
import OtherProfil from './components/WatchShop/Profils/OtherProfil'

function App() {
  return (
    <div className="App">
      <Router>
        <Provider store={store}>
          <Navbar/>
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/Watches" exact component={Watches}/>
              <Route path="/Watches/:id" exact component={DetailWatch}/>
              <Route path="/Profile" exact component={Profile}/>
              {/* <Route path="/ForumLogin" exact component={ForumMainPage}/>
              <Route path="/post" exact component={ForumDetailPage}/> */}
              <Route path="/ShoppingCart" exact component={ShoppingCart}/>
              <Route path="/Favorite" exact component={Favorite}/>
              <Route path="/WishList" exact component={WishList}/>
              <Route path="/LoginRegister" exact component={LoginRegister}/> 
              <Route path="/user" exact component={ViewProfile}/> 
              <Route path="/user/:id" exact component={OtherProfil}/> 
            </Switch>
          <Footer/>
        </Provider>
      </Router>
    </div>
  );
}

export default App;
