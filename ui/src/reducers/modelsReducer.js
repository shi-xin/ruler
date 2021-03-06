import { SUCCESS, ERROR, SELECT } from '../actions/model'

const initialState = {
    error: null, 
    data: [], 
    selected: undefined
}

export default function modelsReducer(state=initialState, action) {
    switch(action.type) {
        case SUCCESS:
            return {...state, 
                data: action.data}
        case ERROR: 
            return {
                ...state, 
                error: action.error}
        case SELECT:
            return {
                ...state,
                selected: action.data
            }
        default:
            return state;
    }
}
