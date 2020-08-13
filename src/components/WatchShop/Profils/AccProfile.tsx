import React, {useState} from 'react';
import axios from 'axios'
import { getJwt } from '../../../jwt';

const AccProfile:React.FC = () => {

  const [NewPassword,setNewPassword] = useState()
  const [confirmPassword,setConfirmPassword] = useState()

  const wyslij = (e:any) => {
    e.preventDefault()
    const data = {
      password:NewPassword
    }
    if(NewPassword == confirmPassword) {
      const jwt = getJwt()
      axios.post(`http://localhost:5000/Swiss/changePassword`,data,{headers:{Authorization:`Bearer ${jwt}`}})
      .then(res => window.alert('Hasło zmienione'))
      .catch(err => window.alert('Błędne hasło'))
    } else {
      window.alert('Hasla sie nie zgadzaja')
    }
  }

  return (
    <div className="ProfileDiv">
        <form className="ProfileForumlar" onSubmit={wyslij}>
            <fieldset className="ProfileFieldset">
                <legend>Zmiana hasła</legend>
                <label>Nowe hasło</label>
                <input type="password" onChange={(e:any) => setNewPassword(e.target.value)}  />
                <label>Powtórz hasło</label>
                <input type="password" onChange={(e:any) => setConfirmPassword(e.target.value)}  />
                <button type="submit">Zapisz</button>
            </fieldset>
        </form>
    </div>
  );
}

export default AccProfile;