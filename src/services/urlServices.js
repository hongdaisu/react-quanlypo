import axios from "./axios";

const getUrl = () => {
    // console.log('use_groupId services', Group_Id)
    return axios.get(`/api/url-view`);
}

export {
    getUrl
}