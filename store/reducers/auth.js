import { SIGNUP } from "../actions/auth"

const initialState = {
    // to be filled out
    token: null,
}

export default (state = initialState, action) => {
    switch(action.type){
        case SIGNUP:
            return {
                token: action.token,
            }

        default:
            return state
    }
}