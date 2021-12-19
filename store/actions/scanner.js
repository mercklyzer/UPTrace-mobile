import Constants from "expo-constants";

const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000`;

export const ADD_LOG = 'ADD_LOG';



export const addLog = (userData, token, scan_date, room_id) => {
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
                    scan_date: scan_date,
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
        // console.log("resData from scanner:", resData);
    };
};