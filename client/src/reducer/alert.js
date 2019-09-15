// This is a reducer for alerts , this is will be the action set to render in our components

//let us import our types that has been declared in the types.js

import { SET_ALERT, REMOVE_ALERT } from '../../src/actions/type'
const initialState = []

export default function (state = initialState, action) {
    // you can actually destructure the action.payload / action.type 
    // const { type, payload } = action
    
    switch (action.type) {

        case SET_ALERT:
            return [...state, action.payload];
        
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== action.payload);
        
        default:
            return state;
    }
}
