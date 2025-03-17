// import { useState, useEffect } from 'react';
import React, { StrictMode, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import './Grid.css';
import './PdfView.scss';
import './PO.scss';
import {
    importDataPO, fetchAllCT, getChungTu, getCapNhapSoPONhapNCC, editMaTaiSan, fetchOneCT, checkXoaChungTu,
    fetchAllLogChungTuPO, fetchAllLogChungTuHopDong, checkPO, fetchAllLogPOPR
} from '../../services/importService'
import { toast } from 'react-toastify';
import io from "socket.io-client";
import { getUrl } from '../../services/urlServices';
import { Tooltip as ReactTooltip } from "react-tooltip";
import ClearableFloatingFilter from './CustomFloatingFilter';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import { handleGetAction } from '../../services/actionButtonServices';
import { set } from "lodash";
import * as XLSX from 'xlsx';
import ModalLogCTPO from './ModalLogCTPO';
import ModalLogCTHD from './ModalLogCTHD';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import ModalLogPOPR from './ModalLogPOPR';

const NhapNhaCungCap = () => {
    const [rowData, setRowData] = useState();

    const [socket, setSocket] = useState(null);
    const [socketEventReceived, setSocketEventReceived] = useState(false);
    const [urlView, setUrlView] = useState('');
    const [urlFetched, setUrlFetched] = useState(false);
    const Ky = parseInt(Cookies.get('ky'), 10);
    const UserId = Cookies.get('id');
    const tenuser = Cookies.get('firstName');
    const PhongBanId = Cookies.get('phongban_id');
    const NhomQuyen = Cookies.get('ma_groupId');

    const [machungtu, setMaChungTu] = useState('');
    const [loadingDongBo, setLoadingDongBo] = useState(false);
    const [loadingDongBoSoPO, setLoadingDongBoSoPO] = useState(false);
    const [loadOneCT, setLoadOneCT] = useState(false);
    const [loadAllCT, setLoadAllCT] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef(null);
    const [rowDataLog, setDataLog] = useState();
    const [rowDataLogCTHD, setDataLogCTHD] = useState();
    const [rowDataLogPRPO, setDataLogPRPO] = useState();
    const [showModalLogPRPO, setShowModalLogPRPO] = useState(false);
    const [showModalLog, setShowModalLog] = useState(false);
    const [showModalLogCTHD, setShowModalLogCTHD] = useState(false);
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false)
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState([]);

    const [actionDongBoCT, setActionDongBoCT] = useState('DONGBO');
    const [actionDongBoSoPO, setActionDongBoSoPO] = useState('DONGBOSOPO');
    const [actionViewLogPOCT, setActionViewLogPOCT] = useState('VLOGPOCT');
    const [actionViewLogCTHD, setActionViewLogCTHD] = useState('VLOGCTHD');
    const [actionXoaChungTu, setActionXoaChungTu] = useState('DELETE');
    const [actionViewLogPOPR, setActionViewLogPOPR] = useState('VLOGPRPO');

    //console.log('rowData', rowData)

    const handleInputChange = (event) => {
        setMaChungTu(event.target.value);
    };

    const handleCloseXoaChungTu = () => {
        setShowModalXacNhanXoa(false);
    }


    const handleRefeshAllPO = async () => {
        try {
            onFetchAllCT();
        } catch (e) {
            //setLoadingDongBo(false);
            console.error('Lỗi:', e);
        }
    };

    const handleGetChungTu = async () => {
        try {
            if (!machungtu.trim()) {
                toast.warning('Vui lòng nhập mã chứng từ');
                return;
            } else {
                setLoadingDongBo(true);
                setLoadOneCT(true);
                setIsUpdating(true);
                let res_action = await handleGetAction(actionDongBoCT);
                if (res_action && res_action.errCode === 0) {
                    let res = await getChungTu(machungtu, UserId);
                    if (res && res.errCode === 0) {
                        setLoadingDongBo(false);
                        socket.emit('getmachungtu_server', { data: res });
                        toast.success(res.errMessage)
                        setIsUpdating(false);
                    } else {
                        toast.warning(res.errMessage)
                        setLoadingDongBo(false);
                        setIsUpdating(false);
                        setMaChungTu('');
                    }
                }
            }
        } catch (e) {
            setLoadingDongBo(false);
            console.error('Lỗi:', e);
        }
    };

    const handleCapNhapSoPO = async () => {
        try {
            if (!machungtu.trim()) {
                toast.warning('Vui lòng nhập mã chứng từ');
                return;
            } else {
                setLoadingDongBoSoPO(true);
                setLoadOneCT(true);
                setIsUpdating(true);
                let res_action = await handleGetAction(actionDongBoSoPO);
                if (res_action && res_action.errCode === 0) {
                    let res = await getCapNhapSoPONhapNCC(machungtu, UserId);
                    if (res && res.errCode === 0) {
                        setLoadingDongBoSoPO(false);
                        socket.emit('getmachungtu_server', { data: res });
                        toast.success(res.errMessage)
                        setIsUpdating(false);
                    } else {
                        toast.warning(res.errMessage)
                        setLoadingDongBoSoPO(false);
                        setIsUpdating(false);
                        setMaChungTu('');
                    }
                }
            }
        } catch (e) {
            setLoadingDongBoSoPO(false);
            console.error('Lỗi:', e);
        }
    };

    const handleCellValueChanged = async (event) => {
        const updatedField = event.colDef.field;
        const mataisanNew = event.newValue;
        const rowId = event.data.id; // Giả sử mỗi hàng có một `id` để nhận diện

        // console.log('handleCellValueChanged', updatedField, mataisanNew, rowId)

        // // Gọi API để cập nhật giá trị mới
        if (updatedField === 'mataisan') {
            const dataEdit = {
                mataisanNew: mataisanNew,
                rowId: rowId,
                loai: 'PO'
            };
            let res = await editMaTaiSan(dataEdit);
            if (res && res.errCode === 0) {
                socket.emit('edit_mataisan_server', { data: res });
                toast.success(res.errMessage)
            } else {
                onFetchAllCT();
                toast.warning(res.errMessage)
            }
        }
    };


    const handleClose = () => {
        setShowModalLog(false);
        setShowModalLogCTHD(false);
        setShowModalXacNhanXoa(false);
        setShowModalLogPRPO(false);

    }

    const handleXemLog = async (data) => {
        let sopo = (data.data.sopo)
        //console.log('sopo', sopo)
        try {
            let res_action = await handleGetAction(actionViewLogPOCT);
            if (res_action && res_action.errCode === 0) {
                let response = await fetchAllLogChungTuPO(sopo);
                if (response && response.errCode === 0) {
                    setDataLog(response.data);
                    setShowModalLog(true);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleXemLogCTHD = async (data) => {
        let nhacungcap_id = (data.data.nhacungcap_id)
        //console.log('sopo', sopo)
        try {
            let res_action = await handleGetAction(actionViewLogCTHD);
            if (res_action && res_action.errCode === 0) {
                let response = await fetchAllLogChungTuHopDong(nhacungcap_id);
                if (response && response.errCode === 0) {
                    setDataLogCTHD(response.data);
                    setShowModalLogCTHD(true);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleXoaPO = async (data) => {
        let sopo = (data.data.sopo)
        try {
            let checkhd = await checkPO(sopo);
            if (checkhd && checkhd.errCode === 0) {
                const modifiedData = { sopo: sopo, Nhom: 'xoapo' };
                setDataXacNhanXoa(modifiedData);
                setShowModalXacNhanXoa(true);
            } else {
                toast.warning(checkhd.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleXemLogPOPR = async (data) => {
        //let sopr = (data.data.sopr)
        let sopr = (data.data.sopo)
        try {
            // let response = await fetchAllLogChungTuPO(sopo);
            // if (response && response.errCode === 0) {
            //     setDataLog(response.data);
            //     setShowModalLog(true);
            // }
            let res_action = await handleGetAction(actionViewLogPOPR);
            if (res_action && res_action.errCode === 0) {
                let response = await fetchAllLogPOPR(sopr);
                if (response && response.errCode === 0) {
                    setDataLogPRPO(response.data);
                    setShowModalLogPRPO(true);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };


    const handleXoaChungTu = async (data) => {
        let machungtu = (data.data.machungtu)
        let sopo = (data.data.sopo)
        try {
            let res_action = await handleGetAction(actionXoaChungTu);
            if (res_action && res_action.errCode === 0) {
                let checkchungtu = await checkXoaChungTu(machungtu);
                //console.log('checkchungtu', checkchungtu.errCode)
                if (checkchungtu && checkchungtu.errCode === 0) {
                    const modifiedData = { machungtu: machungtu, sopo: sopo, Nhom: 'xoact' };
                    setDataXacNhanXoa(modifiedData);
                    setShowModalXacNhanXoa(true);
                } else {
                    toast.warning(checkchungtu.errMessage)
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Action',
            field: '',
            pinned: 'left',
            width: 110,
            maxWidth: 110,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) => {
                if (params.data) {
                    const soluongpodacheck = params.data.soluongpodacheck;
                    const trangthaipo = params.data.trangthaipo;
                    const trangthaihd = params.data.trangthaihd;
                    return (
                        <div className="btn-action">
                            <button className='btn-view-ncc px-1' onClick={() => handleXemLogPOPR(params)} data-tooltip-id="viewlogprpo">
                                <i
                                    // style={{
                                    //     fontSize: '13px',
                                    //     fontStyle: 'normal',
                                    //     color: soluongpodacheck === 0 ? 'red' : 'blue'
                                    // }}
                                    style={{
                                        fontSize: '13px',
                                        fontStyle: 'normal',
                                        //color: soluongpodacheck === 0 ? 'red' : 'blue'
                                        color: soluongpodacheck === null
                                            ? 'orange'
                                            : soluongpodacheck === 0
                                                ? 'red'
                                                : 'blue'
                                    }}
                                >
                                    PR
                                </i>
                            </button>
                            <button
                                className='btn-view-ncc px-1'
                                onClick={() => handleXemLog(params)}
                                data-tooltip-id="viewlogpo"
                            //disabled={trangthaipo === null}
                            >
                                <i
                                    style={{
                                        fontSize: '13px',
                                        fontStyle: 'normal',
                                        color: trangthaipo === null
                                            //? 'transparent'
                                            ? 'orange'
                                            : trangthaipo === 0
                                                ? 'red'
                                                : 'blue'
                                    }}
                                >
                                    PO
                                </i>
                            </button>
                            <button className='btn-view-ncc px-1' onClick={() => handleXemLogCTHD(params)} data-tooltip-id="viewloghd">
                                <i
                                    style={{
                                        fontSize: '13px',
                                        fontStyle: 'normal',
                                        color: trangthaihd === null
                                            // ? 'transparent'
                                            ? 'orange'
                                            : trangthaihd === 0
                                                ? 'red'
                                                : 'blue'
                                    }}
                                >
                                    HĐ
                                </i>
                            </button>
                            <button className='btn-delete' onClick={() => handleXoaChungTu(params)} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                        </div>
                    );
                }
                return null;
            }
        },
        {
            headerName: 'Mã chứng từ',
            field: 'machungtu',
            width: 150,
            maxWidth: 150,
            pinned: 'left',
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Mã TS',
            field: 'mataisan',
            width: 100,
            maxWidth: 100,
            editable: true,
            pinned: 'left',
        },
        {
            headerName: 'Tên tài sản',
            field: 'tentaisan',
            width: 250,
            maxWidth: 250,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'ĐVT',
            field: 'donvitinh',
            width: 85,
            maxWidth: 85,
        },
        {
            headerName: 'SL',
            field: 'soluongct',
            width: 80,
            maxWidth: 80,
        },
        {
            headerName: 'Đơn giá',
            field: 'dongiact',
            width: 110,
            maxWidth: 110,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Thành tiền',
            headerClass: 'header-wrap',
            field: 'thanhtiennhap',
            width: 110,
            maxWidth: 110,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'VAT',
            field: 'vatnhap',
            width: 80,
            maxWidth: 80,
        },
        {
            headerName: 'Đơn giá vat',
            headerClass: 'header-wrap',
            field: 'dongianhapvat',
            width: 110,
            maxWidth: 110,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Thành tiền vat',
            headerClass: 'header-wrap',
            field: 'thanhtiennhapvat',
            width: 110,
            maxWidth: 110,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Chênh lệch SL PO',
            field: 'soluongnhap',
            width: 100,
            maxWidth: 100,
            headerClass: 'header-wrap',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                const value = params.value;
                if (value === null || value === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (value > 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (value <= 0) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Chênh lệch giá PO',
            field: 'dongianhap',
            width: 100,
            maxWidth: 100,
            headerClass: 'header-wrap',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                const value = params.value;
                if (value === null || value === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (value > 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (value === 0) {
                    return { backgroundColor: 'green', color: 'white' };
                } else if (value < 0) {
                    return { backgroundColor: 'red', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Chênh lệch giá Vat PO',
            field: 'dongiavatnhap',
            width: 100,
            maxWidth: 100,
            headerClass: 'header-wrap',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                const value = params.value;
                if (value === null || value === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (value > 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (value === 0) {
                    return { backgroundColor: 'green', color: 'white' };
                } else if (value < 0) {
                    return { backgroundColor: 'red', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Chênh lệch giá HĐ',
            field: 'dongiahd_check',
            headerClass: 'header-wrap',
            width: 100,
            maxWidth: 100,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                const value = params.value;
                if (value === null || value === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (value > 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (value <= 0) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Chênh lệch giá vat HĐ',
            field: 'dongiavathd_check',
            headerClass: 'header-wrap',
            width: 100,
            maxWidth: 100,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                const value = params.value;
                if (value === null || value === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (value > 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (value <= 0) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Check hiệu lực HĐ',
            field: 'hieuluc_check',
            headerClass: 'header-wrap',
            width: 110,
            maxWidth: 110,
            cellStyle: params => {
                const value = params.value;
                if (value === null || value === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (value === 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (value === 1) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            },
            valueFormatter: params => {
                const value = params.value;
                if (value === 1) {
                    return 'Còn hiệu lực';
                } else if (value === 0) {
                    return 'Hết hiệu lực';
                }
                return '';
            }
        },
        {
            headerName: 'Ngày PO',
            field: 'ngaypo',
            width: 110,
            maxWidth: 110,
            valueFormatter: (params) => {
                // params.value là giá trị của ô
                if (params.value === null) {
                    return ''; // Trả về chuỗi rỗng nếu NgayCongVan là null
                }

                const date = new Date(params.value);
                const formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                return formattedDate;
            },
        },
        {
            headerName: 'Số PO',
            field: 'sopo',
            width: 150,
            maxWidth: 150,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Số PR',
            field: 'sopr',
            width: 150,
            maxWidth: 150,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'RN/Công văn',
            field: 'rn',
            width: 160,
            maxWidth: 160,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Số HĐ',
            field: 'sohopdong',
            width: 160,
            maxWidth: 160,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Ngày hiệu lực HĐ',
            headerClass: 'header-wrap',
            field: 'ngayhopdong',
            width: 110,
            maxWidth: 110,
            valueFormatter: (params) => {
                // params.value là giá trị của ô
                if (params.value === null) {
                    return ''; // Trả về chuỗi rỗng nếu NgayCongVan là null
                }

                const date = new Date(params.value);
                const formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                return formattedDate;
            },
        },
        {
            headerName: 'Ngày kết thúc HĐ',
            headerClass: 'header-wrap',
            field: 'ngayketthuc',
            width: 110,
            maxWidth: 110,
            valueFormatter: (params) => {
                // params.value là giá trị của ô
                if (params.value === null) {
                    return ''; // Trả về chuỗi rỗng nếu NgayCongVan là null
                }

                const date = new Date(params.value);
                const formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                return formattedDate;
            },
        },
        {
            headerName: 'Kho nhập',
            field: 'khonhap',
            width: 200,
            maxWidth: 200,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Người nhập',
            field: 'nguoinhap',
            width: 200,
            maxWidth: 200,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Nhà cung cấp',
            field: 'tennhacungcap',
            width: 220,
            maxWidth: 220,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Ngày đồng bộ',
            field: 'ngaytao',
            width: 150,
            maxWidth: 150,
            valueFormatter: (params) => {
                // params.value là giá trị của ô
                if (params.value === null) {
                    return ''; // Trả về chuỗi rỗng nếu NgayCongVan là null
                }

                const date = new Date(params.value);
                const formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                return formattedDate;
            },
        },
    ]);
    const rowClassRules = {
        'row-pink': (params) => {
            return params.data.checkmataisan === 1;
        },
    };
    const gridOptions = {
        rowClassRules: rowClassRules,
    };


    const [defaultColDef] = useState({
        sortable: true,
        suppressHorizontalScroll: true,
        floatingFilter: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: { suppressFilterButton: true },
        floatingFilterComponent: ClearableFloatingFilter,
        suppressMenu: true,
        unSortIcon: true,
        resizable: true,
        minWidth: 500,
        flex: 1,
    });

    const [gridStyle] = useState({ height: '78vh', width: '100%' });


    const onFetchAllCT = useCallback(async () => {
        try {
            //console.log('fetching all PO');
            let response = await fetchAllCT();
            if (response && response.errCode === 0) {
                //console.log('response all', response.data);
                setRowData(response.data);
                setLoadOneCT(false);
            }
        } catch (error) {
            console.error("Error fetching all PO:", error);
        }
    }, []);

    const onFetchOneCT = useCallback(async () => {
        try {
            //console.log('fetching one PO with mã chứng từ:', machungtu);
            let response = await fetchOneCT(machungtu);
            if (response && response.errCode === 0) {
                //console.log('response one', response.data);
                setRowData(response.data);
            }
            setMaChungTu('');
        } catch (error) {
            console.error("Error fetching one PO:", error);
        }
    }, [machungtu]);

    useEffect(() => {
        if (!isUpdating && loadOneCT) {
            //console.log("loadOnePR is true, fetching one PR...", loadOnePO);
            onFetchOneCT();
            setLoadOneCT(false); // Tắt cờ sau khi hoàn thành
        }
    }, [isUpdating, loadOneCT, onFetchOneCT]);


    useEffect(() => {
        if (loadAllCT) {
            //console.log("Initial page load, fetching all PR...");
            onFetchAllCT();
            setLoadAllCT(false);  // Đặt lại cờ sau lần load ban đầu
        }
    }, [loadAllCT, onFetchAllCT]);


    useEffect(() => {
        try {
            const fetchUrlView = async () => {
                try {
                    // let res = await getUrl();
                    // setUrlView(res.data.url);
                    let res = await getUrl();
                    // console.log('res url', res)
                    if (res && res.errCode === 0) {
                        setUrlView(res.url);
                        setUrlFetched(true);
                    } else {

                    }
                } catch (error) {
                    console.error('Error fetching URL_VIEW:', error);
                }
            };

            fetchUrlView();
        } catch (error) {
            console.error('Error fetching URL_VIEW:', error);
        }
    }, []);


    useEffect(() => {
        try {
            if (urlFetched) {
                // console.log('res urlView', urlView)
                const newSocket = io(urlView, {
                    transports: ['websocket']
                });
                newSocket.on('connect', () => {
                    console.log('Connected to server socket.io');
                });
                newSocket.on('connect_error', (error) => {
                    console.error('Failed to connect to server:', error);
                });
                setSocket(newSocket);

                // return () => {
                //     newSocket.disconnect();
                // };
            }
        } catch (error) {
            console.error('Error fetching URL_VIEW:', error);
        }
    }, [urlFetched, urlView]);


    useEffect(() => {
        try {
            return () => {
                setSocketEventReceived(false);
            };
        } catch (error) {
            console.error('Error fetching URL_VIEW:', error);
        }
    }, []);

    useEffect(() => {
        if (socket && !socketEventReceived) {

            socket.on("po_new_client", (data) => {
                setLoadAllCT(true);
                setSocketEventReceived(true);
            });

            socket.on("getmachungtu_client", (data) => {
                setLoadOneCT(true);
                setSocketEventReceived(true);
            });

            socket.on("edit_mataisan_client", (data) => {
                setLoadAllCT(true);
                setSocketEventReceived(true);
            });
        }
    }, [socket, socketEventReceived]);

    // useEffect(() => {
    //     onGridReady();
    // }, [onGridReady]);


    return (
        <>
            <ReactTooltip
                id="delete"
                place="top-end"
                variant="info"
                content="Xóa"
            />
            <ReactTooltip
                id="viewlogpo"
                place="top-start"
                variant="info"
                content="Xem log PO"
            />
            <ReactTooltip
                id="viewloghd"
                place="top"
                variant="info"
                content="Xem log HĐ"
            />
            <ReactTooltip
                id="viewlogprpo"
                place="top"
                variant="info"
                content="Xem log PR"
            />
            <div className='row grid-container'>
                <div className="row d-flex input-row-dongbo">
                    <div className="col-md-2" style={{ width: '15%', minWidth: '100px' }}>
                        <input
                            type="text"
                            value={machungtu}
                            onChange={handleInputChange}
                            className="form-control file-input"
                            placeholder="Nhập mã chứng từ..."
                            style={{ fontSize: '13px', fontStyle: 'italic' }}
                        //autoFocus
                        //ref={inputRef}
                        />
                    </div>
                    <div className="col-md-2 d-flex">
                        <button
                            type="button"
                            className="btn btn-primary px-1 button-import me-2"
                            onClick={handleGetChungTu}
                        >
                            {loadingDongBo && (
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            )}
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Đồng bộ</i>
                        </button>
                        {/* <button
                            type="button"
                            className="btn btn-primary px-1 button-import me-2"
                            style={{ backgroundColor: 'orange', color: 'black', border: 'none' }}
                            onClick={handleCapNhapSoPO}
                        >
                            {loadingDongBoSoPO && (
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            )}
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Cập nhập số PO</i>
                        </button> */}
                    </div>
                    <div className="col-md-2 d-flex">
                    </div>
                    <div className="col-md-2 d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-primary px-1 button-import"
                            onClick={handleRefeshAllPO}
                        >
                            {loadingDongBo && (
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            )}
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>All CT</i>
                        </button>
                    </div>
                </div>
                <div className="ag-theme-alpine container" id='myGrid' >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        // masterDetail={true}
                        // detailCellRendererParams={detailCellRendererParams}
                        gridOptions={gridOptions}
                        pagination={true}
                        paginationPageSize='20'
                    //onCellValueChanged={handleCellValueChanged}
                    />
                </div>
                <div>
                    <ModalLogCTPO
                        show={showModalLog}
                        rowDataLog={rowDataLog}
                        handleClose={handleClose}
                        socket={socket}
                        onFetchAllCT={onFetchAllCT}
                    />
                </div>
                <div>
                    <ModalLogCTHD
                        show={showModalLogCTHD}
                        rowDataLog={rowDataLogCTHD}
                        handleClose={handleClose}
                        onFetchAllCT={onFetchAllCT}
                        socket={socket}
                    />
                </div>
                <div>
                    <ModalXacNhanXoa
                        show={showModalXacNhanXoa}
                        dataXacNhanXoa={dataXacNhanXoa}
                        handleClose={handleClose}
                        onGridReady={onFetchAllCT}
                        socket={socket}
                        handleCloseXoaChungTu={handleCloseXoaChungTu}
                    />
                </div>
                <div>
                    <ModalLogPOPR
                        show={showModalLogPRPO}
                        rowDataLog={rowDataLogPRPO}
                        handleClose={handleClose}
                        socket={socket}
                        onGridReady={onFetchAllCT}
                    />
                </div>
            </div>
        </>
    );
};

export default NhapNhaCungCap;