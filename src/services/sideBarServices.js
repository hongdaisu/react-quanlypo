import axios from "./axios";

const getGroup_Id = (Group_Id) => {
    // console.log('use_groupId services', Group_Id)
    return axios.get(`/api/get-group_id/${Group_Id}`);
}

const getMaGroup = () => {
    // console.log('use_groupId services', Group_Id)
    return axios.get(`/api/get-magroup`);
}

export {
    getGroup_Id,
    getMaGroup
}