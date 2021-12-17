import { AUTHENTICATE ,SIGNUP, LOGIN, LOGOUT } from "../actions/auth"

const initialState = {
    // to be filled out
    token: null,
    user: null
}

export default (state = initialState, action) => {
    switch(action.type){
        case AUTHENTICATE:
            return {
                token: action.token,
                user: action.user
            }
        case SIGNUP:
            return {
                token: action.token,
                user: action.user
            }
        case LOGIN:
            return {
                token: action.token,
                user: action.user
            }

        case LOGOUT:
            return initialState

        default:
            return state
    }
}