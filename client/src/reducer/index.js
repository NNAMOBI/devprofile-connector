import { combineReducers } from 'redux' 
import alert from './alert'

export default combineReducers({ //alert here is variable holding the alert reducer(alert.js file) ,thats why it was 
                                  // imported and its one of the reducers in the root reducer,there will be other reducers
    alert
})