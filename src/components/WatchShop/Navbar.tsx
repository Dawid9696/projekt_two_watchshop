import React, { useEffect } from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {fetchUsers} from '../../redux/user'
import axios from 'axios'
//ICONS
import { FaShoppingCart,FaSearch} from 'react-icons/fa';
import { MdFavorite} from 'react-icons/md';
import { FiLogIn,FiLogOut } from 'react-icons/fi';
import { BsFillPersonFill } from 'react-icons/bs';
import { GiPresent } from 'react-icons/gi';
import { getJwt } from '../../jwt';

const Navbar:React.FC = ({userData,fetchUsers}:any) => {

  useEffect(() => {
    if(jwt) fetchUsers()
  },[])
  const jwt = getJwt()
const url = "https://timdesign.top/wp-content/uploads/2020/04/cropped-Logo-TD-for-website-2.0.png"

const logout = () => {
  axios.post(`http://localhost:5000/Swiss/logout`,'',{headers:{Authorization:`Bearer ${jwt}`}})
  .then(res => localStorage.removeItem('cool-jwt'))
  .catch(err => console.log('Błąd!'+err.msg))
  setTimeout(() => {window.location.href = '/LoginRegister'},2000)
}

return (
    <header className="Navbar">

        <div className="Navbar-logo"><img id="logo" src={url} alt="Loading.."/></div>

        <nav className="Navbar-navigator">
            <div><Link style={{textDecoration:"none"}} to={'/'}><p>Home</p></Link></div>
            <div className="Navbar-dropdown"><Link style={{textDecoration:"none"}}  to={'/Watches'}><p>Zegarki</p></Link></div>
        </nav>

        <div className="Navbar-user">
            <input type="text" placeholder="Szukaj..." />
            <div><FaSearch size="25px" style={{color:"black"}}/></div>

            {jwt ? userData.loading ? <p>Loading...</p> : 
            <React.Fragment>
            <Link to={'/user'}><img className="navbarLogoUser" width="40px" src={userData.users[0].userPhoto}/></Link>
            <div>{userData.users[0].login}</div>
            <div><Link to={'/Favorite'}><MdFavorite size="25px" style={{color:"black"}}/></Link></div>
            <div><Link to={'/ShoppingCart'}><FaShoppingCart size="25px" style={{color:"black"}}/></Link></div>
            <div><Link to={'/WishList'}><GiPresent size="30px" style={{color:"black"}}/></Link></div>
            <div><Link style={{textDecoration:"none"}}  to={'/Profile'}><BsFillPersonFill size="30px" style={{color:"black"}}/></Link></div>
            <div><div onClick={logout} title="Log out"><FiLogOut size="25px" style={{color:"black"}}/></div></div>
            </React.Fragment> :
            <div><Link to={'/LoginRegister'} title="Go to W3Schools HTML section"><FiLogIn size="25px" style={{color:"black"}}/></Link></div> }
            <div className="Navbar-phone"><p>Zadzwoń 789 106 570</p></div>
        </div>

    </header>
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

export default connect(mapStateToProps,mapDispatchToProps)(Navbar);