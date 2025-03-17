import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { deleteGroupService } from '../../services/grouproleService'
// import { deleteYeuCau } from '../../services/taoyeucauServices'
// import { deleteCongVanDi } from '../../services/taoyeucauServices'
// import { xacnhanCongVanDi } from '../../services/taoyeucauServices'
// import { huyxacnhanCongVanDi } from '../../services/taoyeucauServices'
import { deleteRoleService } from '../../services/grouproleService'
import { deleteUser } from '../../services/userServices'
import { deletePhongBan } from '../../services/phongbanServices'
import { fetchAllTenTaiSan, xacnhanThemTaiSan } from '../../services/importService'
import {
    deleteMenuCha, deleteMenuCon, deleteHopDong, deletePO, deletePR, deleteChungTu,
    deleteLogChungTuHD, deleteLogChungTuPO, deleteCheckLogChungTuPO, deleteLogPOPR, deleteCheckLogChungTuHD,
    deleteCheckChungTu, deleteTaiSan, xacnhanKiemKe, huyxacnhanKiemKe, xoaDataKiemKe, huyKiemKe
} from '../../services/menuService'
import { deleteNhanVien } from '../../services/nhanvienServices'
import { toast } from 'react-toastify';
import Select from 'react-select';
import Cookies from 'js-cookie';

