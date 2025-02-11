import axios from './axios';

const fetchAllMenuCon = () => {
    return axios.get(`/api/get-all-menu-con`);
}

const fetchAllMenuCha = () => {
    return axios.get(`/api/get-all-menu-cha`);
}

const newMenuChaService = (data) => {
    //console.log('data', data)
    return axios.post('/api/create-new-menucha', data);
}

const deleteMenuCha = (menu_id) => {
    return axios.delete('/api/delete-menucha', { data: { id: menu_id } });
}

const editMenuChaService = (data) => {
    return axios.put('/api/edit-menu-cha', data);
}

const newMenuConService = (data) => {
    // console.log('check data from service:', data)
    return axios.put('/api/create-new-menucon', data);
}

const getAllSelectMenuCha = () => {
    return axios.get(`/api/get-all-select-menu-cha`);
}

const fetchAllGroup = () => {
    return axios.get(`/api/get-all-group`);
}

const deleteMenuCon = (menu_id) => {
    return axios.delete('/api/delete-menucon', { data: { id: menu_id } });
}

const deleteHopDong = (nhacungcap_id) => {
    return axios.delete('/api/delete-hopdong', { data: { id: nhacungcap_id } });
}

const deletePO = (sopo) => {
    return axios.delete('/api/delete-po', { data: { sopo: sopo } });
}

const deletePR = (sopr) => {
    return axios.delete('/api/delete-pr', { data: { sopr: sopr } });
}

// const deleteLogChungTuHD = (machungtu) => {
//     return axios.post('/api/delete-log-cthd', { data: { machungtu: machungtu } });
// }

const deleteLogChungTuHD = (machungtu, sopo) => {
    return axios.post('/api/delete-log-cthd', {
        machungtu: machungtu,
        sopo: sopo
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const deleteCheckLogChungTuHD = (machungtu, sopo) => {
    return axios.post('/api/delete-check-log-cthd', {
        machungtu: machungtu,
        sopo: sopo
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const deleteLogChungTuPO = (machungtu, sopo) => {
    return axios.post('/api/delete-log-ctpo', {
        machungtu: machungtu,
        sopo: sopo
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const deleteCheckLogChungTuPO = (machungtu, sopo) => {
    //console.log('deleteCheckLogChungTuPO', machungtu)
    return axios.post('/api/delete-check-log-ctpo', {
        machungtu: machungtu,
        sopo: sopo
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const deleteChungTu = (machungtu, sopo) => {
    return axios.post('/api/delete-ct', {
        machungtu: machungtu,
        sopo: sopo
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const deleteTaiSan = (Duoc_Id, TenDuoc_Id) => {
    return axios.post('/api/delete-taisan', {
        Duoc_Id: Duoc_Id,
        TenDuoc_Id: TenDuoc_Id
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const xoaDataKiemKe = (KhoTaiSan_Id, data) => {
    //console.log('xoaDataKiemKe', data)
    return axios.post('/api/delete-data-kiemke', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        data: data
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const huyKiemKe = (IdKiemKe) => {
    return axios.post('/api/huy-kiemke', {
        IdKiemKe: IdKiemKe,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const deleteCheckChungTu = (machungtu, sopo) => {
    return axios.post('/api/delete-check-ct', {
        machungtu: machungtu,
        sopo: sopo
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const deleteLogPOPR = (sopo) => {
    return axios.post('/api/delete-log-popr', {
        sopo: sopo
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getDataNhomQuyen = (id) => {
    // console.log('getDataNhomQuyen', id)
    return axios.post('/api/get-all-nhomquyen', { data: { id: id } });
}

const getDataMenuCha = (id) => {
    // console.log('getDataNhomQuyen', id)
    return axios.post('/api/get-all-menucha', { data: { id: id } });
}

const editMenuConService = (data) => {
    return axios.put('/api/edit-menu-con', data);
}
const xacnhanKiemKe = (KhoTaiSan_Id, KhoQuanLy, data, DotKiemKe_Id) => {
    //return axios.post('/api/xacnhan-kiemke', data);
    return axios.post('/api/xacnhan-kiemke', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        KhoQuanLy: KhoQuanLy,
        data: data,
        DotKiemKe_Id: DotKiemKe_Id
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

const huyxacnhanKiemKe = (KhoTaiSan_Id, KhoQuanLy, data) => {
    //return axios.post('/api/xacnhan-kiemke', data);
    return axios.post('/api/huyxacnhan-kiemke', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        KhoQuanLy: KhoQuanLy,
        data: data
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export {

    fetchAllMenuCon,
    fetchAllMenuCha,
    newMenuChaService,
    deleteMenuCha,
    editMenuChaService,
    newMenuConService,
    getAllSelectMenuCha,
    fetchAllGroup,
    deleteMenuCon,
    getDataNhomQuyen,
    getDataMenuCha,
    editMenuConService,
    deleteHopDong,
    deletePO,
    deletePR,
    deleteLogChungTuHD,
    deleteLogChungTuPO,
    deleteLogPOPR,
    deleteChungTu,
    deleteCheckLogChungTuPO,
    deleteCheckLogChungTuHD,
    deleteCheckChungTu,
    deleteTaiSan,
    xacnhanKiemKe,
    huyxacnhanKiemKe,
    xoaDataKiemKe,
    huyKiemKe
}