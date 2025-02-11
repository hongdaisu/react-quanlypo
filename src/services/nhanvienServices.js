import axios from "./axios";

const newNhanVienService = (data) => {

    return axios.post('/api/create-new-nhanvien', data);
}

const fetchAllNhanVien = () => {
    return axios.get(`/api/get-all-dm-nhanvien`);
}

const fetchAllPhongBan = () => {
    return axios.get(`/api/get-phongban`);
}

const editNhanVienService = (data) => {
    // console.log('check data from service:', data)
    return axios.put('/api/edit-nhanvien', data);
}

const checkXoaNhanVien = (id) => {
    return axios.get(`/api/check-xoa-nhanvien/${id}`);
}

const deleteNhanVien = (idNhanVien) => {
    return axios.delete('/api/delete-nhanvien', { data: { id: idNhanVien } });
}

export {
    fetchAllNhanVien,
    newNhanVienService,
    fetchAllPhongBan,
    editNhanVienService,
    checkXoaNhanVien,
    deleteNhanVien
}