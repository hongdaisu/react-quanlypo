import axios from "./axios";

const handleLoginApi = (username, password) => {
    return axios.post('/api/login', { account: username, password: password });
}

// Đăng nhập bằng token
const handleLoginTokenApi = (token) => {
    //console.log('token', token)
    return axios.post('/api/login-token', { token: token });
}

const fetchLogOutApi = () => {
    return axios.post('/api/logout');
}

const fetchAllUsers = () => {
    // return axios.get(`/api/get-all-users?id`);
    return axios.get(`/api/get-all-users`);
}

const editUserService = (formData) => {
    console.log('check data from service:', formData)
    return axios.put('/api/edit-user', formData);
}

const handleGetAction = (button) => {
    // console.log('check button:', button)
    return axios.post('/api/get-action', { actionButton: button });
}
const fetchAllGroup = () => {
    return axios.get(`/api/get-all-group`);
}

const newUserService = (data) => {

    return axios.post('/api/create-new-user', data);
}

const fetchAllNhanVien = () => {
    return axios.get(`/api/get-all-nhanvien`);
}

const checkXoaUser = (id) => {
    return axios.get(`/api/check-xoa-user/${id}`);
}

const deleteUser = (idUser) => {
    // console.log('check idUser:', idUser)
    return axios.delete('/api/delete-user', { data: { id: idUser } });
}

export {
    fetchAllUsers,
    handleLoginApi,
    editUserService,
    handleGetAction,
    fetchAllGroup,
    newUserService,
    fetchAllNhanVien,
    checkXoaUser,
    deleteUser,
    fetchLogOutApi,
    handleLoginTokenApi
}