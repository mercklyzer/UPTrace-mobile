import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from "expo-constants";

const { manifest } = Constants;

const devUri = `http://${manifest.debuggerHost.split(':').shift()}:3000`;
const prodUri = 'http://uptraceapi-env.eba-qtswbmmy.ap-southeast-1.elasticbeanstalk.com';
const uri = prodUri;

export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

export const authenticate = (user, token) => {
    return {type: AUTHENTICATE, user:user, token:token}
}

export const requestOtp = (contactNum) => {
    return async () => {
        console.log("requesting otp");
        const response = await fetch(
            `${uri}/users/generate-otp`,
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
            // const errorMessage = errorResData.error.message
            console.log(errorResData.error);
            throw errorResData.error
        }

        const resData = await response.json()
        return resData
    }
}

export const signup = (signupObject) => {
    return async dispatch => {
        const response = await fetch(
            `${uri}/users`,
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
        dispatch({type:SIGNUP, token: resData.token, user: resData.user})
        saveDataToStorage(resData.token, resData.user)
    }
}

export const login = (contactNum, password) => {
    return async dispatch => {
        const response = await fetch(
            `${uri}/users/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contact_num: contactNum,
                    password: password
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
        dispatch({type:LOGIN, token: resData.token, user: resData.user})
        saveDataToStorage(resData.token, resData.user)
    }
}

export const logout = () => {
    deleteDataInStorage()
    return {type: LOGOUT}
}

const saveDataToStorage = (token, user) => {
    const userStringify = JSON.stringify(user)

    AsyncStorage.setItem('userData', JSON.stringify({
        token: token, 
        user: userStringify
    }))
}

const deleteDataInStorage = () => {
    AsyncStorage.removeItem('userData')
}