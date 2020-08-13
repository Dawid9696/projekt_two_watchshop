import React, {useState} from 'react';
import axios from 'axios'
import { getJwt } from '../../../jwt';

const DeleteProfile:React.FC = () => {

  const [email,setEmail] = useState()
  const [password,setPassword] = useState()

  const wyslij = (e:any) => {
  e.preventDefault()
  const data = {email,password}
  const jwt = getJwt()
  axios.post(`http://localhost:5000/Swiss/deleteProfile`,data,{headers:{Authorization:`Bearer ${jwt}`}})
  .then(res => localStorage.removeItem('cool-jwt'))
  .then(res => setTimeout(() => {window.location.href = './LoginRegister'},2000))
  .catch(err => window.alert(err))
}

  return (
    <div className="ProfileDiv">
        <form className="ProfileForumlar" onSubmit={wyslij}>
            <fieldset className="ProfileFieldset">
                <legend>Usuń konto</legend>
                <label>E-mail</label>
                <input type="text" onChange={(e:any) => setEmail(e.target.value)}    />
                <label>Hasło</label>
                <input type="password" onChange={(e:any) => setPassword(e.target.value)}    />
                <button type="submit">Potwierdź</button>
            </fieldset>
        </form>
    </div>
  );
}

export default DeleteProfile;