import Constants from "expo-constants";

const { manifest } = Constants;

const devUri = `http://${manifest.debuggerHost.split(':').shift()}:3000`;
const prodUri = 'http://uptraceapi-env.eba-qtswbmmy.ap-southeast-1.elasticbeanstalk.com';
const uri = prodUri;

export const ADD_LOG = 'ADD_LOG';



export const addLog = (userData, token, room_id) => {
    return async dispatch => {
        const response = await fetch(
            `${uri}/logs`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    room_id: room_id,
                    user: userData
                })
            }
        );

        if(!response.ok){
            const errorResData = await response.json()
            const errorMessage = errorResData.error.message;

            throw new Error(errorMessage);
        }

        const resData = await response.json();
        return resData
        // console.log("resData from scanner:", resData);
    };
};