const ModalXacNhanXoa = (props) => {
    const { show, socket, handleClose, setShowOverlay, handleCloseModalThanhToan, handleButtonNo,
        dataXacNhanXoa, getAllGroup, getAllPhongBan, getAllNhanVien, getAllRole, onGridReady, onGridReadyMenuCon,
        getAllUsers, UserId, handleCloseXoaChungTuHopDong, handleCloseXoaChungTuPO, handleCloseCheckXoaChungTuPO
        , handleCloseXoaPOPR, handleCloseXoaChungTu, handleCloseCheckXoaChungTuHopDong, handleCloseCheckXoaChungTu
        , handleCloseXoaTS, handleCloseXacNhanKiemKe, handleCloseHuyXacNhanKiemKe, handleCloseXacNhanXoaKiemKe, handleCloseThemTaiSan
        , handleCloseXacNhanHuyKiemKe, handleSelectChangeKho, handleSelectChangeKhoTimKiem, handleSelectChangeKhoQLTK, getLanKiemKe

    } = props;
    //console.log('dataXacNhanXoa', dataXacNhanXoa.data)

    const [receiptData, setReceiptData] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);

    const [selectedOptionTenTaiSan, setSelectedOptionTenTaiSan] = useState(null);
    const [optionsTenTaiSan, setOptionsTenTaiSan] = useState([]);
    const [tenTaiSan, setTenTaiSan] = useState('');
    const [nhapTenTaiSan, setNhapTenTaiSan] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Biến để lưu từ khóa tìm kiếm
    const [offset, setOffset] = useState(0); // Vị trí bắt đầu lấy dữ liệu (phân trang)
    const [hasMore, setHasMore] = useState(true); // Để kiểm tra có còn dữ liệu để tải thêm hay không
    const [loading, setLoading] = useState(false); // Trạng thái loading dữ liệu

    const [isLoading, setIsLoading] = useState(false);
    const handleXacNhanXoaGroup = async () => {
        try {
            let res = await deleteGroupService(dataXacNhanXoa.id);
            if (res && res.errCode === 0) {
                getAllGroup();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }

    }

    const handleSelectChangeTenTaiSan = (selectedOptionTenTaiSan) => {
        setSelectedOptionTenTaiSan(selectedOptionTenTaiSan);
        setTenTaiSan(selectedOptionTenTaiSan ? selectedOptionTenTaiSan.label : '');
    };

    // Hàm gọi API để lấy dữ liệu
    const fetchOptions = async (searchTerm, offset) => {
        setLoading(true);
        try {
            const response = await fetchAllTenTaiSan({ searchTerm, offset });
            if (response && response.errCode === 0) {
                const newOptions = response.data.map(item => ({
                    value: item.TenHang,
                    label: item.TenHang,
                }));
                // Nếu tìm kiếm từ đầu, thay thế dữ liệu, ngược lại nối thêm
                if (offset === 0) {
                    setOptionsTenTaiSan(newOptions);
                } else {
                    setOptionsTenTaiSan(prevOptions => [...prevOptions, ...newOptions]);
                }
                // Kiểm tra nếu số lượng kết quả trả về ít hơn limit thì không còn dữ liệu để tải thêm
                if (newOptions.length < 100) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = async (search) => {
        try {
            setSearchTerm(search);
            setOffset(0);
            setHasMore(true);
            await fetchOptions(search, 0);
        } catch (error) {
            console.error('Error in handleSearchChange:', error);
        }
    };


    const handleCloseModal = () => {
        setIsLoading(false);
        handleClose();
    }

    const handleCloseModalXacNhan = () => {
        handleButtonNo();
        setShowOverlay(false);
    }

    const handleCloseModalHoanTat = () => {
        handleCloseModalThanhToan();
        setShowOverlay(false);
    }

    const handleCloseModalXoaChungTuHD = () => {
        handleCloseXoaChungTuHopDong();
    }

    const handleCloseCheckModalXoaChungTuHD = () => {
        handleCloseCheckXoaChungTuHopDong();
    }

    const handleCloseModalXoaPOPR = () => {
        handleCloseXoaPOPR();
    }

    const handleCloseModalXoaChungTuPO = () => {
        handleCloseXoaChungTuPO();
    }

    const handleCloseModalCheckXoaChungTuPO = () => {
        handleCloseCheckXoaChungTuPO();
    }

    const handleCloseModalXacNhanKiemKe = () => {
        handleCloseXacNhanKiemKe();
    }

    const handleCloseModalThemTaiSan = () => {
        handleCloseThemTaiSan();
    }


    const handleCloseModalHuyXacNhanKiemKe = () => {
        handleCloseHuyXacNhanKiemKe();
    }

    const handleCloseModalXacNhanXoaKiemKe = () => {
        handleCloseXacNhanXoaKiemKe();
    }

    const handleCloseModalXacNhanHuyKiemKe = () => {
        handleCloseXacNhanHuyKiemKe();
    }

    const handleCloseModalXoaChungTu = () => {
        handleCloseXoaChungTu();
    }

    const handleCloseModalXoaTS = () => {
        handleCloseXoaTS();
    }

    const handleCloseModalCheckXoaChungTu = () => {
        handleCloseCheckXoaChungTu();
    }

    const handleXacNhanXoaRole = async () => {
        try {
            let res = await deleteRoleService(dataXacNhanXoa.id);
            if (res && res.errCode === 0) {
                getAllRole();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }

    }


    const handleXoaUser = async () => {
        try {
            let res = await deleteUser(dataXacNhanXoa.User_Id);
            if (res && res.errCode === 0) {
                getAllUsers();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaPhongBan = async () => {
        try {
            let res = await deletePhongBan(dataXacNhanXoa.id);
            if (res && res.errCode === 0) {
                socket.emit('delete_phong_ban', { data: res });
                // getAllPhongBan();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaMenuCha = async () => {
        try {
            let res = await deleteMenuCha(dataXacNhanXoa.id);
            if (res && res.errCode === 0) {
                socket.emit('delete_menu_cha_server', { data: res });
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaMenuCon = async () => {
        try {
            let res = await deleteMenuCon(dataXacNhanXoa.id);
            if (res && res.errCode === 0) {
                socket.emit('delete_menu_con_server', { data: res });
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaHopDong = async () => {
        try {
            let res = await deleteHopDong(dataXacNhanXoa.nhacungcap_id);
            if (res && res.errCode === 0) {
                socket.emit('delete_hopdong_server', { data: res });
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaPO = async () => {
        try {
            let res = await deletePO(dataXacNhanXoa.sopo);
            if (res && res.errCode === 0) {
                socket.emit('delete_po_server', { data: res });
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaPR = async () => {
        try {
            let res = await deletePR(dataXacNhanXoa.sopr);
            if (res && res.errCode === 0) {
                socket.emit('delete_pr_server', { data: res });
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaLogChungTuHD = async () => {
        try {
            let res = await deleteLogChungTuHD(dataXacNhanXoa.machungtu, dataXacNhanXoa.sopo);
            if (res && res.errCode === 0) {
                socket.emit('delete_log_cthd_server', { data: res });
                handleCloseModalXoaChungTuHD();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaCheckLogChungTuHD = async () => {
        try {
            let res = await deleteCheckLogChungTuHD(dataXacNhanXoa.machungtu, dataXacNhanXoa.sopo);
            if (res && res.errCode === 0) {
                socket.emit('delete_check_log_cthd_server', { data: res });
                handleCloseCheckModalXoaChungTuHD();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaLogChungTuPO = async () => {
        try {
            let res = await deleteLogChungTuPO(dataXacNhanXoa.machungtu, dataXacNhanXoa.sopo);
            if (res && res.errCode === 0) {
                socket.emit('delete_log_ctpo_server', { data: res });
                handleCloseModalXoaChungTuPO();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaCheckLogChungTuPO = async () => {
        try {
            //console.log('handleXoaCheckLogChungTuPO', handleXoaCheckLogChungTuPO)
            let res = await deleteCheckLogChungTuPO(dataXacNhanXoa.machungtu, dataXacNhanXoa.sopo);
            if (res && res.errCode === 0) {
                socket.emit('delete_check_log_ctpo_server', { data: res });
                handleCloseModalCheckXoaChungTuPO();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaChungTu = async () => {
        try {
            let res = await deleteChungTu(dataXacNhanXoa.machungtu, dataXacNhanXoa.sopo);
            if (res && res.errCode === 0) {
                socket.emit('delete_ct_server', { data: res });
                handleCloseModalXoaChungTu();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaTS = async () => {
        try {
            let res = await deleteTaiSan(dataXacNhanXoa.Duoc_Id, dataXacNhanXoa.TenDuoc_Id);
            if (res && res.errCode === 0) {
                socket.emit('delete_taisan_server', { data: res });
                handleCloseModalXoaTS();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaCheckChungTu = async () => {
        try {
            let res = await deleteCheckChungTu(dataXacNhanXoa.machungtu, dataXacNhanXoa.sopo);
            if (res && res.errCode === 0) {
                socket.emit('delete_check_ct_server', { data: res });
                handleCloseModalCheckXoaChungTu();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXacNhanKK = async () => {
        try {
            let res = await xacnhanKiemKe(dataXacNhanXoa.KhoTaiSan_Id, dataXacNhanXoa.KhoQuanLy, dataXacNhanXoa.data, dataXacNhanXoa.DotKiemKe_Id);
            if (res && res.errCode === 0) {
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                socket.emit('xacnhan_kiemke_server', { DotKiemKe_Id: DotKiemKe_Id });

                handleCloseModalXacNhanKiemKe();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXacThemTaiSan = async () => {
        try {
            const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');
            const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
            const KhoaPhongHienTai = dataXacNhanXoa.data[0]?.KhoaPhongHienTai;
            let res = await xacnhanThemTaiSan(dataXacNhanXoa.KhoTaiSan_Id, tenTaiSan, nhapTenTaiSan, KhoQuanLy, dataXacNhanXoa.UserId, DotKiemKe_Id, KhoaPhongHienTai);
            if (res && res.errCode === 0) {
                socket.emit('xacnhan_themtaisan_server', { DotKiemKe_Id: DotKiemKe_Id });
                handleCloseModalThemTaiSan();
                handleClose();
                setTenTaiSan('')
                setNhapTenTaiSan('')
                setSelectedOptionTenTaiSan(null)
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleHuyXacNhanKK = async () => {
        try {
            const TimKiemKhoQuanLy = sessionStorage.getItem('TimKiemKhoQuanLy');
            if (TimKiemKhoQuanLy === 'TẤT CẢ KHO') {
                toast.warning('Vui lòng chọn 1 kho quản lý để hủy')
            } else {
                let res = await huyxacnhanKiemKe(dataXacNhanXoa.KhoTaiSan_Id, dataXacNhanXoa.KhoQuanLy, dataXacNhanXoa.data);
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (res && res.errCode === 0) {
                    socket.emit('huyxacnhan_kiemke_server', { DotKiemKe_Id: DotKiemKe_Id });

                    handleCloseModalHuyXacNhanKiemKe();
                    handleClose();
                    toast.success(res.errMessage)
                } else {
                    toast.warning(res.errMessage)
                }
            }

        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaXacNhanKK = async () => {
        try {
            let res = await xoaDataKiemKe(dataXacNhanXoa.KhoTaiSan_Id, dataXacNhanXoa.data);
            const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
            //console.log('res',DotKiemKe_Id)
            if (res && res.errCode === 0) {
                socket.emit('xoa_data_kiemke_server', { DotKiemKe_Id: DotKiemKe_Id });
                // sessionStorage.removeItem('KhoTaiSan_Id');
                // sessionStorage.removeItem('KhoQuanLy');
                // sessionStorage.removeItem('DotKiemKe_Id');
                // onGridReady(null, dataXacNhanXoa.UserId);
                getLanKiemKe();
                handleCloseModalXacNhanXoaKiemKe();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleHuyKK = async () => {
        try {
            let res = await huyKiemKe(dataXacNhanXoa.IdKiemKe);
            const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
            if (res && res.errCode === 0) {
                socket.emit('huy_kiemke_server', { DotKiemKe_Id: DotKiemKe_Id });

                handleCloseModalXacNhanHuyKiemKe();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaLogPOPR = async () => {
        try {
            let res = await deleteLogPOPR(dataXacNhanXoa.sopo);
            if (res && res.errCode === 0) {
                socket.emit('delete_log_popr_server', { data: res });
                handleCloseModalXoaPOPR();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleXoaNhanVien = async () => {
        try {
            // let res = await deleteNhanVien(dataXacNhanXoa.id);
            // if (res && res.errCode === 0) {
            //     socket.emit('delete_nhanvien', { data: res });
            //     // getAllNhanVien();
            //     handleClose();
            //     toast.success(res.errMessage)
            // } else {
            //     toast.warning(res.errMessage)
            // }
        } catch (e) {
            console.log(e);
        }
    }


    useEffect(() => {
        if (socket) {
            socket.on('phong_ban_delete', (data) => {
                getAllPhongBan();
            });
            socket.on('nhanvien_delete', (data) => {
                getAllNhanVien();
            });

            socket.on('thanhtoanbienlai_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_benhnhan_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('huy_benhnhan_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_menu_cha_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_hopdong_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_po_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_pr_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });
            socket.on('delete_taisan_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_log_cthd_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_check_log_cthd_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_log_ctpo_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });
            socket.on('delete_check_log_ctpo_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('xacnhan_kiemke_client', (data) => {
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (data.DotKiemKe_Id === DotKiemKe_Id) {
                    if (typeof onGridReady === 'function') {
                        setTimeout(() => {
                            onGridReady(null, null, dataXacNhanXoa.UserId, null);
                            //onGridReady();
                        }, 500);
                        handleSelectChangeKho(null);
                        sessionStorage.removeItem('KhoTaiSan_Id');
                        sessionStorage.removeItem('KhoQuanLy');
                        sessionStorage.removeItem('MaTaiSan');
                        sessionStorage.removeItem('DotKiemKe_Id');
                    } else {
                        console.warn('onGridReady is not a function');
                    }
                }
            });

            socket.on('xacnhan_themtaisan_client', (data) => {
                const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
                const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (data.DotKiemKe_Id === DotKiemKe_Id) {
                    if (typeof onGridReady === 'function') {
                        setTimeout(() => {
                            onGridReady(KhoTaiSan_Id, KhoQuanLy, dataXacNhanXoa.UserId, DotKiemKe_Id);
                            //onGridReady();
                        }, 500);
                    } else {
                        console.warn('onGridReady is not a function');
                    }
                }
            });

            socket.on('huy_kiemke_client', (data) => {
                const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
                const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (data.DotKiemKe_Id === DotKiemKe_Id) {
                    sessionStorage.removeItem('MaTaiSan');
                    if (typeof onGridReady === 'function') {
                        setTimeout(() => {
                            onGridReady(KhoTaiSan_Id, KhoQuanLy, dataXacNhanXoa.UserId, DotKiemKe_Id);
                        }, 500);
                    } else {
                        console.warn('onGridReady is not a function');
                    }
                }
            });

            socket.on('huyxacnhan_kiemke_client', (data) => {
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (data.DotKiemKe_Id === DotKiemKe_Id) {
                    if (typeof onGridReady === 'function') {
                        sessionStorage.removeItem('KhoTaiSan_Id');
                        sessionStorage.removeItem('TimKiemKhoTaiSan_Id');
                        sessionStorage.removeItem('TimKiemKhoQuanLy');
                        setTimeout(() => {
                            onGridReady(null, null, dataXacNhanXoa.UserId);
                        }, 500);
                        handleSelectChangeKhoQLTK(null)
                        handleSelectChangeKhoTimKiem(null)
                    } else {
                        console.warn('onGridReady is not a function');
                    }
                }
            });

            socket.on('xoa_data_kiemke_client', (data) => {
                //console.log('Socket event received', data);
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (typeof onGridReady === 'function') {
                    if (data.DotKiemKe_Id === DotKiemKe_Id) {
                        setTimeout(() => {
                            onGridReady(null, dataXacNhanXoa.UserId);
                        }, 500);
                        handleSelectChangeKho(null);
                        sessionStorage.removeItem('KhoTaiSan_Id');
                        sessionStorage.removeItem('DotKiemKe_Id');
                        sessionStorage.removeItem('KhoQuanLy');
                    }
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_log_popr_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_ct_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_check_ct_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });

            socket.on('delete_menu_con_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReadyMenuCon === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReadyMenuCon();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });
        }
        return () => {
            if (socket) {
                socket.off('phong_ban_delete');
                socket.off('nhanvien_delete');
                socket.off('thanhtoanbienlai_client');
                socket.off('delete_benhnhan_client');
                socket.off('delete_hopdong_client');
                socket.off('delete_po_client');
                socket.off('delete_pr_client');
                socket.off('delete_log_cthd_client');
                socket.off('delete_log_ctpo_client');
                socket.off('delete_log_ctpo_client');
                socket.off('delete_check_log_ctpo_client');
                socket.off('delete_check_log_cthd_client');
                socket.off('delete_taisan_client');
                socket.off('xoa_data_kiemke_client');

                socket.off('xacnhan_kiemke_client');
                socket.off('huyxacnhan_kiemke_client');
                socket.off('xacnhan_themtaisan_client');
                socket.off('huy_kiemke_client');

            }
        };
    }, [socket, getAllPhongBan, onGridReady]);

    useEffect(() => {
        // Ban đầu tải 100 dòng dữ liệu
        //console.log('offset', offset)
        fetchOptions(searchTerm, offset);
    }, [offset]); // Chỉ chạy 1 lần khi component mount

    useEffect(() => {
        if (show) {
            // const fetchTenTaiSan = async () => {
            //     await getAllTenTaiSan();
            // };
            // fetchTenTaiSan();
        } else {
            //setShowOverlay(false);
        }
    }, [show, setShowOverlay]);

    useEffect(() => {
        if (show && dataXacNhanXoa.Nhom === 'group') {
            getAllGroup();

        } else if (show && dataXacNhanXoa.Nhom === 'role') {
            getAllRole();
        }
    }, [dataXacNhanXoa])
    // console.log('dataXacNhanXoa', dataXacNhanXoa)
    return (
        <Modal show={show}
            className={'modal-xoa-container'}
            size='modal-fullscreen-sm-down'
        >
            {/* <ModalHeader>Thêm Group</ModalHeader> */}
            <ModalBody className='modal-body-xoa'>
                {dataXacNhanXoa.Nhom === 'group' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xác nhận xóa Group</h3>
                        <p>Bạn có muốn xóa Group đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXacNhanXoaGroup()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'role' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xác nhận xóa Role</h3>
                        <p>Bạn có muốn xóa Role đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXacNhanXoaRole()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'user' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa user</h3>
                        <p>Bạn có muốn xóa tài khoản đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaUser()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'phongban' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa phòng ban</h3>
                        <p>Bạn có muốn xóa phòng ban đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaPhongBan()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'nhanvien' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa nhân viên</h3>
                        <p>Bạn có muốn xóa nhân viên đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaNhanVien()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoamenucha' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa menu cha</h3>
                        <p>Bạn có muốn xóa menu đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaMenuCha()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoamenucon' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa menu con</h3>
                        <p>Bạn có muốn xóa menu đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaMenuCon()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoahopdong' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa hợp đồng</h3>
                        <p>Bạn có muốn xóa hợp đồng đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaHopDong()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoapo' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa PO</h3>
                        <p>Bạn có muốn xóa PO đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaPO()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoapr' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa PR</h3>
                        <p>Bạn có muốn xóa PR đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaPR()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModal} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoacthd' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa Chứng Từ</h3>
                        <p>Bạn có muốn xóa chứng từ <i style={{ color: 'blue' }}>{dataXacNhanXoa.machungtu}</i> đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaLogChungTuHD()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalXoaChungTuHD} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoacheckcthd' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa Chứng Từ</h3>
                        <p>Bạn có muốn xóa chứng từ <i style={{ color: 'blue' }}>{dataXacNhanXoa.machungtu}</i> đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaCheckLogChungTuHD()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseCheckModalXoaChungTuHD} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoactpo' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa Chứng Từ</h3>
                        <p>Bạn có muốn xóa chứng từ <i style={{ color: 'blue' }}>{dataXacNhanXoa.machungtu}</i> đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaLogChungTuPO()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalXoaChungTuPO} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoacheckctpo' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa Chứng Từ</h3>
                        <p>Bạn có muốn xóa chứng từ <i style={{ color: 'blue' }}>{dataXacNhanXoa.machungtu}</i> đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaCheckLogChungTuPO()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalCheckXoaChungTuPO} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoact' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa Chứng Từ</h3>
                        <p>Bạn có muốn xóa chứng từ <i style={{ color: 'blue' }}>{dataXacNhanXoa.machungtu}</i> đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaChungTu()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalXoaChungTu} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoats' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa Tài Sản</h3>
                        <p>Bạn có muốn xóa tài sản <i style={{ color: 'blue' }}>{dataXacNhanXoa.MaTaiSan}</i> đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaTS()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalXoaTS} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoacheckct' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa Chứng Từ</h3>
                        <p>Bạn có muốn xóa chứng từ <i style={{ color: 'blue' }}>{dataXacNhanXoa.machungtu}</i> đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaCheckChungTu()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalCheckXoaChungTu} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xacnhankiemke' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xác nhận kiểm kê</h3>
                        <p>Kiêm kê Khoa/Phòng <i style={{ color: 'blue' }}>{dataXacNhanXoa?.data?.[0]?.KhoaPhongSuDung}.Tổng {dataXacNhanXoa?.data?.[0]?.TongSo} tài sản - đã kiểm {dataXacNhanXoa?.data?.[0]?.DaKiem} còn lại {dataXacNhanXoa?.data?.[0]?.ConLai}</i> Bạn có muốn xác nhận kiểm kê ?</p>
                        <div>
                            <Button onClick={() => handleXacNhanKK()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalXacNhanKiemKe} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'themtaisan' &&
                    <div className="container-xacnhan-themtaisan">
                        <h5>Bổ sung tài sản</h5>
                        <div className='col-md-12 d-flex custom-font-label-kiemke'>
                            <label className='' style={{ fontWeight: 'bold' }}>Chọn tên tài sản:</label>
                            <Select
                                value={selectedOptionTenTaiSan}
                                onChange={handleSelectChangeTenTaiSan}
                                options={optionsTenTaiSan}
                                onInputChange={(inputValue) => {
                                    handleSearchChange(inputValue);
                                }}
                                menuPlacement="bottom"
                                placeholder="Chọn tài sản..."
                                isClearable={true} // Thêm thuộc tính này để cho phép xóa lựa chọn
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 120,
                                        marginTop: '-1px',
                                        marginLeft: '13px'
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                        minHeight: '33px',
                                        minWidth: '300px',
                                        height: '33px',
                                        with: '300px',
                                    }),
                                    clearIndicator: (provided) => ({
                                        ...provided,
                                        color: 'gray', // Màu sắc cho nút xóa
                                        cursor: 'pointer', // Đổi con trỏ khi hover
                                        '&:hover': {
                                            color: 'red', // Màu sắc khi hover
                                        },
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        fontFamily: 'Arial, sans-serif',
                                        fontSize: '11px',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        color: 'gray',          // Màu chữ placeholder
                                        fontStyle: 'italic',    // Kiểu chữ nghiêng
                                        fontSize: '11px',       // Kích thước chữ
                                        fontFamily: 'Arial, sans-serif',
                                    }),
                                }}
                            />
                        </div>
                        <div className='col-md-12 d-flex custom-font-label-kiemke' style={{ marginTop: '10px' }}>
                            <label className='' style={{ fontWeight: 'bold' }}>Nhập tên tài sản:</label>
                            <input type="text"
                                value={nhapTenTaiSan}
                                onChange={(e) => setNhapTenTaiSan(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                                style={{
                                    width: '400px', // Đặt width mặc định
                                    //resize: 'horizontal', // Cho phép kéo rộng theo chiều ngang
                                    //overflow: 'auto',
                                }}
                            />
                        </div>
                        <div style={{ marginTop: '30px', gap: '10px' }}>
                            <Button onClick={() => handleXacThemTaiSan()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalThemTaiSan} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'huyxacnhankiemke' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Hủy xác nhận kiểm kê</h3>
                        <p>Kiêm kê Khoa/Phòng <i style={{ color: 'blue' }}>{dataXacNhanXoa?.data?.[0]?.KhoaPhongSuDung}.Tổng {dataXacNhanXoa?.data?.[0]?.TongSo} tài sản - đã kiểm {dataXacNhanXoa?.data?.[0]?.DaKiem} còn lại {dataXacNhanXoa?.data?.[0]?.ConLai}</i> Bạn có muốn hủy xác nhận kiểm kê ?</p>
                        <div>
                            <Button onClick={() => handleHuyXacNhanKK()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalHuyXacNhanKiemKe} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoakiemke' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa dữ liệu kiểm kê</h3>
                        <p>Kiêm kê Khoa/Phòng <i style={{ color: 'blue' }}>{dataXacNhanXoa.data.KhoaPhongSuDung}.Tổng {dataXacNhanXoa.data.TongSo} tài sản - đã kiểm {dataXacNhanXoa.data.DaKiem} còn lại {dataXacNhanXoa.data.ConLai}</i> Bạn có muốn xóa dữ liệu ?</p>
                        <div>
                            <Button onClick={() => handleXoaXacNhanKK()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalXacNhanXoaKiemKe} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'huykiemke' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Hủy kiểm kê tài sản</h3>
                        <p>Bạn có muốn hủy kiểm kê tài sản có mã: <i style={{ color: 'blue' }}>{dataXacNhanXoa.MaTaiSan}.Tên tài sản: {dataXacNhanXoa.TenTaiSan}</i> hay không ?</p>
                        <div>
                            <Button onClick={() => handleHuyKK()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalXacNhanHuyKiemKe} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'inkiemke' &&
                    <div className="container-xacnhan-xoa">
                        {/* <h3>Xóa dữ liệu kiểm kê</h3>
                        <p>Kiêm kê Khoa/Phòng <i style={{ color: 'blue' }}>{dataXacNhanXoa.data.KhoaPhongSuDung}.Tổng {dataXacNhanXoa.data.TongSo} tài sản - đã kiểm {dataXacNhanXoa.data.DaKiem} còn lại {dataXacNhanXoa.data.ConLai}</i> Bạn có muốn xóa dữ liệu ?</p>
                        <div>
                            <Button onClick={() => handleXoaXacNhanKK()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalXacNhanXoaKiemKe} className='px-2 nobtn'>NO</Button>
                        </div> */}
                    </div>
                }
                {dataXacNhanXoa.Nhom === 'xoapopr' &&
                    <div className="container-xacnhan-xoa">
                        <h3>Xóa PO</h3>
                        <p>Bạn có muốn PO <i style={{ color: 'blue' }}>{dataXacNhanXoa.sopo}</i> đã chọn ?</p>
                        <div>
                            <Button onClick={() => handleXoaLogPOPR()} className='px-2 yesbtn'>YES</Button>
                            <Button onClick={handleCloseModalXoaPOPR} className='px-2 nobtn'>NO</Button>
                        </div>
                    </div>
                }
                {isLoading && (
                    <div className="overlay.modal">
                        <i className="fa fa-spinner fa-spin spinner" style={{ color: 'blue', position: 'absolute' }}></i>
                    </div>
                )}
            </ModalBody>
        </Modal>
    )
}

export default ModalXacNhanXoa;