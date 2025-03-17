import axios from "./axios";

const exportNhapNCC = (data) => {
    // console.log('data', data)
    return axios.post(`/api/exportnhapncc`, data);
}

const exportKiemKe = (data) => {
    // console.log('data', data)
    return axios.post(`/api/export-kiemketaisan`, data);
}

const exportDataPO = () => {
    // console.log('data', data)
    return axios.post(`/api/exportdatapo`,);
}

const exportDataPR = () => {
    // console.log('data', data)
    return axios.post(`/api/exportdatapr`,);
}

const exportDataHD = () => {
    // console.log('data', data)
    return axios.post(`/api/exportdatahd`,);
}

const exportBienLaiChiTiet = (data) => {
    // console.log('data', data)
    return axios.post(`/api/exportbienlaichitiet`, data);
}


const exportDoiChieuDongBo = (data) => {
    //console.log('data', data)
    return axios.post(`/api/export_doichieudongbo`, data);
}


export {
    exportNhapNCC,
    exportBienLaiChiTiet,
    exportDoiChieuDongBo,
    exportDataPO,
    exportDataPR,
    exportDataHD,
    exportKiemKe
}