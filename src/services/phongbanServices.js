import axios from "./axios";



const fetchAllPhongBan = () => {
    return axios.get(`/api/get-all-phongban`);
}

const fetchAllPhongBanHis = () => {
    return axios.get(`/api/get-all-phongban-his`);
}

const editPhongBanService = (data) => {
    // console.log('check data from service:', data)
    return axios.put('/api/edit-phongban', data);
}

const fetchPhongBanId = (phongban_id) => {

    return axios.put(`/api/get-all-phongban`, phongban_id);
}

const handleGetAction = (button) => {
    // console.log('check data from service:', button)
    return axios.post('/api/get-action', { actionButton: button });
}


const newPhongBanService = (data) => {

    return axios.post('/api/create-new-phongban', data);
}

const checkXoaPhongBan = (id) => {
    return axios.get(`/api/check-xoa-phongban/${id}`);
}

const deletePhongBan = (idPhongBan) => {
    return axios.delete('/api/delete-phongban', { data: { id: idPhongBan } });
}

export {
    fetchAllPhongBan,
    fetchPhongBanId,
    editPhongBanService,
    handleGetAction,
    fetchAllPhongBanHis,
    newPhongBanService,
    checkXoaPhongBan,
    deletePhongBan
}