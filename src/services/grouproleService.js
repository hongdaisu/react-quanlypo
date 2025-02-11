import axios from './axios';

const fetchAllGroup = () => {
    return axios.get(`/api/get-all-group`);
}

const newGroupService = (data) => {
    return axios.post('/api/create-new-group', data);
}

const editGroupService = (data) => {
    return axios.put('/api/edit-group', data);
}

const deleteGroupService = (idGroup) => {
    return axios.delete('/api/delete-group', { data: { id: idGroup } });
}


const fetchAllRole = () => {
    return axios.get(`/api/get-all-role`);
}

const newRoleService = (data) => {

    return axios.post('/api/create-new-role', data);
}
const editRoleService = (data) => {
    return axios.put('/api/edit-role', data);
}

const deleteRoleService = (idRole) => {
    return axios.delete('/api/delete-role', { data: { id: idRole } });
}

const newRoleGroupService = (data) => {
    return axios.post('/api/create-new-rolegroup', data);
}

const deleteRoleGroupService = (data) => {
    //sconsole.log('check data', data)
    return axios.delete('/api/delete-rolegroup', { data: data });
}

const checkGroupRole = (groupId) => {
    return axios.put(`/api/get-all-checkrolegroup`, groupId);
}

const getAllGroupRole = (groupId) => {
    return axios.put(`/api/get-all-rolegroup`, groupId);
}

export {

    fetchAllGroup,
    fetchAllRole,
    editGroupService,
    editRoleService,
    newGroupService,
    deleteGroupService,
    deleteRoleService,
    newRoleService,
    checkGroupRole,
    getAllGroupRole,
    newRoleGroupService,
    deleteRoleGroupService
}