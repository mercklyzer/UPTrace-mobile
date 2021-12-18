export const ADD_LOG = 'ADD_LOG';

export const addLog = (scan_date, room_id, userData, token) => {
    return async dispatch => {
        const response = await fetch(
            'http://10.0.2.2:3000/logs',
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