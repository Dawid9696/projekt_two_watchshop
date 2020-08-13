import React, {useState} from 'react';
import axios from 'axios'
import { getJwt } from '../../../jwt';

const UpdateProfile:React.FC = () => {

const [name,setName] = useState()
const [surname,setSurname] = useState()
const [city,setCity] = useState()
const [street,setStreet] = useState()
const [numberOfHome,setNumberOfHome] = useState()
const [postalCode,setPostalCode] = useState()

const wyslij = (e:any) => {
  e.preventDefault()
  const data = {name,surname,city,street,numberOfHome,postalCode}
  const jwt = getJwt()
  axios.post(`http://localhost:5000/Swiss/changeData`,data,{headers:{Authorization:`Bearer ${jwt}`}})
  .then(res => window.alert('Zakutalizowane'))
  .catch(err => window.alert('Błąð'))
}

  return (
    <div className="ProfileDiv">
        <form className="ProfileForumlar" onSubmit={wyslij}>
            <fieldset className="ProfileFieldset">
                <legend>Zaktualizuj dane</legend>
                <label>Imię</label>
                <input type="text" onChange={(e:any) => setName(e.target.value)}   />
                <label>Nazwisko</label>
                <input type="text" onChange={(e:any) => setSurname(e.target.value)}   />
                <label>Miasto</label>
                <input type="text" onChange={(e:any) => setCity(e.target.value)}   />
                <label>Ulica</label>
                <input type="text" onChange={(e:any) => setStreet(e.target.value)}   />
                <label>Nr. domu</label>
                <input type="text" onChange={(e:any) => setNumberOfHome(e.target.value)}   />
                <label>Kod pocztowy</label>
                <input type="text" onChange={(e:any) => setPostalCode(e.target.value)}   />
                <button type="submit">Zapisz</button>
            </fieldset>
        </form>
    </div>
  );
}

export default UpdateProfile;