import { combineReducers } from 'redux'
import profileReducer from './profile'
import appReducer from './app'

export default combineReducers({
  profile: profileReducer,
  app: appReducer
})