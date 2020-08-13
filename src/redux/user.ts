import { createStore, applyMiddleware,combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import axios from 'axios'
import {getJwt} from '../jwt'

const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST'
const FETCH_USERS_FAIL = 'FETCH_USERS_FAIL'

const initialState = {
    loading:true,
    users:[],
    error:''
}

export const fetchUsers = () => {
    return (dispatch:any) => {
      dispatch(fetchUsersRequest())
      const jwt = getJwt()
      axios
        .get('http://localhost:5000/Swiss/myprofile',{headers:{Authorization:`Bearer ${jwt}`}})
        .then(response => {
          // response.data is the users
          const users = response.data
          dispatch(fetchUsersSuccess(users))
        })
        .catch(error => {
          // error.message is the error message
          dispatch(fetchUsersFail(error.message + "Błąd"))
        })
    }
  }


export const fetchUsersRequest = () => {
    return {
      type: FETCH_USERS_REQUEST
    }
  }
  
  export const fetchUsersSuccess = (users:any) => {
    return {
      type: FETCH_USERS_SUCCESS,
      payload: users
    }
  }
  
  export const fetchUsersFail = (error:any) => {
    return {
      type: FETCH_USERS_FAIL,
      payload: error
    }
  }

const userReducer = (state = initialState, action:any) => {
    switch (action.type) {
        case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: ''
      }
    case FETCH_USERS_FAIL:
      return {
        loading: false,
        users: [],
        error: action.payload
      }
    default: return state
    }
}

const rootReducer = combineReducers({user:userReducer})

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

export default store
