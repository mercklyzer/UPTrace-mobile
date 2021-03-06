// FOR DEV MODE
// import Constants from "expo-constants";

// const { manifest } = Constants;

// const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000`;

const uri = 'https://uptrace-server.com';

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