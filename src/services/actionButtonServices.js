import axios from "./axios";

const handleGetAction = (button) => {
    //console.log('check button:', button)
    return axios.post('/api/get-action', { actionButton: button });
}

// const handleGetAction = (button, userId) => {
//     return axios.post('/api/get-action', { actionButton: button, User_Id: userId });
// }

export {
    handleGetAction
}