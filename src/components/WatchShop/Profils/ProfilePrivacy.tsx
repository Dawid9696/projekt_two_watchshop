import React, {useState,useEffect,useReducer} from 'react';
import axios from 'axios'
import { getJwt } from '../../../jwt';
import Loader from '../Loader';

const ProfilePrivacy:React.FC = () => {

  const jwt = getJwt()
  useEffect(() => {
    axios.get('http://localhost:5000/Swiss/myprofile',{headers:{Authorization:`Bearer ${jwt}`}})
    .then(res => {
      setp1(res.data[0].displayData)
      setp2(res.data[0].displayDataForUnknown)
      setp3(res.data[0].displayDataInPosts)
      setp4(res.data[0].whoDisplayDataInPosts)
      setp5(res.data[0].invitations)
      setp6(res.data[0].listOfFriends)
      setLoading(false)
    })
    .catch(err => console.log('Błąd'))
  },[])
 
  const [p1,setp1] = useState()
  const [p2,setp2] = useState()
  const [p3,setp3] = useState()
  const [p4,setp4] = useState()
  const [p5,setp5] = useState()
  const [p6,setp6] = useState()
  const [loading,setLoading] = useState(true)

  const wyslij = (e:any) => {
  e.preventDefault()
  const data = {
    displayData:p1,
    displayDataForUnknown:p2,
    invitations:p5,
    listOfFriends:p6
  }
  const jwt = getJwt()
  axios.post(`http://localhost:5000/Swiss/changePrivate`,data,{headers:{Authorization:`Bearer ${jwt}`}})
  .then(res => window.alert('Zakutalizowane dane prywatnosci'))
  .catch(err => console.log(err))
  }

  return (
            <div className="ProfilePrivacy"> 
             {loading ? <Loader /> : 
              <form  className="ProfilePrivacy-form" onSubmit={wyslij}>
                <fieldset className="ProfilePrivacy-fieldset">
                  <legend>Prywatność</legend>
                  <table className="ProfilePrivacy-table">
                    <tr>
                      <td><p>Wyświetlać dane osobowe na profilu ?</p></td>
                      <td><input type="checkbox" checked={p1} onClick={(e:any) => setp1(p1 ? false : true)}    /></td>
                    </tr>
                  
                    <tr>
                      <td><p>Wyświetlać dane osobowe dla nieznajomych ?</p></td>
                      <td><input type="checkbox" checked={p2} onChange={(e:any) => setp2(p2 ? false : true)}    /></td>
                    </tr>
                    <tr>
                      <td><p>Kto może wysyłać do Ciebie zaproszenia do grona znajomych ?</p></td>
                      <td>
                        <select id="cars" value={p5} onChange={(e:any) => setp5(e.target.value)}   >
                          <option value="Wszyscy" >Wszyscy</option>
                          <option value="Znajomi znajomych">Znajomi znajomych</option>
                          <option value="Nikt">Nikt</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td><p>Kto może zobaczyć Twoją listę znajomych ?</p></td>
                      <td>
                        <select id="cars" value={p6} onChange={(e:any) => setp6(e.target.value)}   >
                          <option value="Wszyscy">Wszyscy</option>
                          <option value="Znajomi">Znajomi</option>
                          <option value="Znajomi znajomych">Znajomi znajomych</option>
                          <option value="Nikt">Nikt</option>
                        </select>
                      </td>
                    </tr>
                  </table>
                  <button type="submit">Zapisz</button>
                </fieldset>    
            </form> 
            } 
            </div>
  );
}

export default ProfilePrivacy;