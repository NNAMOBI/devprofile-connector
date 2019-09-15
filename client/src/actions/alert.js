import uuid from 'uuid' // unique unviersal id - for generating auto-increment id
import { SET_ALERT, REMOVE_ALERT } from './type';


export const setAlert = (msg, alertType) => dispatch => {
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    })
}