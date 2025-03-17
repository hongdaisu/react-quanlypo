import axios from './axios';

const fetchAllPO = () => {
    return axios.get(`/api/get-all-po`);
}

const fetchAllTaiSan = () => {
    return axios.get(`/api/get-all-taisan`);
}

const checkDataChuaXacnhan = (KhoTaiSan_Id, KhoQuanLy) => {
    //console.log('xacnhanThemTaiSan', KhoTaiSan_Id, data)
    return axios.post('/api/checkdata-chuaxacnhan', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        KhoQuanLy: KhoQuanLy
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

const xacnhanThemTaiSan = (KhoTaiSan_Id, tenTaiSan, nhapTenTaiSan, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai) => {
    //console.log('xacnhanThemTaiSan', KhoTaiSan_Id, data)
    return axios.post('/api/xacnhan-themtaisan', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        tenTaiSan: tenTaiSan,
        nhapTenTaiSan: nhapTenTaiSan,
        KhoQuanLy: KhoQuanLy,
        UserId: UserId,
        KhoaPhongHienTai: KhoaPhongHienTai,
        DotKiemKe_Id: DotKiemKe_Id
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

const fetchAllTenTaiSan = (searchTerm, offset = 0) => {
    //console.log('searchTerm', searchTerm)
    // return axios.get(`/api/get-all-select-donvihanhchinh`);
    return axios.get('/api/get-all-tentaisan', {
        params: {
            search: searchTerm,
            offset: offset
        }
    });
}


const fetchAllTaiSanTheoKhoQL = (KhoSuDung, KhoQuanLy, DotKiemKe_Id) => {
    //console.log('KhoQuanLy', KhoSuDung, KhoQuanLy)
    return axios.post('/api/get-taisantheokhoql', {
        KhoSuDung: KhoSuDung,
        KhoQuanLy: KhoQuanLy,
        DotKiemKe_Id: DotKiemKe_Id
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getMaTaiSanKiemKe = (MaTaiSan, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai) => {
    //console.log('KhoaPhongHienTai', KhoaPhongHienTai)
    return axios.post('/api/get-mataisan-kiemke', {
        MaTaiSan: MaTaiSan,
        KhoTaiSan_Id: KhoTaiSan_Id,
        KhoQuanLy: KhoQuanLy,
        UserId: UserId,
        DotKiemKe_Id: DotKiemKe_Id,
        KhoaPhongHienTai: KhoaPhongHienTai
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getSerialKiemKe = (Serial, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai) => {
    return axios.post('/api/get-serial-kiemke', {
        Serial: Serial,
        KhoTaiSan_Id: KhoTaiSan_Id,
        KhoQuanLy: KhoQuanLy,
        UserId: UserId,
        DotKiemKe_Id: DotKiemKe_Id,
        KhoaPhongHienTai: KhoaPhongHienTai
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllTaiSanTheoKho = (KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id) => {
    //console.log('fetchAllTaiSanTheoKho', DotKiemKe_Id)
    return axios.post('/api/get-taisantheokho', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        KhoQuanLy: KhoQuanLy,
        UserId: UserId,
        DotKiemKe_Id: DotKiemKe_Id
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllTaiSanTheoKhoLichSu = (KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id) => {
    return axios.post('/api/get-taisantheokho-lichsu', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        KhoQuanLy: KhoQuanLy,
        UserId: UserId,
        DotKiemKe_Id: DotKiemKe_Id
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllTaiSanXacNhanTheoKhoLichSu = (KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id) => {
    return axios.post('/api/get-taisanxacnhantheokho-lichsu', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        KhoQuanLy: KhoQuanLy,
        UserId: UserId,
        DotKiemKe_Id: DotKiemKe_Id
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllTaiSanXacNhanAllKhoLichSu = (KhoTaiSan_Id, UserId, DotKiemKe_Id) => {
    return axios.post('/api/get-taisanxacnhanallkho-lichsu', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        UserId: UserId,
        DotKiemKe_Id: DotKiemKe_Id
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllTaiSanXacNhanToanVienKhoLichSu = (TimKiemKhoQuanLy, UserId) => {
    return axios.post('/api/get-taisanxacnhantoanvien-kho-lichsu', {
        TimKiemKhoQuanLy: TimKiemKhoQuanLy,
        UserId: UserId,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllLichSuKiemKe = (KhoTaiSan_Id, UserId) => {
    return axios.post('/api/get-lichsukiemke', {
        KhoTaiSan_Id: KhoTaiSan_Id,
        UserId: UserId
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllDVT = () => {
    return axios.get(`/api/get-all-dvt`);
}

const fetchAllNguoiLap = () => {
    return axios.get(`/api/get-all-nguoilap`);
}
const fetchKeToanTaiSan = () => {
    return axios.get(`/api/get-all-ketoantaisan`);
}
const fetchKeToanTruong = () => {
    return axios.get(`/api/get-all-ketoantruong`);
}
const fetchGiamDoc = () => {
    return axios.get(`/api/get-all-giamdoc`);
}

const fetchAllNhanVien = () => {
    return axios.get(`/api/get-all-nhanvien`);
}

const fetchAllNhanVienPhong = () => {
    return axios.get(`/api/get-all-nhanvien-phong`);
}

const fetchAllBV = () => {
    return axios.get(`/api/get-all-bv`);
}

const fetchAllKho = () => {
    return axios.get(`/api/get-all-kho`);
}

const fetchLanKiemKe = () => {
    return axios.get(`/api/get-lankiemke`);
}

const fetchAllKhoQLTK = () => {
    return axios.get(`/api/get-all-kho-qltk`);
}

const fetchAllKhoEdit = () => {
    return axios.get(`/api/get-all-kho-edit`);
}

const fetchAllTinhTrang = () => {
    return axios.get(`/api/get-all-tinhtrang`);
}


const fetchAllViTri = () => {
    return axios.get(`/api/get-all-vitri`);
}

const fetchAllNguoiSuDung = () => {
    return axios.get(`/api/get-all-nguoisudung`);
}

const fetchAllKhoQL = () => {
    return axios.post(`/api/get-all-khoql`);
}

// const fetchAllKhoQL = KhoTaiSan_Id => {
//     //return axios.post(`/api/get-all-khoql`);
//     return axios.post('/api/get-all-khoql', {
//         KhoTaiSan_Id: KhoTaiSan_Id
//     }, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
// }

const fetchAllPL = () => {
    return axios.get(`/api/get-all-pl`);
}

const fetchAllTGBH = () => {
    return axios.get(`/api/get-all-tgbh`);
}

const fetchAllTGKH = () => {
    return axios.get(`/api/get-all-tgkh`);
}

const fetchAllCT = () => {
    return axios.get(`/api/get-all-ct`);
}

const fetchCheckAllCT = () => {
    return axios.post(`/api/get-check-all-ct`);
}

const newTaiSanService = (data) => {

    return axios.post('/api/create-new-ts', data);
}

const editTaiSanService = (data) => {
    //console.log('check data from service:', data)
    return axios.put('/api/edit-taisan', data);
}

const checkXoaTaiSan = (Duoc_Id) => {
    return axios.get(`/api/check-xoa-ts/${Duoc_Id}`);
}


const checkHopDong = (nhacungcap_id) => {
    return axios.post('/api/get-check-hd', {
        nhacungcap_id: nhacungcap_id,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllLogCheck = (machungtu) => {
    return axios.post('/api/get-check-all', {
        machungtu: machungtu,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const checkPO = (sopo) => {
    return axios.post('/api/get-check-po', {
        sopo: sopo,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};


const checkEditMaTaiSanPO = (sopo, mataisan) => {
    return axios.post('/api/get-check-editmataisanpo', {
        sopo: sopo,
        mataisan: mataisan
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const checkEditSoLuongPO = (sopo, mataisan) => {
    return axios.post('/api/get-check-editsoluongpo', {
        sopo: sopo,
        mataisan: mataisan
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const checkEditMaTaiSanPR = (sopr, mataisan) => {
    return axios.post('/api/get-check-editmataisanpr', {
        sopr: sopr,
        mataisan: mataisan
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};


const checkPR = (sopr) => {
    return axios.post('/api/get-check-pr', {
        sopr: sopr,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllLogChungTuHopDong = (nhacungcap_id) => {
    return axios.post('/api/get-all-log-chungtu-hd', {
        nhacungcap_id: nhacungcap_id,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};


const fetchCheckAllLogChungTuHopDong = (nhacungcap_id) => {
    return axios.post('/api/get-check-all-log-chungtu-hd', {
        nhacungcap_id: nhacungcap_id,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllLogChungTuPO = (sopo) => {
    return axios.post('/api/get-all-log-chungtu-po', {
        sopo: sopo,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchCheckAllLogChungTuPO = (sopo) => {
    return axios.post('/api/get-check-all-log-chungtu-po', {
        sopo: sopo,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllLogPOPR = (sopr) => {
    return axios.post('/api/get-all-log-po-pr', {
        sopr: sopr,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchLogPOPR = (sopr) => {
    return axios.post('/api/get-all-log-popr', {
        sopr: sopr,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchAllPR = () => {
    return axios.get(`/api/get-all-pr`);
}

const fetchAllHD = () => {
    return axios.get(`/api/get-all-hd`);
}

const importDataPO = (data) => {
    return axios.post('/api/import-po', data);
}

const importDataPR = (data) => {
    return axios.post('/api/import-pr', data);
}

const importDataHD = (data) => {
    return axios.post('/api/import-hd', data);
}

const getChungTu = (machungtu, UserId) => {
    return axios.post('/api/get-chungtu', {
        machungtu: machungtu,
        UserId: UserId
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getCheckChungTu = (machungtu, UserId) => {
    return axios.post('/api/get-checkchungtu', {
        machungtu: machungtu,
        UserId: UserId
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getCapNhapSoPONhapNCC = (machungtu, UserId) => {
    return axios.post('/api/get-capnhapsopo-nhapncc', {
        machungtu: machungtu,
        UserId: UserId
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getMaChungTu = (machungtu, UserId) => {
    return axios.post('/api/get-machungtu', {
        machungtu: machungtu,
        UserId: UserId
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const checkChungTuHopDong = (machungtu) => {
    return axios.post('/api/check-machungtu-hopdong', {
        machungtu: machungtu
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const checkXoaChungTu = (machungtu) => {
    return axios.post('/api/check-xoa-chungtu', {
        machungtu: machungtu
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const checkXoaCheckChungTu = (machungtu) => {
    return axios.post('/api/check-xoa-check-chungtu', {
        machungtu: machungtu
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const checkChungTuPO = (machungtu) => {
    return axios.post('/api/check-machungtu-po', {
        machungtu: machungtu
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const checkPOPR = (sopo) => {
    return axios.post('/api/check-po-pr', {
        sopo: sopo
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};


const getSoPO = (soPO, UserId) => {
    return axios.post('/api/get-sopo', {
        soPO: soPO,
        UserId: UserId
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchOnePO = (machungtu) => {
    return axios.post('/api/get-one-po', {
        machungtu: machungtu
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchOneCT = (machungtu) => {
    return axios.post('/api/get-one-ct', {
        machungtu: machungtu
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchCheckOneCT = (machungtu) => {
    return axios.post('/api/get-check-one-ct', {
        machungtu: machungtu
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchOneHD = (machungtu) => {
    return axios.post('/api/get-one-hd', {
        machungtu: machungtu
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const fetchOnePR = (sopo) => {
    //console.log('soPO', sopo)
    return axios.post('/api/get-one-pr', {
        sopo: sopo
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const editMaTaiSan = (data) => {
    //console.log('editMaTaiSan', data)
    return axios.post('/api/edit-mataisan', data);
}

const editKhoaPhongHienTai = (data) => {
    return axios.post('/api/edit-khoaphonghientai', data);
}

const editMaTaiSanNew = (data) => {
    //console.log('editMaTaiSan', data)
    return axios.post('/api/edit-mataisannew', data);
}

// Hàm tải file
const downloadFile = (filename) => {
    return axios.get(`/api/download-file/${filename}`, {
        responseType: 'blob', // Quan trọng để nhận dữ liệu dưới dạng blob
    });
};

// Hàm tải file
const downloadFilePO = (filename) => {
    return axios.get(`/api/download-po/${filename}`, {
        responseType: 'blob', // Quan trọng để nhận dữ liệu dưới dạng blob
    });
};

const downloadFilePR = (filename) => {
    return axios.get(`/api/download-pr/${filename}`, {
        responseType: 'blob', // Quan trọng để nhận dữ liệu dưới dạng blob
    });
};

const downloadFileHD = (filename) => {
    return axios.get(`/api/download-hd/${filename}`, {
        responseType: 'blob', // Quan trọng để nhận dữ liệu dưới dạng blob
    });
};

const timkiemDataKiemKe = (data) => {
    // console.log('data', data)
    return axios.post(`/api/timkiem-data-kiemke`, data);
}


const fetchCheckDongBo = (LanKiemKe, NamKiemKe) => {
    return axios.post('/api/check-dongbo', {
        LanKiemKe: LanKiemKe,
        NamKiemKe: NamKiemKe
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};


export {

    importDataPO,
    fetchAllPO,
    getChungTu,
    editMaTaiSan,
    fetchOnePO,
    downloadFile,
    fetchAllPR,
    importDataPR,
    getSoPO,
    fetchOnePR,
    importDataHD,
    fetchAllHD,
    fetchOneHD,
    getMaChungTu,
    fetchAllLogChungTuHopDong,
    checkHopDong,
    fetchAllLogChungTuPO,
    checkPO,
    fetchAllLogPOPR,
    checkPR,
    checkChungTuHopDong,
    checkChungTuPO,
    checkPOPR,
    fetchAllCT,
    fetchOneCT,
    checkXoaChungTu,
    editMaTaiSanNew,
    downloadFilePO,
    downloadFilePR,
    downloadFileHD,
    checkEditMaTaiSanPO,
    checkEditMaTaiSanPR,
    getCapNhapSoPONhapNCC,
    checkEditSoLuongPO,
    fetchCheckAllCT,
    fetchCheckOneCT,
    getCheckChungTu,
    fetchCheckAllLogChungTuPO,
    fetchCheckAllLogChungTuHopDong,
    checkXoaCheckChungTu,
    fetchAllLogCheck,
    fetchLogPOPR,
    fetchAllTaiSan,
    fetchAllDVT,
    fetchAllBV,
    fetchAllPL,
    fetchAllTGBH,
    fetchAllTGKH,
    editTaiSanService,
    newTaiSanService,
    checkXoaTaiSan,
    fetchAllKho,
    fetchAllTaiSanTheoKho,
    fetchAllTaiSanTheoKhoLichSu,
    fetchAllKhoQL,
    fetchAllTaiSanTheoKhoQL,
    getMaTaiSanKiemKe,
    editKhoaPhongHienTai,
    fetchAllViTri,
    fetchAllTinhTrang,
    fetchAllKhoEdit,
    timkiemDataKiemKe,
    getSerialKiemKe,
    fetchAllNhanVien,
    fetchAllNhanVienPhong,
    fetchAllKhoQLTK,
    fetchAllTenTaiSan,
    xacnhanThemTaiSan,
    fetchAllNguoiLap,
    fetchKeToanTaiSan,
    fetchKeToanTruong,
    fetchGiamDoc,
    fetchAllLichSuKiemKe,
    checkDataChuaXacnhan,
    fetchAllTaiSanXacNhanTheoKhoLichSu,
    fetchAllTaiSanXacNhanAllKhoLichSu,
    fetchAllTaiSanXacNhanToanVienKhoLichSu,
    fetchAllNguoiSuDung,
    fetchCheckDongBo,
    fetchLanKiemKe
}