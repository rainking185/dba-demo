import { combineReducers } from 'redux'
import profileReducer from './profile'
import navigationReducer from './navigation'

export default combineReducers({
  profile: profileReducer,
  navigation: navigationReducer
})