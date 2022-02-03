
const uri = `google.com`;

export const ADD_PATIENT = 'ADD_PATIENT';
export const CHECK_IF_USER_IS_NEGATIVE = 'CHECK_IF_USER_IS_NEGATIVE';


export const checkIfUserIsNegative = (contactNum, token) => {
    return async dispatch => {
        const response = await fetch(
            `${uri}/patients/${contactNum}/status`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }
        );

        if(!response.ok){
            const errorResData = await response.json()
            const errorMessage = errorResData.error.message;
            console.log("error:", errorMessage);
            throw new Error(errorMessage);
        }

        const resData = await response.json();
        // console.log("resData from disclose check if user is nega:", resData);
        return resData;
    };
};

export const addPatient = (userData, token, formData) => {
    return async dispatch => {
        const response = await fetch(
            `${uri}/patients`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    user: userData,
                    condition: formData.condition,
                    onset_date: formData.onsetDate,
                    disclosure_date: formData.disclosureDate,
                    status: formData.status
                })
            }
        );

        if(!response.ok){
            const errorResData = await response.json()
            const errorMessage = errorResData.error.message;

            throw new Error(errorMessage);
        }

        const resData = await response.json();
        // console.log("resData from addPatient:", resData);
        return resData;
    };
};