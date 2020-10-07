import axios from 'axios';

export const KEYTYPE = "KEYTYPE"
export const CONNECTIVE = "CONNECTIVE"
const api = process.env.REACT_APP_SERVER;

export function getKeyTypes() {
    return dispatch => {
        axios.get(`${api}/keytype`)
        .then(response => {
            if(response.error) {
                throw(response.error);
            }
            dispatch({type: KEYTYPE, data: response.data});
        })
    }
}

export function getConnectives() {
    return dispatch => {
        axios.get(`${api}/connective`)
        .then(response => {
            if(response.error) {
                throw(response.error);
            }
            dispatch({type: CONNECTIVE, data: response.data});
        })
    }
}