import AsyncStorage from '@react-native-async-storage/async-storage'

export const SIGNUP = 'SIGNUP'
// export const LOGIN = 'LOGIN'
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

export const authenticate = (userId, token) => {
    return {type: AUTHENTICATE, userId:userId, token:token}
}

export const requestOtp = (contactNum) => {
    return async dispatch => {
        console.log("requesting otp");
        const response = await fetch(
            'http://10.0.2.2:3000/users/generate-otp',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contact_num: contactNum,
                })
            }
        )

        if(!response.ok){
            const errorResData = await response.json()
            const errorMessage = errorResData.error.message

            throw new Error(errorMessage)
        }

        const resData = await response.json()
        return resData.message

        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    }
}

export const signup = (signupObject) => {
    console.log(signupObject.contact_num);
    return async dispatch => {
        const response = await fetch(
            'http://10.0.2.2:3000/users',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ["contact_num"]: signupObject["contact_num"],
                    ["password"]: signupObject["password"],
                    ["confirm_password"]: signupObject["confirm_password"],
                    ["role"]: signupObject["role"],
                    ["start_time"]: signupObject["start_time"],
                    ["end_time"]: signupObject["end_time"],
                    ["way_of_interview"]: signupObject["way_of_interview"],
                    ["otp"]: signupObject["otp"]   
                })
            }
        )

        if(!response.ok){
            const errorResData = await response.json()
            const errorMessage = errorResData.error.message

            throw new Error(errorMessage)
        }

        const resData = await response.json()
        console.log(resData);
        dispatch({type:SIGNUP, token: resData.token})
        return resData.message

        dispatch({type:SIGNUP, })
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAS3_m_Ifo_3PV020yb5M9m-Fo-INv_HVM',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        )

        if(!response.ok){
            // depends on your API
            const errorResData = await response.json()
            const errorId = errorResData.error.message

            let errorMessage = 'Something went wrong!'
            if(errorId === 'EMAIL_NOT_FOUND'){
                errorMessage = 'Email does not exist.'
            }
            if(errorId === 'INVALID_PASSWORD'){
                errorMessage = 'Invalid password.'
            }
            console.log(errorResData);

            throw new Error(errorMessage)
        }

        const resData = await response.json()
        console.log(resData);
        dispatch(authenticate(resData.localId, resData.idToken))
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
        saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    }
}

export const logout = () => {
    return {type: LOGOUT}
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token, 
        userId: userId,
        expiryDate: expirationDate.toISOString()
    }))
}