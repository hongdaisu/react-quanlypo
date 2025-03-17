import { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import ModalInKiemKe from './ModalInKiemKe';
import './Grid.css';
import './PhongBan.scss';
import Select from 'react-select';
import {
    fetchAllTaiSanTheoKho, fetchAllTaiSanTheoKhoQL, editKhoaPhongHienTai, fetchAllViTri, fetchAllLichSuKiemKe,
    getMaTaiSanKiemKe, getSerialKiemKe, fetchAllKho, fetchAllKhoEdit, fetchAllKhoQL, fetchAllTinhTrang, timkiemDataKiemKe, fetchAllKhoQLTK
    , fetchAllTaiSanTheoKhoLichSu, checkDataChuaXacnhan
} from '../../services/importService';
import { getUrl } from '../../services/urlServices';
import { handleGetAction } from '../../services/actionButtonServices';
import ModalEditTs from './ModalEditTs';
import ModalNewTS from './ModalNewTS';
import { ToastType, toast } from 'react-toastify';
import io from "socket.io-client";
import ClearableFloatingFilter from './CustomFloatingFilter';
import { Tooltip as ReactTooltip } from "react-tooltip";
import Cookies from 'js-cookie';
import ColourCellRenderer from './ColourCellRenderer';
import { get, debounce } from 'lodash';
import { Toast } from 'react-bootstrap';
import ModalInKiemKeTong from './ModalInKiemKeTong';
import ModalLichSuKiemKe from './ModalLichSuKiemKe';

import CustomDropdownEditor from './CustomDropdownEditor';



const KiemKeTaiSan_bak = () => {
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const [dataEdit, setDataEdit] = useState([]);
    const [gridStyle] = useState({ height: '67vh', width: '100%' });
    const gridApiRef = useRef(null);
    const [highlightedRow, setHighlightedRow] = useState(null);
    const [socket, setSocket] = useState(null);
    const [socketEventReceived, setSocketEventReceived] = useState(false);
    const [urlView, setUrlView] = useState('');
    const [urlFetched, setUrlFetched] = useState(false);
    const UserId = Cookies.get('id');

    const [MaTaiSan, setMaTaiSan] = useState('');
    const [Serial, setSerial] = useState('');

    const [selectedOptionKho, setSelectedOptionKho] = useState(null);
    const [selectedOptionKhoTimKiem, setSelectedOptionKhoTimKiem] = useState(null);
    const [optionsKhoTimKiem, setOptionsKhoTimKiem] = useState([]);
    const [optionsKho, setOptionsKho] = useState([]);
    const [optionsViTri, setOptionsViTri] = useState([]);
    const [optionsTinhTrang, setOptionsTinhTrang] = useState([]);
    const [optionsKhoEdit, setOptionsKhoEdit] = useState([]);
    const [KhoTaiSan_Id, setKhoTaiSan_Id] = useState('');
    const [TimKiemKhoTaiSan_Id, setTimKiemKhoTaiSan_Id] = useState('');

    const [selectedOptionKhoQL, setSelectedOptionKhoQL] = useState(null);
    const [optionsKhoQL, setOptionsKhoQL] = useState([]);
    const [KhoQuanLy, setKhoQuanLy] = useState('');
    const [selectedOptionKhoQLTK, setSelectedOptionKhoQLTK] = useState(null);
    const [optionsKhoQLTK, setOptionsKhoQLTK] = useState([]);
    const [KhoQuanLyTK, setKhoQuanLyTK] = useState('');

    const TongSo = rowData.length > 0 ? rowData[0].TongSo : 0;
    const DaKiem = rowData.length > 0 ? rowData[0].DaKiem : 0;
    const ConLai = rowData.length > 0 ? rowData[0].ConLai : 0;
    const [loadingSearchMTS, setLoadingSearchMTS] = useState(false);
    const [loadingTaiSan, setLoadingTaiSan] = useState(false);
    const [loadingSearchSR, setLoadingSearchSR] = useState(false);

    const [actionXacNhanKiemKe, setActionXacNhanKiemKe] = useState('XACNHAN');
    const [actionThemTaiSan, setActionThemTaiSan] = useState('ADDTAISAN');
    const [actionHuyXacNhanKiemKe, setHuyActionXacNhanKiemKe] = useState('HUYXACNHAN');
    const [actionDelete, setActionDelete] = useState('DELETETS');
    const [actionHuyKiemKe, setActionHuyKiemKe] = useState('HUYKIEMKE');
    const [dataXacNhanKiemKe, setDataXacNhanKiemKe] = useState([]);
    const [dataLichSuKiemKe, setDataLichSuKiemKe] = useState([]);
    const [showModalXacNhanKiemKe, setShowModalXacNhanKiemKe] = useState(false)
    const [showModalThemTaiSan, setShowModalThemTaiSan] = useState(false)
    const [showModalInKiemKe, setShowModalInKiemKe] = useState(false)
    const [showModalInKiemKeTong, setShowModalInKiemKeTong] = useState(false)
    const [showModalHuyXacNhanKiemKe, setShowModalHuyXacNhanKiemKe] = useState(false)
    const [showModalXacNhanXoaKiemKe, setShowModalXacNhanXoaKiemKe] = useState(false)
    const [showModalXacNhanHuyKiemKe, setShowModalXacNhanHuyKiemKe] = useState(false)

    const [showModalLichSuKiemKe, setShowModalLichSuKiemKe] = useState(false)

    const [TuNgay, setTuNgay] = useState('');
    const [DenNgay, setDenNgay] = useState('');

    //console.log('highlightedRow', highlightedRow)
    //console.log('rowData length', rowData)

    const handleClose = () => {
        setShowModalXacNhanKiemKe(false);
        setShowModalThemTaiSan(false);
        setShowModalHuyXacNhanKiemKe(false);
        setShowModalXacNhanXoaKiemKe(false);
        setShowModalLichSuKiemKe(false);
        setShowModalXacNhanHuyKiemKe(false);
        setShowModalInKiemKe(false);
        setShowModalInKiemKeTong(false)
        //setSelectedOptionKho(null);
        //setSelectedOptionKhoTimKiem(null);
        setShowModalThemTaiSan(false);
    }

    const handleCloseXacNhanKiemKe = () => {
        setShowModalXacNhanKiemKe(false);
        setSelectedOptionKho(null);
        setSelectedOptionKhoQL(null);
    }

    const handleCloseThemTaiSan = () => {
        setShowModalThemTaiSan(false);
    }

    const handleCloseHuyXacNhanKiemKe = () => {
        setShowModalHuyXacNhanKiemKe(false);
        setSelectedOptionKhoTimKiem(null);
        setSelectedOptionKhoQLTK(null);
    }

    const handleCloseInKiemKe = () => {
        setShowModalInKiemKe(false);
    }

    const handleCloseInKiemKeTong = () => {
        setShowModalInKiemKeTong(false);
    }

    const handleCloseXacNhanXoaKiemKe = () => {
        setHighlightedRow(null);
        sessionStorage.removeItem('MaTaiSan');
        // setSelectedOptionKho(null);
        // setSelectedOptionKhoQL(null);
        setShowModalXacNhanXoaKiemKe(false);
    }

    const handleCloseLichSuKiemKe = () => {
        setLoadingTaiSan(false)
        toast.warning('Vui lòng chọn kho quản lý')
        //toast.warning(response.errMessage)
        setShowModalLichSuKiemKe(false);
        sessionStorage.removeItem('KhoQuanLy');
        setSelectedOptionKhoTimKiem(null)
    }

    const handleCloseXacNhanHuyKiemKe = () => {
        setHighlightedRow(null);
        setShowModalXacNhanHuyKiemKe(false);
    }

    const handleInputChangeSerial = (event) => {
        setSerial(event.target.value);

    };

    const handleInputChangeMaTaiSan = (event) => {
        setMaTaiSan(event.target.value);
    };

    const handleRowClick = (selectedRow) => {
        setShowModalLichSuKiemKe(false);
        setLoadingTaiSan(true)
        sessionStorage.setItem('KhoQuanLy', selectedRow.KhoaQuanLy);
        sessionStorage.setItem('DotKiemKe_Id', selectedRow.DotKiemKe_Id);
        const selectedKhoQL = selectedRow.KhoaQuanLy;
        const DotKiemKe_Id = selectedRow.DotKiemKe_Id;
        // getTaiSanTheoKhoLichSu(KhoTaiSan_Id, selectedKhoQL, UserId, DotKiemKe_Id)
        getTaiSanTheoKhoLichSu(KhoTaiSan_Id, selectedKhoQL, UserId, DotKiemKe_Id)
        const selectedOption = optionsKhoQL.find(option => option.value === selectedKhoQL);
        if (selectedOption) {
            setSelectedOptionKhoQL(selectedOption); // Cập nhật state cho Select
        }
        //console.log('Dữ liệu được click:', selectedRow.KhoaQuanLy);
        //alert(`Bạn đã chọn: ${selectedRow.KhoaQuanLy}`);
    };

    const handleSelectChangeKho = (selectedOptionKho) => {
        setSelectedOptionKho(selectedOptionKho);
        if (selectedOptionKho) {
            const selectedKhoId = selectedOptionKho.value;
            const selectedKhoQL = null;
            setKhoTaiSan_Id(selectedOptionKho.value); // Chỉ cần lưu giá trị, không cần đối tượng
            sessionStorage.setItem('KhoTaiSan_Id', selectedOptionKho.value);
            getTaiSanTheoKho(selectedKhoId, selectedKhoQL, UserId)
            //getAllKhoQL(selectedKhoId)
            getAllKhoQL();
            sessionStorage.removeItem('TimKiemKhoTaiSan_Id');
            sessionStorage.removeItem('TimKiemKhoQuanLy');
            setSelectedOptionKhoTimKiem(null)
            setSelectedOptionKhoQLTK(null)
            setRowData([])
            setTuNgay('')
            setDenNgay('')
            //getAllKhoEdit()
        } else {
            setLoadingTaiSan(false)
            sessionStorage.removeItem('KhoTaiSan_Id');
            //getAllKhoQL(null)
            sessionStorage.removeItem('KhoQuanLy');
            sessionStorage.removeItem('MaTaiSan');
            sessionStorage.removeItem('DotKiemKe_Id');
            setHighlightedRow(null);
            setMaTaiSan('');
            setSelectedOptionKhoQL(null)
            setOptionsKhoQL([])
            setRowData([])
            //getTaiSanTheoKho(null, null, UserId)
        }
    };

    const handleSelectChangeKhoTimKiem = (selectedOptionKhoTimKiem) => {
        setSelectedOptionKhoTimKiem(selectedOptionKhoTimKiem);
        if (selectedOptionKhoTimKiem) {
            sessionStorage.setItem('TimKiemKhoTaiSan_Id', selectedOptionKhoTimKiem.value);
            // Kiểm tra nếu selectedOptionKhoTimKiem không phải là null
            const khoId = selectedOptionKhoTimKiem ? selectedOptionKhoTimKiem.value : null;
            setTimKiemKhoTaiSan_Id(khoId);
            setRowData([]);
            sessionStorage.removeItem('KhoTaiSan_Id');
            sessionStorage.removeItem('KhoQuanLy');
            sessionStorage.removeItem('MaTaiSan');
            sessionStorage.removeItem('TimKiemKhoQuanLy');
            sessionStorage.removeItem('DotKiemKe_Id');
            setSelectedOptionKhoQLTK(null)
            setSelectedOptionKho(null)
            setSelectedOptionKhoQL(null)
        } else {
            sessionStorage.removeItem('TimKiemKhoTaiSan_Id');
            sessionStorage.removeItem('DotKiemKe_Id');
            setRowData([]);
        }
    };

    const handleSelectChangeKhoQLTK = (selectedOptionKhoQLTK) => {
        setSelectedOptionKhoQLTK(selectedOptionKhoQLTK);
        if (selectedOptionKhoQLTK) {
            sessionStorage.setItem('TimKiemKhoQuanLy', selectedOptionKhoQLTK.value);
            // Kiểm tra nếu selectedOptionKhoTimKiem không phải là null
            const KhoQuanLyTK = selectedOptionKhoQLTK ? selectedOptionKhoQLTK.value : null;
            setKhoQuanLyTK(KhoQuanLyTK);
            setRowData([]);
            sessionStorage.removeItem('KhoTaiSan_Id');
            sessionStorage.removeItem('KhoQuanLy');
            sessionStorage.removeItem('MaTaiSan');
            sessionStorage.removeItem('DotKiemKe_Id');
            setSelectedOptionKho(null)
            setSelectedOptionKhoQL(null)
        } else {
            sessionStorage.removeItem('TimKiemKhoQuanLy');
            sessionStorage.removeItem('DotKiemKe_Id');
            setRowData([]);
        }
    };

    const handleSelectChangeKhoQL = async (selectedOptionKhoQL) => {
        setSelectedOptionKhoQL(selectedOptionKhoQL);
        const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
        if (selectedOptionKhoQL) {
            setLoadingTaiSan(true)
            const selectedKhoQL = selectedOptionKhoQL.value;
            setKhoQuanLy(selectedOptionKhoQL.value); // Chỉ cần lưu giá trị, không cần đối tượng
            sessionStorage.setItem('KhoQuanLy', selectedOptionKhoQL.value);
            let res = await checkDataChuaXacnhan(KhoTaiSan_Id, selectedKhoQL);
            if (res && res.errCode === 0) {
                //console.log('còn data chưa xác nhận', selectedKhoQL)
                getTaiSanTheoKho(KhoTaiSan_Id, null, UserId)
            } else {
                //console.log('hết data chưa xác nhận')
                getTaiSanTheoKho(KhoTaiSan_Id, selectedKhoQL, UserId)
            }
            //console.log('handleSelectChangeKhoQL', selectedKhoQL)
            //getTaiSanTheoKhoQL(KhoTaiSan_Id, selectedKhoQL)
            //getTaiSanTheoKho(KhoTaiSan_Id, selectedKhoQL, UserId)
        } else {
            setLoadingTaiSan(false)
            //const selectedKhoId = selectedOptionKho.value;
            sessionStorage.removeItem('KhoQuanLy');
            sessionStorage.removeItem('DotKiemKe_Id');
            //getTaiSanTheoKhoQL(KhoTaiSan_Id, null)
            //getTaiSanTheoKho(null, null, UserId)

            setRowData([])
        }
        //console.log('loadingTaiSan', KhoTaiSan_Id)
    };

    const handleDelete = async (dataxoa) => {
        const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
        let data = dataxoa.data
        //console.log('handleDelete', dataxoa.data)
        if (dataxoa.data.XacNhanKiemKe) {
            toast.warning('Tài sản đã xác nhận kiểm kê không thể xóa')
        } else {
            try {
                let res = await handleGetAction(actionDelete);
                if (res && res.errCode === 0) {
                    const modifiedData = { data: data, UserId: UserId, KhoTaiSan_Id: KhoTaiSan_Id, Nhom: 'xoakiemke' };
                    setShowModalXacNhanXoaKiemKe(true);
                    setDataXacNhanKiemKe(modifiedData);
                } else {
                    setShowModalXacNhanXoaKiemKe(false);
                    toast.warning(res.errMessage)
                }

            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleHuyKiem = async (dataxoa) => {
        const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
        const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
        let IdKiemKe = dataxoa.data.id
        let MaTaiSan = dataxoa.data.MaTaiSan
        let TenTaiSan = dataxoa.data.TenTaiSan
        //console.log('handleHuyKiem', IdKiemKe, MaTaiSan, TenTaiSan)
        let data = dataxoa.data
        if (dataxoa.data.IsCheckKiemKe === 0) {
            toast.warning('Tài sản chưa được kiểm kê')
        } else {
            if (dataxoa.data.XacNhanKiemKe) {
                toast.warning('Tài sản đã xác nhận kiểm kê, không thể hủy')
            } else {
                try {
                    let res = await handleGetAction(actionHuyKiemKe);
                    if (res && res.errCode === 0) {
                        const modifiedData = { DotKiemKe_Id: DotKiemKe_Id, UserId: UserId, IdKiemKe: IdKiemKe, KhoTaiSan_Id: KhoTaiSan_Id, MaTaiSan: MaTaiSan, TenTaiSan: TenTaiSan, Nhom: 'huykiemke' };
                        setShowModalXacNhanHuyKiemKe(true);
                        setDataXacNhanKiemKe(modifiedData);
                    } else {
                        setShowModalXacNhanHuyKiemKe(false);
                        toast.warning(res.errMessage)
                    }

                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Action', field: '', pinned: 'left', width: 80, maxWidth: 80,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) =>
                <div>
                    <button className='btn-undo' onClick={() => { handleHuyKiem(params) }} data-tooltip-id="undo"><i className="fas fa-undo"></i></button>
                    <button className='btn-delete' onClick={() => { handleDelete(params) }} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                </div>
        },
        {
            headerName: 'STT',
            field: 'STT',
            pinned: 'left',
            width: 80,
            maxWidth: 80,
        },
        {
            headerName: 'Mã tài sản',
            field: 'MaTaiSan',
            pinned: 'left',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Mã tài sản new',
            field: 'MaTaiSanNew',
            headerClass: 'header-wrap',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Trạng thái kiểm',
            field: 'IsCheckKiemKe',
            headerClass: 'header-wrap',
            width: 100,
            maxWidth: 100,
        },
        {
            headerName: 'Lần kiểm kê',
            field: 'LanKiemKe',
            headerClass: 'header-wrap',
            width: 100,
            maxWidth: 100,
        },
        {
            headerName: 'Bệnh viện',
            field: 'BenhVien',
            width: 120,
            maxWidth: 120,
        },
        {
            headerName: 'Phân loại',
            field: 'PhanLoai',
            width: 170,
            maxWidth: 170,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Tên tài sản',
            field: 'TenTaiSan',
            width: 200,
            maxWidth: 200,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Model',
            field: 'Model',
            width: 140,
            maxWidth: 140,
        },
        {
            headerName: 'Serial',
            field: 'Serial',
            width: 140,
            maxWidth: 140,
        },
        {
            headerName: 'Thời gian đưa vào',
            field: 'ThoiGianDuaVao',
            headerClass: 'header-wrap',
            width: 110,
            //pinned: 'left',
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
            headerName: 'Nguyên giá',
            field: 'NguyenGia',
            headerClass: 'header-wrap',
            width: 110,
            maxWidth: 110,
            //editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'SL',
            headerClass: 'header-wrap',
            field: 'SoLuong',
            width: 80,
            maxWidth: 80,
            // editable: true,
            valueFormatter: (params) => {
                if (params.value != null && !isNaN(params.value)) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Khoa phòng sử dụng',
            field: 'KhoaPhongSuDung',
            width: 170,
            maxWidth: 170,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Người sử dụng',
            field: 'NguoiSuDung',
            width: 170,
            maxWidth: 170,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Vị trí',
            field: 'ViTri',
            width: 170,
            maxWidth: 170,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Ghi chú',
            field: 'GhiChu',
            width: 170,
            maxWidth: 170,
        },
        {
            headerName: 'Khoa quản lý',
            field: 'KhoaQuanLy',
            width: 100,
            maxWidth: 100,
            headerClass: 'header-wrap',
        },
        {
            headerName: 'SL thực tế',
            field: 'SoLuongThucTe',
            width: 100,
            maxWidth: 100,
            headerClass: 'header-wrap',
        },
        {
            headerName: 'Chênh lệch',
            field: 'ChenhLech',
            width: 100,
            maxWidth: 100,
            headerClass: 'header-wrap',
        },
        {
            headerName: 'Khoa phòng hiện tại',
            field: 'KhoaPhongHienTai',
            width: 200,
            maxWidth: 200,
            editable: (params) => {
                return params.data.IsCheckKiemKe !== 0 && params.data.XacNhanKiemKe !== 1; // Chỉ cho phép chỉnh sửa nếu IsCheckKiemKe !== 0
            },
            cellEditor: 'agRichSelectCellEditor', // Sử dụng agRichSelectCellEditor
            // cellEditorParams: {
            //     values: [], // Danh sách giá trị trong dropdown
            //     cellRenderer: 'ColourCellRenderer', // Hiển thị giá trị theo custom renderer
            //     filterList: true,  // Cho phép lọc trong dropdown
            //     searchType: 'match', // Loại tìm kiếm trong dropdown (match là khớp chính xác)
            //     allowTyping: true, // Cho phép người dùng nhập vào
            //     valueListMaxHeight: 220, // Độ cao tối đa của danh sách
            // },
            cellEditorParams: {
                values: [],
                filterList: true, // Bật bộ lọc
                allowTyping: true, // Cho phép nhập
                valueListMaxHeight: 220,
                filterParams: {
                    filterOptions: ['contains'],  // Chọn kiểu tìm kiếm "contains" thay vì "startsWith"
                    debounceMs: 500, // Thời gian chờ sau mỗi lần gõ để tránh gọi quá nhiều
                },
            },
            onFilterChanged: (params) => {
                const searchText = params.api.getFilterModel().KhoaPhongHienTai; // Lấy từ model lọc hiện tại
                if (searchText) {
                    // Thực hiện lọc động các mục trong dropdown
                    const dropdown = document.querySelector('.ag-rich-select-dropdown');
                    if (dropdown) {
                        const options = dropdown.querySelectorAll('.ag-rich-select-value'); // Các giá trị trong dropdown
                        options.forEach((option) => {
                            const text = option.innerText.toLowerCase();
                            // Lọc và chỉ hiển thị các mục khớp với chuỗi tìm kiếm
                            if (text.includes(searchText.toLowerCase())) {
                                option.style.display = 'block'; // Hiển thị nếu khớp
                            } else {
                                option.style.display = 'none'; // Ẩn nếu không khớp
                            }
                        });
                    }
                }
            },
            cellRenderer: (params) => {
                const values = params.value;
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word',
                            width: '90%',
                            lineHeight: '1.5',
                            marginBottom: '4px',
                            alignItems: 'center',
                        }}>
                            {params.value || ''}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {values && values.length > 0 && params.data.XacNhanKiemKe !== 1 && (
                                <button
                                    style={{
                                        color: 'blue',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease',
                                        paddingLeft: '4px'
                                    }}
                                    onClick={() => {
                                        params.node.setDataValue(params.colDef.field, null);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = 'red'; // Thay đổi màu sắc khi hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = 'blue'; // Đổi lại màu sắc khi không hover
                                    }}
                                >
                                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                                </button>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            headerName: 'Vị trí hiện tại',
            field: 'ViTriHienTai',
            width: 350,
            maxWidth: 350,
            editable: (params) => {
                return params.data.IsCheckKiemKe !== 0 && params.data.XacNhanKiemKe !== 1;
            },
            //cellRenderer: ColourCellRenderer,
            cellEditor: 'agRichSelectCellEditor', // Sử dụng agRichSelectCellEditor
            // cellEditorParams: {
            //     values: [], // Danh sách giá trị trong dropdown
            //     cellRenderer: 'ColourCellRenderer', // Hiển thị giá trị theo custom renderer
            //     filterList: true,  // Cho phép lọc trong dropdown
            //     // searchType: 'match', // Loại tìm kiếm trong dropdown (match là khớp chính xác)
            //     allowTyping: true, // Cho phép người dùng nhập vào
            //     valueListMaxHeight: 220, // Độ cao tối đa của danh sách
            // },

            cellEditorParams: {
                values: [],
                filterList: true, // Bật bộ lọc
                allowTyping: true, // Cho phép nhập
                valueListMaxHeight: 220,
                filterParams: {
                    filterOptions: ['contains'],  // Chọn kiểu tìm kiếm "contains" thay vì "startsWith"
                    debounceMs: 500, // Thời gian chờ sau mỗi lần gõ để tránh gọi quá nhiều
                },
            },
            onFilterChanged: (params) => {
                const searchText = params.api.getFilterModel().ViTriHienTai; // Lấy từ model lọc hiện tại
                if (searchText) {
                    // Thực hiện lọc động các mục trong dropdown
                    const dropdown = document.querySelector('.ag-rich-select-dropdown');
                    if (dropdown) {
                        const options = dropdown.querySelectorAll('.ag-rich-select-value'); // Các giá trị trong dropdown
                        options.forEach((option) => {
                            const text = option.innerText.toLowerCase();
                            // Lọc và chỉ hiển thị các mục khớp với chuỗi tìm kiếm
                            if (text.includes(searchText.toLowerCase())) {
                                option.style.display = 'block'; // Hiển thị nếu khớp
                            } else {
                                option.style.display = 'none'; // Ẩn nếu không khớp
                            }
                        });
                    }
                }
            },
            // Tùy chỉnh hiển thị của cell
            cellRenderer: (params) => {
                const value = params.value;
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span
                            style={{
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                overflowWrap: 'break-word',
                                width: '90%',
                                lineHeight: '1.5',
                                marginBottom: '4px',
                                alignItems: 'center',
                            }}
                        >
                            {value || ''}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {value && params.data.XacNhanKiemKe !== 1 && (
                                <button
                                    style={{
                                        color: 'blue',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease',
                                        paddingLeft: '4px',
                                    }}
                                    onClick={() => {
                                        params.node.setDataValue(params.colDef.field, null);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = 'red';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = 'blue';
                                    }}
                                >
                                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                                </button>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            headerName: 'Ghi chú hiện tại',
            field: 'GhiChuHienTai',
            width: 270,
            maxWidth: 270,
            // editable: (params) => {
            //     return params.data.IsCheckKiemKe !== 0 && params.data.XacNhanKiemKe !== 1; 
            // },
            editable: true,
        },
        {
            headerName: 'Tình trạng',
            field: 'TinhTrang',
            width: 170,
            maxWidth: 170,
            editable: (params) => {
                return params.data.IsCheckKiemKe !== 0 && params.data.XacNhanKiemKe !== 1; // Chỉ cho phép chỉnh sửa nếu IsCheckKiemKe === 0
            },
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: {
                values: [], // Để trống lúc đầu, sẽ cập nhật trong useEffect
            },
            cellRenderer: (params) => {
                // Kiểm tra nếu values không trống
                const values = params.value;
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{params.value || ''}</span>
                        {values && values.length > 0 && params.data.XacNhanKiemKe !== 1 && (
                            <button
                                style={{
                                    color: 'blue',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'color 0.3s ease',
                                }}
                                onClick={() => {
                                    params.node.setDataValue(params.colDef.field, null);
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = 'red'; // Thay đổi màu sắc khi hover
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = 'blue'; // Đổi lại màu sắc khi không hover
                                }}
                            >
                                <i class="fa fa-times-circle" aria-hidden="true"></i>
                            </button>
                        )}
                    </div>
                );
            }
        },
        {
            headerName: 'Ngày kiểm kê',
            field: 'NgayKiemKe',
            width: 130,
            maxWidth: 130,
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
            headerName: 'Check Mã mới',
            field: 'CheckMaTaiSan',
            width: 150,
            maxWidth: 150,
        },
    ]);

    const rowClassRules = {
        'row-pink': (params) => {
            return params.data.IsCheckKiemKe === 0;
        },
        'row-yelow': (params) => {
            return params.data.KhoDuocSaiViTri_Id !== null;
        },
    };
    const gridOptions = {
        rowClassRules: rowClassRules,
        // Khi bắt đầu chỉnh sửa, đặt giá trị của ô về null hoặc trống
        onCellEditingStarted: (event) => {
            if (event.colDef.field === 'ViTriHienTai') {
                const currentValue = event.node.data.ViTriHienTai; // Lấy giá trị hiện tại của ô
                //console.log('onCellEditingStarted', currentValue)
                if (!currentValue) {
                    event.node.setDataValue(event.colDef.field, null); // Đặt lại giá trị của ô thành null khi bắt đầu chỉnh sửa
                }
            }
            else if (event.colDef.field === 'KhoaPhongHienTai') {
                const currentValue = event.node.data.KhoaPhongHienTai; // Lấy giá trị hiện tại của ô
                //console.log('onCellEditingStarted', currentValue)
                if (!currentValue) {
                    event.node.setDataValue(event.colDef.field, null); // Đặt lại giá trị của ô thành null khi bắt đầu chỉnh sửa
                }
            }
            else if (event.colDef.field === 'GhiChuHienTai') {
                const currentValue = event.node.data.GhiChuHienTai; // Lấy giá trị hiện tại của ô
                //console.log('onCellEditingStarted', currentValue)
                if (!currentValue) {
                    event.node.setDataValue(event.colDef.field, null); // Đặt lại giá trị của ô thành null khi bắt đầu chỉnh sửa
                }
            } else if (event.colDef.field === 'TinhTrang') {
                const currentValue = event.node.data.TinhTrang; // Lấy giá trị hiện tại của ô
                //console.log('onCellEditingStarted', currentValue)
                if (!currentValue) {
                    event.node.setDataValue(event.colDef.field, null); // Đặt lại giá trị của ô thành null khi bắt đầu chỉnh sửa
                }
            }
        },

        // Khi hoàn thành việc chỉnh sửa ô, kiểm tra nếu người dùng không chọn gì thì giữ giá trị là null
        onCellEditingStopped: async (event) => {
            const { api, column, rowIndex } = event;
            if (event.colDef.field === 'ViTriHienTai') {

                if (!event.newValue || event.newValue === optionsViTri[0]?.value) {
                    // Nếu không có lựa chọn hợp lệ, đặt lại ô thành null
                    event.node.setDataValue(event.colDef.field, null);
                    //console.log("Giá trị khi dừng chỉnh sửa ko có values:", dataEdit);
                } else {
                    const ViTriHienTai = event.newValue;
                    //console.log('ViTriHienTai', event)
                    const rowId = event.data.id;
                    const dataEdit = {
                        ViTriHienTai: ViTriHienTai,
                        rowId: rowId,
                        col: 'ViTriHienTai',
                    };
                    setDataEdit(dataEdit);
                    // console.log("Giá trị khi dừng chỉnh sửa có values:", dataEdit);
                    if (!socket || !socket.connected) {
                        try {
                            let res = await getUrl();
                            if (res && res.errCode === 0) {
                                const newSocket = io(res.url, {
                                    transports: ['websocket']
                                });

                                // Lắng nghe sự kiện kết nối
                                newSocket.on('connect', () => {
                                    setSocket(newSocket);
                                });

                                // Lắng nghe sự kiện lỗi kết nối
                                newSocket.on('connect_error', (error) => {
                                    console.error('Failed to connect to server:', error);
                                });

                                // Đặt lại socket nếu không kết nối thành công
                                newSocket.on('disconnect', () => {
                                    setSocket(null); // Đặt lại socket nếu cần
                                });

                                // Đợi kết nối thành công và gửi sự kiện
                                newSocket.on('connect', async () => {
                                    try {
                                        const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                                        //console.log('DotKiemKe_Id', DotKiemKe_Id)
                                        let res = await editKhoaPhongHienTai(dataEdit);  // Gọi API
                                        if (res && res.errCode === 0) {
                                            newSocket.emit('edit_vitrihientai_server', { DotKiemKe_Id: DotKiemKe_Id, errMessage: res.errMessage });
                                            //toast.success(res.errMessage);
                                        } else {
                                            //onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                                            toast.warning(res.errMessage);
                                        }
                                    } catch (error) {
                                        console.error('Lỗi:', error);
                                    }
                                });
                            } else {
                                console.error('Error fetching URL: Invalid response');
                            }
                        } catch (error) {
                            console.error('Error fetching URL_VIEW:', error);
                        }
                    } else {

                    }
                }
            } else if (event.colDef.field === 'KhoaPhongHienTai') {

                if (!event.newValue || event.newValue === optionsViTri[0]?.value) {
                    // Nếu không có lựa chọn hợp lệ, đặt lại ô thành null
                    event.node.setDataValue(event.colDef.field, null);
                    //console.log("Giá trị khi dừng chỉnh sửa ko có values:", dataEdit);
                } else {
                    const KhoaPhongHienTai = event.newValue; // Lấy giá trị `sopo` từ dữ liệu hàng
                    const rowId = event.data.id;
                    const dataEdit = {
                        KhoaPhongHienTai: KhoaPhongHienTai,
                        rowId: rowId,
                        col: 'KhoaPhongHienTai',
                    };
                    setDataEdit(dataEdit);
                    // console.log("Giá trị khi dừng chỉnh sửa có values:", dataEdit);
                    if (!socket || !socket.connected) {
                        try {
                            let res = await getUrl();
                            if (res && res.errCode === 0) {
                                const newSocket = io(res.url, {
                                    transports: ['websocket']
                                });

                                // Lắng nghe sự kiện kết nối
                                newSocket.on('connect', () => {
                                    setSocket(newSocket);
                                });

                                // Lắng nghe sự kiện lỗi kết nối
                                newSocket.on('connect_error', (error) => {
                                    console.error('Failed to connect to server:', error);
                                });

                                // Đặt lại socket nếu không kết nối thành công
                                newSocket.on('disconnect', () => {
                                    setSocket(null); // Đặt lại socket nếu cần
                                });

                                // Đợi kết nối thành công và gửi sự kiện
                                newSocket.on('connect', async () => {
                                    try {
                                        const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                                        let res = await editKhoaPhongHienTai(dataEdit);  // Gọi API
                                        if (res && res.errCode === 0) {
                                            newSocket.emit('edit_khoaphonghientai_server', { DotKiemKe_Id: DotKiemKe_Id, errMessage: res.errMessage });
                                            //toast.success(res.errMessage);
                                        } else {
                                            //onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                                            toast.warning(res.errMessage);
                                        }
                                    } catch (error) {
                                        console.error('Lỗi:', error);
                                    }
                                });
                            } else {
                                console.error('Error fetching URL: Invalid response');
                            }
                        } catch (error) {
                            console.error('Error fetching URL_VIEW:', error);
                        }
                    } else {

                    }
                }

            } else if (event.colDef.field === 'GhiChuHienTai') {
                //console.log("GhiChuHienTai stop", event);
                // if (!event.newValue || event.newValue === optionsViTri[0]?.value) {
                //     // Nếu không có lựa chọn hợp lệ, đặt lại ô thành null
                //     event.node.setDataValue(event.colDef.field, null);
                //     //console.log("Giá trị khi dừng chỉnh sửa ko có values:", dataEdit);
                // } else {
                const GhiChuHienTai = event.newValue;
                const rowId = event.data.id;
                const dataEdit = {
                    GhiChuHienTai: GhiChuHienTai,
                    rowId: rowId,
                    col: 'GhiChuHienTai',
                };
                setDataEdit(dataEdit);
                // console.log("Giá trị khi dừng chỉnh sửa có values:", dataEdit);
                if (!socket || !socket.connected) {
                    try {
                        let res = await getUrl();
                        if (res && res.errCode === 0) {
                            const newSocket = io(res.url, {
                                transports: ['websocket']
                            });

                            // Lắng nghe sự kiện kết nối
                            newSocket.on('connect', () => {
                                setSocket(newSocket);
                            });

                            // Lắng nghe sự kiện lỗi kết nối
                            newSocket.on('connect_error', (error) => {
                                console.error('Failed to connect to server:', error);
                            });

                            // Đặt lại socket nếu không kết nối thành công
                            newSocket.on('disconnect', () => {
                                setSocket(null); // Đặt lại socket nếu cần
                            });

                            // Đợi kết nối thành công và gửi sự kiện
                            newSocket.on('connect', async () => {
                                try {
                                    const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                                    let res = await editKhoaPhongHienTai(dataEdit);  // Gọi API
                                    if (res && res.errCode === 0) {
                                        newSocket.emit('edit_ghichuhientai_server', { DotKiemKe_Id: DotKiemKe_Id, errMessage: res.errMessage });
                                        //toast.success(res.errMessage);
                                    } else {
                                        //onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                                        toast.warning(res.errMessage);
                                    }
                                } catch (error) {
                                    console.error('Lỗi:', error);
                                }
                            });
                        } else {
                            console.error('Error fetching URL: Invalid response');
                        }
                    } catch (error) {
                        console.error('Error fetching URL_VIEW:', error);
                    }
                } else {

                }
                // }
            } else if (event.colDef.field === 'TinhTrang') {

                if (!event.newValue || event.newValue === optionsTinhTrang[0]?.value) {
                    // Nếu không có lựa chọn hợp lệ, đặt lại ô thành null
                    event.node.setDataValue(event.colDef.field, null);
                    //console.log("Giá trị khi dừng chỉnh sửa ko có values:", dataEdit);
                } else {
                    const TinhTrang = event.newValue; // Lấy giá trị `sopo` từ dữ liệu hàng
                    const rowId = event.data.id;
                    const dataEdit = {
                        TinhTrang: TinhTrang,
                        rowId: rowId,
                        col: 'TinhTrang',
                    };
                    setDataEdit(dataEdit);
                    // console.log("Giá trị khi dừng chỉnh sửa có values:", dataEdit);
                    if (!socket || !socket.connected) {
                        try {
                            let res = await getUrl();
                            if (res && res.errCode === 0) {
                                const newSocket = io(res.url, {
                                    transports: ['websocket']
                                });

                                // Lắng nghe sự kiện kết nối
                                newSocket.on('connect', () => {
                                    setSocket(newSocket);
                                });

                                // Lắng nghe sự kiện lỗi kết nối
                                newSocket.on('connect_error', (error) => {
                                    console.error('Failed to connect to server:', error);
                                });

                                // Đặt lại socket nếu không kết nối thành công
                                newSocket.on('disconnect', () => {
                                    setSocket(null); // Đặt lại socket nếu cần
                                });

                                // Đợi kết nối thành công và gửi sự kiện
                                newSocket.on('connect', async () => {
                                    try {
                                        const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                                        let res = await editKhoaPhongHienTai(dataEdit);  // Gọi API
                                        if (res && res.errCode === 0) {
                                            newSocket.emit('edit_tinhtranghientai_server', { DotKiemKe_Id: DotKiemKe_Id, errMessage: res.errMessage });
                                            //toast.success(res.errMessage);
                                        } else {
                                            //onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                                            toast.warning(res.errMessage);
                                        }
                                    } catch (error) {
                                        console.error('Lỗi:', error);
                                    }
                                });
                            } else {
                                console.error('Error fetching URL: Invalid response');
                            }
                        } catch (error) {
                            console.error('Error fetching URL_VIEW:', error);
                        }
                    } else {

                    }
                }
            }
        },
    };


    const onGridReady = (params) => {
        gridApiRef.current = params.api; // Lưu gridApi vào gridApiRef
    };

    const [defaultColDef, setdefaultColDef] = useState(
        {
            sortable: true,
            suppressHorizontalScroll: true,
            floatingFilter: true,
            filter: 'agTextColumnFilter',
            floatingFilterComponentParams: { suppressFilterButton: true },
            floatingFilterComponent: ClearableFloatingFilter,
            suppressMenu: true,
            unSortIcon: true,
            resizable: true,
            minWidth: 300,
            flex: 1
        }
    );

    const handleCellValueChanged = async (event) => {
        const rowId = event.data.id;
        if (event.colDef.field === 'ViTriHienTai') {
            const selectedValue = event.newValue || ''; // Nếu chưa chọn giá trị, trả về chuỗi rỗng
            //console.log('selectedValue', selectedValue)
            const dataEdit = {
                ViTriHienTai: selectedValue,
                rowId: rowId,
                col: 'ViTriHienTai',
            };
            setDataEdit(dataEdit);
            if (selectedValue === '') {
                try {
                    let res = await editKhoaPhongHienTai(dataEdit);  // Gọi API
                    if (res && res.errCode === 0) {
                        //newSocket.emit('edit_khoaphonghientai_server', { data: res });  // Emit socket nếu thành công
                        //toast.success(res.errMessage);
                    } else {
                        //onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                        toast.warning(res.errMessage);
                    }
                } catch (error) {
                    console.error('Lỗi:', error);
                }
            }
            //console.log("Giá trị đã chọn handleCellValueChanged:", dataEdit);
        } else if (event.colDef.field === 'KhoaPhongHienTai') {
            const selectedValue = event.newValue || ''; // Nếu chưa chọn giá trị, trả về chuỗi rỗng
            //console.log('selectedValue', selectedValue)
            const dataEdit = {
                KhoaPhongHienTai: selectedValue,
                rowId: rowId,
                col: 'KhoaPhongHienTai',
            };
            setDataEdit(dataEdit);
            if (selectedValue === '') {
                try {
                    let res = await editKhoaPhongHienTai(dataEdit);  // Gọi API
                    if (res && res.errCode === 0) {
                        //newSocket.emit('edit_khoaphonghientai_server', { data: res });  // Emit socket nếu thành công
                        //toast.success(res.errMessage);
                    } else {
                        //onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                        toast.warning(res.errMessage);
                    }
                } catch (error) {
                    console.error('Lỗi:', error);
                }
            }
            //console.log("Giá trị đã chọn handleCellValueChanged:", dataEdit);

        } else if (event.colDef.field === 'GhiChuHienTai') {
            const selectedValue = event.newValue || ''; // Nếu chưa chọn giá trị, trả về chuỗi rỗng
            //console.log('GhiChuHienTai', selectedValue)
            const dataEdit = {
                GhiChuHienTai: selectedValue,
                rowId: rowId,
                col: 'GhiChuHienTai',
            };
            setDataEdit(dataEdit);
            if (selectedValue === '') {
                try {
                    let res = await editKhoaPhongHienTai(dataEdit);  // Gọi API
                    if (res && res.errCode === 0) {
                        //newSocket.emit('edit_khoaphonghientai_server', { data: res });  // Emit socket nếu thành công
                        //toast.success(res.errMessage);
                    } else {
                        //onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                        toast.warning(res.errMessage);
                    }
                } catch (error) {
                    console.error('Lỗi:', error);
                }
            }
        } else if (event.colDef.field === 'TinhTrang') {
            const selectedValue = event.newValue || ''; // Nếu chưa chọn giá trị, trả về chuỗi rỗng
            //console.log('selectedValue', selectedValue)
            const dataEdit = {
                TinhTrang: selectedValue,
                rowId: rowId,
                col: 'TinhTrang',
            };
            setDataEdit(dataEdit);
            if (selectedValue === '') {
                try {
                    let res = await editKhoaPhongHienTai(dataEdit);  // Gọi API
                    if (res && res.errCode === 0) {
                        //newSocket.emit('edit_khoaphonghientai_server', { data: res });  // Emit socket nếu thành công
                        //toast.success(res.errMessage);
                    } else {
                        //onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                        toast.warning(res.errMessage);
                    }
                } catch (error) {
                    console.error('Lỗi:', error);
                }
            }
            //console.log("Giá trị đã chọn handleCellValueChanged:", dataEdit);
        }
    };


    const getAllKho = async () => {
        let response = await fetchAllKho();
        const data = response.data.map(item => ({
            value: item.KhoTaiSan_Id,
            label: item.TenKho
        }));
        //console.log('Fetched options:', data); // Kiểm tra dữ liệu đã được lấy

        if (response && response.errCode === 0) {
            setOptionsKho(data); // Cập nhật danh sách kho
        }
    };

    const getAllKhoQLTK = async () => {
        let response = await fetchAllKhoQLTK();
        const data = response.data.map(item => ({
            value: item.TenKhoQuanLyTimKiem,
            label: item.TenKhoQuanLyTimKiem
        }));
        //console.log('Fetched options:', data); // Kiểm tra dữ liệu đã được lấy

        if (response && response.errCode === 0) {
            setOptionsKhoQLTK(data); // Cập nhật danh sách kho
        }
    };

    const getAllKhoTimKiem = async () => {
        let response = await fetchAllKho();
        const data = response.data.map(item => ({
            value: item.KhoTaiSan_Id,
            label: item.TenKho
        }));
        //console.log('Fetched options:', data); // Kiểm tra dữ liệu đã được lấy

        if (response && response.errCode === 0) {
            setOptionsKhoTimKiem(data); // Cập nhật danh sách kho
        }
    };


    const getAllViTri = async () => {
        let response = await fetchAllViTri();
        const data = response.data.map(item => ({
            value: item.ViTri_Id,
            label: item.TenViTri
        }));
        //console.log('Fetched options:', data); // Kiểm tra dữ liệu đã được lấy

        if (response && response.errCode === 0) {
            setOptionsViTri(data); // Cập nhật danh sách kho
        }
    };


    const handleButtonTimKiem = async () => {
        try {
            const TimKiemKhoTaiSan_Id = sessionStorage.getItem('TimKiemKhoTaiSan_Id');
            const TimKiemKhoQuanLy = sessionStorage.getItem('TimKiemKhoQuanLy');
            if (TimKiemKhoTaiSan_Id) {
                if (TimKiemKhoQuanLy) {
                    //console.log('chạy a')
                    const data = { TuNgay, DenNgay, TimKiemKhoTaiSan_Id, TimKiemKhoQuanLy };
                    let res = await timkiemDataKiemKe(data);
                    if (res && res.errCode === 0) {
                        const DotKiemKe_Id = res.data[0]?.DotKiemKe_Id;
                        sessionStorage.setItem('DotKiemKe_Id', DotKiemKe_Id);
                        toast.success(res.errMessage)
                        setRowData(res.data)
                        setTuNgay('')
                        setDenNgay('')
                    } else {
                        toast.warning(res.errMessage)
                    }
                } else {
                    toast.warning('Vui lòng chọn kho quản lý')
                }
            } else {
                //console.log('TimKiemKhoQuanLy', TimKiemKhoQuanLy)
                if (!TimKiemKhoQuanLy) {
                    toast.warning('Vui lòng chọn kho quản lý')
                }
                else {
                    const data = { TimKiemKhoQuanLy, TuNgay, DenNgay };
                    let res = await timkiemDataKiemKe(data);
                    if (res && res.errCode === 0) {
                        toast.success(res.errMessage)
                        setRowData(res.data)
                    } else {
                        toast.warning(res.errMessage)
                    }
                }
            }
        } catch (e) {
            //setLoadingDongBo(false);
            toast.error('Đã xảy ra lỗi khi lấy thông tin!');
        }
    };

    const handleButtonIn = async () => {
        try {
            const TimKiemKhoTaiSan_Id = sessionStorage.getItem('TimKiemKhoTaiSan_Id');
            const TimKiemKhoQuanLy = sessionStorage.getItem('TimKiemKhoQuanLy');
            //console.log('TimKiemKhoTaiSan_Id',TimKiemKhoTaiSan_Id)
            if (rowData.length > 0) {
                if (TimKiemKhoTaiSan_Id) {
                    if (TimKiemKhoQuanLy === 'TẤT CẢ KHO') {
                        const modifiedData = { rowData: rowData, Nhom: 'inkiemketong' };
                        setShowModalInKiemKeTong(true);
                        setDataXacNhanKiemKe(modifiedData);
                    } else {
                        const modifiedData = { rowData: rowData, Nhom: 'inkiemke' };
                        setShowModalInKiemKe(true);
                        setDataXacNhanKiemKe(modifiedData);
                    }
                } else {
                    const modifiedData = { rowData: rowData, Nhom: 'inkiemketong' };
                    setShowModalInKiemKeTong(true);
                    setDataXacNhanKiemKe(modifiedData);
                }
            } else {
                toast.warning('Không có dữ liệu để in')
            }
        } catch (e) {
            //setLoadingDongBo(false);
            toast.error('Đã xảy ra lỗi khi lấy thông tin!');
        }
    };
    //<td>\${item.XacNhanKiemKe === 1 ? 'Đã xác nhận' : 'Chưa xác nhận'}</td>


    const handleXacNhanKiemKe = async () => {
        try {
            const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
            const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');
            const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
            const data = rowData;
            let res_action = await handleGetAction(actionXacNhanKiemKe);
            if (res_action && res_action.errCode === 0) {
                const modifiedData = { data: data, DotKiemKe_Id: DotKiemKe_Id, KhoTaiSan_Id: KhoTaiSan_Id, KhoQuanLy: KhoQuanLy, UserId: UserId, Nhom: 'xacnhankiemke' };
                setDataXacNhanKiemKe(modifiedData);
                setShowModalXacNhanKiemKe(true);
            }
        } catch (e) {
            //setLoadingImport(false);
            console.error('Lỗi:', e);
        }
    };

    const handleThemTaiSan = async () => {
        try {
            const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
            const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
            sessionStorage.removeItem('MaTaiSan');
            const data = rowData;
            let res_action = await handleGetAction(actionThemTaiSan);
            if (res_action && res_action.errCode === 0) {
                const modifiedData = { data: data, DotKiemKe_Id: DotKiemKe_Id, KhoTaiSan_Id: KhoTaiSan_Id, UserId: UserId, Nhom: 'themtaisan' };
                setDataXacNhanKiemKe(modifiedData);
                setShowModalThemTaiSan(true);
            }
        } catch (e) {
            //setLoadingImport(false);
            console.error('Lỗi:', e);
        }
    };

    const handleHuyXacNhanKiemKe = async () => {
        try {
            const TimKiemKhoTaiSan_Id = sessionStorage.getItem('TimKiemKhoTaiSan_Id');
            const TimKiemKhoQuanLy = sessionStorage.getItem('TimKiemKhoQuanLy');
            //console.log('KhoTaiSan_Id', KhoTaiSan_Id)
            //console.log('TimKiemKhoTaiSan_Id', TimKiemKhoTaiSan_Id)
            if (TimKiemKhoTaiSan_Id) {
                const data = rowData;
                const KhoTaiSan_Id = TimKiemKhoTaiSan_Id
                const KhoQuanLy = TimKiemKhoQuanLy
                let res_action = await handleGetAction(actionHuyXacNhanKiemKe);
                if (res_action && res_action.errCode === 0) {
                    const modifiedData = { data: data, KhoTaiSan_Id: KhoTaiSan_Id, KhoQuanLy: KhoQuanLy, UserId: UserId, Nhom: 'huyxacnhankiemke' };
                    setDataXacNhanKiemKe(modifiedData);
                    setShowModalHuyXacNhanKiemKe(true);
                }
            } else {
                toast.warning('Vui lòng chọn tài sản theo phòng ban để hủy xác nhận')
            }
        } catch (e) {
            //setLoadingImport(false);
            console.error('Lỗi:', e);
        }
    };


    // Tải dữ liệu từ API khi component mount
    useEffect(() => {
        const fetchViTriData = async () => {
            const response = await fetchAllViTri();
            const data = response.data.map(item => ({
                value: item.ViTri_Id,
                label: item.TenViTri,
            }));
            //console.log('Options Kho sau khi gọi API:', data);

            if (response && response.errCode === 0) {
                setOptionsViTri(data); // Cập nhật state của danh sách kho
            }
        };
        fetchViTriData();
    }, []);

    const getAllKhoEdit = async () => {
        let response = await fetchAllKhoEdit();
        const data = response.data.map(item => ({
            value: item.KhoTaiSan_Id,
            label: item.TenKho
        }));
        //console.log('Fetched options:', data); // Kiểm tra dữ liệu đã được lấy

        if (response && response.errCode === 0) {
            setOptionsKhoEdit(data); // Cập nhật danh sách kho
        }
    };


    // Tải dữ liệu từ API khi component mount
    useEffect(() => {
        const fetchKhoEditData = async () => {
            const response = await fetchAllKhoEdit();
            const data = response.data.map(item => ({
                value: item.KhoTaiSan_Id,
                label: item.TenKho,
            }));
            //console.log('Options Kho sau khi gọi API:', data);

            if (response && response.errCode === 0) {
                setOptionsKhoEdit(data); // Cập nhật state của danh sách kho
            }
        };
        fetchKhoEditData();
    }, []);

    const getAllTinhTrang = async () => {
        let response = await fetchAllTinhTrang();
        const data = response.data.map(item => ({
            value: item.TinhTrang_Id,
            label: item.TenTinhTrang
        }));
        //console.log('Fetched options:', data); // Kiểm tra dữ liệu đã được lấy

        if (response && response.errCode === 0) {
            setOptionsTinhTrang(data); // Cập nhật danh sách kho
        }
    };

    // Tải dữ liệu từ API khi component mount
    useEffect(() => {
        const fetchTinhTrangData = async () => {
            const response = await fetchAllTinhTrang();
            const data = response.data.map(item => ({
                value: item.TinhTrang_Id,
                label: item.TenTinhTrang,
            }));
            //console.log('Options Kho sau khi gọi API:', data);

            if (response && response.errCode === 0) {
                setOptionsTinhTrang(data); // Cập nhật state của danh sách kho
            }
        };
        fetchTinhTrangData();
    }, []);




    useEffect(() => {
        // Tạo bản sao của `columnDefs` để tránh thay đổi trực tiếp
        let updatedColumnDefs = [...columnDefs];

        if (gridRef.current && gridRef.current.api) {
            // // **1. Kiểm tra và cập nhật `ViTriHienTai` nếu `optionsViTri` có dữ liệu**
            if (optionsViTri.length > 0) {
                const updatedOptionsViTri = [{ value: null, label: '' }, ...optionsViTri];

                // Cập nhật lại `columnDefs` cho cột `ViTriHienTai`
                updatedColumnDefs = updatedColumnDefs.map((colDef) => {
                    if (colDef.field === 'ViTriHienTai') {
                        return {
                            ...colDef,
                            cellEditorParams: {
                                values: updatedOptionsViTri.map(option => option.label), // Cập nhật danh sách giá trị
                                //values: ['Phòng 101', 'Phòng 102', 'Phòng 201', 'Phòng 202'],
                                filterList: true,  // Cho phép lọc trong dropdown
                                //searchType: 'match', // Loại tìm kiếm trong dropdown
                                allowTyping: true, // Cho phép người dùng nhập vào
                                valueListMaxHeight: 220, // Độ cao tối đa của danh sách
                                filterParams: {
                                    filterOptions: ['contains'],  // Tìm kiếm bất kỳ phần nào của chuỗi
                                    debounceMs: 500,  // Thời gian trễ để tối ưu hiệu suất tìm kiếm
                                },
                            },
                        };
                    }
                    return colDef;
                });
            }

            // **2. Kiểm tra và cập nhật `KhoaPhongHienTai` nếu `optionsKhoEdit` có dữ liệu**
            if (optionsKhoEdit.length > 0) {
                const updatedOptionsKho = [{ value: null, label: '' }, ...optionsKhoEdit];

                // Cập nhật lại `columnDefs` cho cột `KhoaPhongHienTai`
                updatedColumnDefs = updatedColumnDefs.map((colDef) => {
                    if (colDef.field === 'KhoaPhongHienTai') {
                        return {
                            ...colDef,
                            cellEditorParams: {
                                values: updatedOptionsKho.map(option => option.label), // Cập nhật danh sách giá trị
                                //values: ['Phòng 101', 'Phòng 102', 'Phòng 201', 'Phòng 202'],
                                filterList: true,  // Cho phép lọc trong dropdown
                                //searchType: 'match', // Loại tìm kiếm trong dropdown
                                allowTyping: true, // Cho phép người dùng nhập vào
                                valueListMaxHeight: 220, // Độ cao tối đa của danh sách
                                filterParams: {
                                    filterOptions: ['contains'],  // Tìm kiếm bất kỳ phần nào của chuỗi
                                    debounceMs: 500,  // Thời gian trễ để tối ưu hiệu suất tìm kiếm
                                },
                            },
                        };
                    }
                    return colDef;
                });
            }

            // **3. Kiểm tra và cập nhật `TinhTrang` nếu `optionsTinhTrang` có dữ liệu**
            if (optionsTinhTrang.length > 0) {
                const updatedOptionsTinhTrang = [{ value: null, label: '' }, ...optionsTinhTrang];

                // Cập nhật lại `columnDefs` cho cột `TinhTrang`
                updatedColumnDefs = updatedColumnDefs.map((colDef) => {
                    if (colDef.field === 'TinhTrang') {
                        return {
                            ...colDef,
                            cellEditorParams: {
                                values: updatedOptionsTinhTrang.map(option => option.label), // Cập nhật danh sách giá trị
                                filterList: true,  // Cho phép lọc trong dropdown
                                searchType: 'match', // Loại tìm kiếm trong dropdown
                                allowTyping: true, // Cho phép người dùng nhập vào
                                valueListMaxHeight: 220, // Độ cao tối đa của danh sách
                            },
                        };
                    }
                    return colDef;
                });
            }

            // **4. Cập nhật `columnDefs` trong state**
            setColumnDefs(updatedColumnDefs);
            //gridRef.current.api.setColumnDefs(updatedColumnDefs);

            // **5. Refresh cells để cập nhật lại dropdown cho các cột đã xử lý**
            gridRef.current.api.refreshCells({
                force: true,
                columns: ['ViTriHienTai', 'KhoaPhongHienTai', 'TinhTrang'],
            });
        }

        // Log kiểm tra `columnDefs` sau khi đã được cập nhật
        //console.log('Updated columnDefs:', updatedColumnDefs);
    }, [optionsViTri, optionsKhoEdit, optionsTinhTrang]);


    const getAllKhoQL = async () => {
        let response = await fetchAllKhoQL();
        //console.log('getAllKhoQL', response.data)
        const data = response.data.map(item => ({
            value: item.KhoaQuanLy,
            label: item.KhoaQuanLy // Sử dụng KhoaQuanLy làm cả value và label
        }));
        // console.log('Fetched options:', data); // Kiểm tra dữ liệu đã được lấy

        if (response && response.errCode === 0) {
            setOptionsKhoQL(data); // Cập nhật danh sách kho
        }
    };


    useEffect(() => {
        if (dataEdit) {
            //console.log('useEffect', dataEdit)
        }
    }, [dataEdit]);

    const handleLoadSerial = async () => {
        try {
            const DotKiemKe_Id = rowData[0]?.DotKiemKe_Id;
            const KhoaPhongHienTai = rowData[0]?.KhoaPhongSuDung;
            const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
            const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');
            setLoadingSearchSR(true);
            if (KhoQuanLy) {
                sessionStorage.setItem('DotKiemKe_Id', DotKiemKe_Id)
                sessionStorage.removeItem('MaTaiSan');
                sessionStorage.removeItem('Serial');
                sessionStorage.setItem('Serial', Serial);
                let res = await getSerialKiemKe(Serial, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai);
                if (res && res.errCode === 0) {
                    socket.emit('serial_kiemke_server', { DotKiemKe_Id: DotKiemKe_Id });
                    toast.success(res.errMessage)
                    setMaTaiSan('');
                    setLoadingSearchSR(false);
                } else {
                    //console.log('res', res)
                    toast.warning(res.errMessage)
                    setMaTaiSan('');
                    setLoadingSearchSR(false);
                }
            } else {
                sessionStorage.removeItem('MaTaiSan');
                sessionStorage.removeItem('Serial');
                sessionStorage.setItem('Serial', Serial);
                let res = await getSerialKiemKe(Serial, KhoTaiSan_Id, null, UserId, DotKiemKe_Id, KhoaPhongHienTai);
                if (res && res.errCode === 0) {
                    socket.emit('serial_kiemke_server', { DotKiemKe_Id: DotKiemKe_Id });
                    toast.success(res.errMessage)
                    setSerial('');
                    setLoadingSearchSR(false);
                } else {
                    toast.warning(res.errMessage)
                    setSerial('');
                    setLoadingSearchSR(false);
                }
            }
        } catch (e) {
            //setLoading(false);
            console.error('Lỗi:', e);
        }
    };

    const handleKeyDownSerial = (e) => {
        if (e.key === 'Enter') {
            handleLoadSerial(); // Gọi hàm khi nhấn Enter
        }
    };

    const handleLoadMaTaiSan = async () => {
        try {
            const DotKiemKe_Id = rowData[0]?.DotKiemKe_Id;
            const KhoaPhongHienTai = rowData[0]?.KhoaPhongSuDung;
            //console.log('KhoaPhongHienTai', rowData)
            const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
            const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');

            setLoadingSearchMTS(true);
            if (KhoQuanLy) {
                //console.log('KhoQuanLy', KhoQuanLy)
                sessionStorage.setItem('DotKiemKe_Id', DotKiemKe_Id)
                sessionStorage.removeItem('Serial');
                sessionStorage.removeItem('MaTaiSan');
                sessionStorage.setItem('MaTaiSan', MaTaiSan);
                let res = await getMaTaiSanKiemKe(MaTaiSan, KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id, KhoaPhongHienTai);
                if (res && res.errCode === 0) {
                    socket.emit('mataisan_kiemke_server', { DotKiemKe_Id: DotKiemKe_Id });
                    // const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
                    // const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');
                    // const MaTaiSan = sessionStorage.getItem('MaTaiSan');
                    // //console.log('KhoQuanLy', KhoQuanLy)
                    // if (KhoQuanLy) {
                    //     getTaiSanTheoKhoQL_KiemKe(KhoTaiSan_Id, KhoQuanLy);
                    // } else {
                    //     //console.log('MaTaiSan useEffect', MaTaiSan)
                    //     getTaiSanTheoKho_KiemKe(KhoTaiSan_Id);
                    // }
                    // //getAllTaiSan();
                    // setSocketEventReceived(true);

                    toast.success(res.errMessage)
                    setMaTaiSan('');
                    setLoadingSearchMTS(false);
                } else {
                    //console.log('res', res)
                    toast.warning(res.errMessage)
                    setMaTaiSan('');
                    setLoadingSearchMTS(false);
                }
            } else {
                sessionStorage.removeItem('Serial');
                sessionStorage.removeItem('MaTaiSan');
                sessionStorage.setItem('MaTaiSan', MaTaiSan);
                let res = await getMaTaiSanKiemKe(MaTaiSan, KhoTaiSan_Id, null, UserId, DotKiemKe_Id, KhoaPhongHienTai);
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (res && res.errCode === 0) {
                    socket.emit('mataisan_kiemke_server', { DotKiemKe_Id: DotKiemKe_Id });
                    // const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
                    // const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');
                    // const MaTaiSan = sessionStorage.getItem('MaTaiSan');
                    // //console.log('KhoQuanLy', KhoQuanLy)
                    // if (KhoQuanLy) {
                    //     getTaiSanTheoKhoQL_KiemKe(KhoTaiSan_Id, KhoQuanLy);
                    // } else {
                    //     //console.log('MaTaiSan useEffect', MaTaiSan)
                    //     getTaiSanTheoKho_KiemKe(KhoTaiSan_Id);
                    // }
                    // //getAllTaiSan();
                    // setSocketEventReceived(true);

                    toast.success(res.errMessage)
                    setMaTaiSan('');
                    setLoadingSearchMTS(false);
                } else {
                    toast.warning(res.errMessage)
                    setMaTaiSan('');
                    setLoadingSearchMTS(false);
                }
            }
        } catch (e) {
            //setLoading(false);
            console.error('Lỗi:', e);
        }
    };

    // Sử dụng debounce để chỉ gọi API khi người dùng ngừng nhập trong 300ms
    const debouncedHandleLoadMaTaiSan = debounce(() => {
        if (MaTaiSan) {
            handleLoadMaTaiSan();
        }
    }, 300);

    // Lắng nghe thay đổi của MaTaiSan và chỉ gọi debouncedHandleLoadMaTaiSan khi nó thay đổi
    useEffect(() => {
        debouncedHandleLoadMaTaiSan();
        return () => debouncedHandleLoadMaTaiSan.cancel();
    }, [MaTaiSan]);


    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (urlFetched) {
            console.log('res urlView', urlFetched, urlView)
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

            return () => {
                newSocket.disconnect();
            };
        }
    }, [urlFetched, urlView]);

    useEffect(() => {
        if (socket && !socketEventReceived) {
            socket.on("mataisan_kiemke_client", (data) => {
                const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
                const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');
                const MaTaiSan = sessionStorage.getItem('MaTaiSan');
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (parseInt(data.DotKiemKe_Id, 10) === parseInt(DotKiemKe_Id, 10)) {
                    if (KhoQuanLy) {
                        getTaiSanTheoKhoQL_KiemKe(KhoTaiSan_Id, KhoQuanLy);
                    } else {
                        //console.log('MaTaiSan useEffect', MaTaiSan)
                        getTaiSanTheoKho_KiemKe(KhoTaiSan_Id);
                    }
                    //getAllTaiSan();
                    setSocketEventReceived(true);
                }
            });

            socket.on("serial_kiemke_client", (data) => {
                const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
                const KhoQuanLy = sessionStorage.getItem('KhoQuanLy');
                const Serial = sessionStorage.getItem('Serial');
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (parseInt(data.DotKiemKe_Id, 10) === parseInt(DotKiemKe_Id, 10)) {
                    if (KhoQuanLy) {
                        getTaiSanTheoKhoQL_KiemKe(KhoTaiSan_Id, KhoQuanLy);
                    } else {
                        //console.log('MaTaiSan useEffect', MaTaiSan)
                        getTaiSanTheoKho_KiemKe(KhoTaiSan_Id);
                    }
                    //getAllTaiSan();
                    setSocketEventReceived(true);
                }
            });

            socket.on("edit_khoaphonghientai_client", (data) => {
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (parseInt(data.DotKiemKe_Id, 10) === parseInt(DotKiemKe_Id, 10)) {
                    console.log('edit_khoaphonghientai_client', data.errMessage, data.DotKiemKe_Id, DotKiemKe_Id)
                    toast.success(data.errMessage);
                }
            });

            socket.on("edit_vitrihientai_client", (data) => {
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (parseInt(data.DotKiemKe_Id, 10) === parseInt(DotKiemKe_Id, 10)) {
                    console.log('edit_vitrihientai_client', data.errMessage, data.DotKiemKe_Id, DotKiemKe_Id)
                    toast.success(data.errMessage);
                }
            });

            socket.on("edit_ghichuhientai_client", (data) => {

                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (parseInt(data.DotKiemKe_Id, 10) === parseInt(DotKiemKe_Id, 10)) {
                    console.log('edit_ghichuhientai_client', data.errMessage, data.DotKiemKe_Id, DotKiemKe_Id)
                    toast.success(data.errMessage);
                }
            });

            socket.on("edit_tinhtranghientai_client", (data) => {
                //console.log('edit_ghichuhientai_client', data)
                const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
                if (parseInt(data.DotKiemKe_Id, 10) === parseInt(DotKiemKe_Id, 10)) {
                    console.log('edit_tinhtranghientai_client', data.errMessage, data.DotKiemKe_Id, DotKiemKe_Id)
                    toast.success(data.errMessage);
                }
            });
        }

        // return () => {
        //     if (socket) {
        //         socket.off('mataisan_kiemke_client');
        //         socket.off('serial_kiemke_client');
        //         socket.off('edit_khoaphonghientai_client');
        //         socket.off('edit_vitrihientai_client');
        //         socket.off('edit_ghichuhientai_client');
        //         socket.off('edit_tinhtranghientai_client')
        //     }
        // };
    }, [socket, socketEventReceived]);

    useEffect(() => {
        return () => {
            setSocketEventReceived(false);
        };
    }, []);

    useEffect(() => {
        if (socketEventReceived) {
            //console.log('MaTaiSan socketEventReceived', MaTaiSan)
            console.log('Socket event received');
        }
    }, [socketEventReceived]);

    useEffect(() => {
        const fetchKho = async () => {
            await getAllKho();
        };
        fetchKho();
    }, []);

    useEffect(() => {
        const fetchKhoTimKiem = async () => {
            await getAllKhoTimKiem();
        };
        fetchKhoTimKiem();
    }, []);

    useEffect(() => {
        const fetchKhoQLTK = async () => {
            await getAllKhoQLTK();
        };
        fetchKhoQLTK();
    }, []);

    useEffect(() => {
        const fetchViTri = async () => {
            await getAllViTri();
        };
        fetchViTri();
    }, []);

    useEffect(() => {
        const fetchKhoEdit = async () => {
            await getAllKhoEdit();
        };
        fetchKhoEdit();
    }, []);

    useEffect(() => {
        const fetchTinhTrang = async () => {
            await getAllTinhTrang(); // Chờ cho các kho được lấy về
        };
        fetchTinhTrang();
    }, []);


    useEffect(() => {
        console.log('Updated optionsKho:', optionsKho, optionsKhoQL);
        const savedKhoTaiSanId = sessionStorage.getItem('KhoTaiSan_Id');
        const savedKhoQuanLy = sessionStorage.getItem('KhoQuanLy');
        const savedMaTaiSan = sessionStorage.getItem('MaTaiSan');
        //console.log('savedKhoTaiSanId:', savedKhoTaiSanId); // Kiểm tra giá trị đã lưu
        if (savedKhoTaiSanId) {
            const selectedKho = optionsKho.find(option => option.value === Number(savedKhoTaiSanId));
            //console.log('selectedKho:', selectedKho);
            if (selectedKho) {
                setSelectedOptionKho(selectedKho);
                //getAllKhoQL(savedKhoTaiSanId)
                getAllKhoQL()
            }
            if (savedMaTaiSan) {
                getTaiSanTheoKho_KiemKe(savedKhoTaiSanId)
            } else {
                //console.log('chạy lại useEffect khi chọn kho ql :');
                getTaiSanTheoKho(savedKhoTaiSanId, savedKhoQuanLy, UserId)
            }

        }
    }, [optionsKho]); // Chạy khi optionsKho thay đổi

    useEffect(() => {
        const savedKhoQuanLy = sessionStorage.getItem('KhoQuanLy');
        const savedKhoTaiSanId = sessionStorage.getItem('KhoTaiSan_Id');
        const savedMaTaiSan = sessionStorage.getItem('MaTaiSan');
        if (savedKhoQuanLy) {
            const selectedKhoQL = optionsKhoQL.find(option => option.value === savedKhoQuanLy);
            //console.log('selectedKhoQL:', selectedKhoQL);
            if (selectedKhoQL) {
                setSelectedOptionKhoQL(selectedKhoQL);
            }
            if (savedMaTaiSan) {
                getTaiSanTheoKhoQL_KiemKe(savedKhoTaiSanId, savedKhoQuanLy)
            } else {
                getTaiSanTheoKhoQL(savedKhoTaiSanId, savedKhoQuanLy)
            }

        } else {
            setSelectedOptionKhoQL(null);
        }
    }, [optionsKhoQL]); // Chạy khi optionsKho thay đổi


    const getTaiSanTheoKho = async (KhoTaiSan_Id, KhoQuanLy, UserId) => {
        const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
        if (KhoTaiSan_Id === null) {
            setRowData([])
        } else {
            //console.log('getTaiSanTheoKho', KhoTaiSan_Id, KhoQuanLy)
            let response = await fetchAllTaiSanTheoKho(KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id);

            if (response && response.errCode === 0) {
                console.log('response.errMessage', response.errMessage)
                const DotKiemKe_Id = response.data[0]?.DotKiemKe_Id;
                sessionStorage.setItem('DotKiemKe_Id', DotKiemKe_Id);
                toast.success(response.errMessage)
                setRowData(response.data)
                setLoadingTaiSan(false)
            } else {
                //console.log('Mở lịch sử')
                let response = await fetchAllLichSuKiemKe(KhoTaiSan_Id, UserId);
                //console.log('response', response.data)
                let data = response.data
                if (response && response.errCode === 0) {
                    const modifiedData = { data: data, KhoTaiSan_Id: KhoTaiSan_Id };
                    setShowModalLichSuKiemKe(true);
                    setDataLichSuKiemKe(modifiedData);
                } else {
                    setShowModalLichSuKiemKe(false);
                    toast.warning(response.errMessage)
                }
                // console.log('abc')
                // setLoadingTaiSan(false)
                // toast.warning(response.errMessage)
            }
        }
    }

    const getTaiSanTheoKhoLichSu = async (KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id) => {
        //console.log('KhoTaiSan_Id', KhoTaiSan_Id, KhoQuanLy, UserId)
        if (KhoTaiSan_Id === null) {
            setRowData([])
        } else {
            let response = await fetchAllTaiSanTheoKhoLichSu(KhoTaiSan_Id, KhoQuanLy, UserId, DotKiemKe_Id);
            //console.log('response', response)
            if (response && response.errCode === 0) {
                setRowData(response.data)
                setLoadingTaiSan(false)
            }
        }
    }

    // cuộn dữ liệu khi quét mã tài sản
    const onFirstDataRendered = () => {
        const MaTaiSan = sessionStorage.getItem('MaTaiSan');
        const Serial = sessionStorage.getItem('Serial');
        if (MaTaiSan) {
            const index = rowData.findIndex(row => row.MaTaiSan === MaTaiSan || row.MaTaiSanNew === MaTaiSan);
            if (index !== -1 && gridApiRef.current) {
                const node = gridApiRef.current.getDisplayedRowAtIndex(index);
                gridApiRef.current.ensureNodeVisible(node, 'middle');
            }
        } else if (Serial) {
            const index = rowData.findIndex(row => row.Serial === Serial);
            if (index !== -1 && gridApiRef.current) {
                const node = gridApiRef.current.getDisplayedRowAtIndex(index);
                gridApiRef.current.ensureNodeVisible(node, 'middle');
            }
        }
    };


    const getTaiSanTheoKho_KiemKe = async (KhoTaiSan_Id, UserId) => {
        let response = await fetchAllTaiSanTheoKho(KhoTaiSan_Id, UserId);
        if (response && response.errCode === 0) {
            setRowData(response.data)
            // Tìm vị trí của Mã Tài Sản
            const MaTaiSan = sessionStorage.getItem('MaTaiSan');
            const Serial = sessionStorage.getItem('Serial');
            if (MaTaiSan) {
                const index = response.data.findIndex(row => row.MaTaiSan === MaTaiSan || row.MaTaiSanNew === MaTaiSan);
                if (index !== -1 && gridApiRef.current) {
                    if (MaTaiSan) {
                        setHighlightedRow(MaTaiSan);
                    }
                    setTimeout(() => {
                        if (gridApiRef.current) {
                            // Sử dụng `ensureIndexVisible` hoặc `ensureNodeVisible`
                            const node = gridApiRef.current.getDisplayedRowAtIndex(index);
                            gridApiRef.current.ensureNodeVisible(node, 'middle'); // Cuộn đến dòng ở giữa
                        }
                    }, 100);
                }
            } else if (Serial) {
                const index = response.data.findIndex(row => row.Serial === Serial && row.Serial !== null);
                //console.log('Serial', index)
                if (index !== -1 && gridApiRef.current) {
                    if (Serial) {
                        setHighlightedRow(Serial);
                    }
                    setTimeout(() => {
                        if (gridApiRef.current) {
                            // Sử dụng `ensureIndexVisible` hoặc `ensureNodeVisible`
                            const node = gridApiRef.current.getDisplayedRowAtIndex(index);
                            gridApiRef.current.ensureNodeVisible(node, 'middle'); // Cuộn đến dòng ở giữa
                        }
                    }, 100);
                }
            }

        }
    }

    const getTaiSanTheoKhoQL = async (KhoTaiSan_Id, selectedKhoQL) => {
        const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
        //console.log('getTaiSanTheoKhoQL', DotKiemKe_Id)
        let response = await fetchAllTaiSanTheoKhoQL(KhoTaiSan_Id, selectedKhoQL, DotKiemKe_Id);
        if (response && response.errCode === 0) {
            setRowData(response.data)
        }
    }

    const getTaiSanTheoKhoQL_KiemKe = async (KhoTaiSan_Id, selectedKhoQL) => {
        const DotKiemKe_Id = sessionStorage.getItem('DotKiemKe_Id');
        //console.log('getTaiSanTheoKhoQL_KiemKe', DotKiemKe_Id)
        let response = await fetchAllTaiSanTheoKhoQL(KhoTaiSan_Id, selectedKhoQL, DotKiemKe_Id);
        if (response && response.errCode === 0) {
            setRowData(response.data)
            // Tìm vị trí của Mã Tài Sản
            const MaTaiSan = sessionStorage.getItem('MaTaiSan');
            const Serial = sessionStorage.getItem('Serial');

            if (MaTaiSan) {
                const index = response.data.findIndex(row => row.MaTaiSan === MaTaiSan || row.MaTaiSanNew === MaTaiSan);
                //console.log('index', index)
                if (index !== -1 && gridApiRef.current) {
                    if (MaTaiSan) {
                        setHighlightedRow(MaTaiSan);
                    }
                    setTimeout(() => {
                        if (gridApiRef.current) {
                            // Sử dụng `ensureIndexVisible` hoặc `ensureNodeVisible`
                            const node = gridApiRef.current.getDisplayedRowAtIndex(index);
                            gridApiRef.current.ensureNodeVisible(node, 'middle'); // Cuộn đến dòng ở giữa
                        }
                    }, 100);
                }
            } else if (Serial) {
                const index = response.data.findIndex(row => row.Serial === Serial && row.Serial !== null);
                if (index !== -1 && gridApiRef.current) {
                    if (Serial) {
                        setHighlightedRow(Serial);
                    }
                    setTimeout(() => {
                        if (gridApiRef.current) {
                            // Sử dụng `ensureIndexVisible` hoặc `ensureNodeVisible`
                            const node = gridApiRef.current.getDisplayedRowAtIndex(index);
                            gridApiRef.current.ensureNodeVisible(node, 'middle'); // Cuộn đến dòng ở giữa
                        }
                    }, 100);
                }
            }

        }
    }

    return (
        <>
            <ReactTooltip
                id="undo"
                place="top-start"
                variant="info"
                content="Hủy kiểm"
            />
            <ReactTooltip
                id="delete"
                place="top-start"
                variant="info"
                content="Xóa"
            />
            <div className='row grid-container'>
                <div className="row d-flex input-row-kiemke">
                    <div className="col-md-12 d-flex flex-column">
                        <div className="col-md-12 d-flex">
                            <div className='col-md-4 d-flex custom-font-label-kiemke'>
                                <label className='' style={{ fontWeight: 'bold' }}>Phòng ban:</label>
                                <Select
                                    value={selectedOptionKho}
                                    onChange={handleSelectChangeKho}
                                    options={optionsKho}
                                    menuPlacement="bottom"
                                    placeholder="Chọn phòng ban..."
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
                                            minWidth: '250px',
                                            height: '33px',
                                            with: '250px',
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
                            <div className="col-md-4 d-flex custom-font-input-kiemke" style={{ position: 'relative' }}>
                                <label className="" style={{ fontWeight: 'bold' }}>Mã tài sản:</label>
                                <div className="col-md-4" style={{ width: '60%', minWidth: '100px', marginLeft: '5px', position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={MaTaiSan}
                                        onChange={handleInputChangeMaTaiSan}
                                        className="form-control file-input"
                                        placeholder="Nhập mã tài sản..."
                                        style={{
                                            fontSize: '11px',
                                            fontStyle: 'italic',
                                            paddingRight: '24px', // Dành không gian cho biểu tượng loading
                                        }}
                                        disabled={rowData.length > 0 && rowData[0].XacNhanKiemKe === 1}
                                    />
                                    {loadingSearchMTS && (
                                        <i
                                            className="fas fa-spinner fa-spin"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                //top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'blue',
                                                marginTop: '-24px',
                                                fontSize: '16px',
                                            }}
                                        ></i>
                                    )}
                                </div>
                            </div>
                            <div className='col-md-2 d-flex custom-font-label-kiemke'>
                                <label className='' style={{ fontWeight: 'bold' }}>Tổng TS:</label>
                                <div className="col-md-2" style={{ width: '10%', minWidth: '100px', marginLeft: '5px' }}>
                                    <input
                                        value={TongSo}
                                        type="text"
                                        className="form-control file-input"
                                        style={{ fontSize: '13px', fontStyle: 'italic', fontWeight: 'bold', color: 'blue' }}
                                    />
                                </div>
                            </div>
                            <div className='col-md-2 d-flex custom-font-label-kiemke'>
                                <label className='' style={{ fontWeight: 'bold' }}>Đã kiểm:</label>
                                <div className="col-md-2" style={{ width: '10%', minWidth: '100px', marginLeft: '5px' }}>
                                    <input
                                        value={DaKiem}
                                        type="text"
                                        className="form-control file-input"
                                        style={{ fontSize: '13px', fontStyle: 'italic', fontWeight: 'bold', color: 'blue' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 d-flex" style={{ marginTop: '2px' }}>
                            <div className='col-md-4 d-flex custom-font-label-kiemke'>
                                <label className='' style={{ fontWeight: 'bold' }}>Khoa QL:</label>
                                <Select
                                    value={selectedOptionKhoQL}
                                    onChange={handleSelectChangeKhoQL}
                                    options={optionsKhoQL}
                                    menuPlacement="bottom"
                                    placeholder="Chọn khoa quản lý..."
                                    isClearable={true} // Thêm thuộc tính này để cho phép xóa lựa chọn
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            position: 'relative',
                                            zIndex: 110,
                                            marginTop: '-1px',
                                            marginLeft: '24px'
                                        }),
                                        control: (provided) => ({
                                            ...provided,
                                            paddingRight: '10px',
                                            minHeight: '33px',
                                            minWidth: '250px',
                                            height: '33px',
                                            with: '250px',
                                            position: 'relative', // Bổ sung để có thể căn chỉnh nút xóa
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
                                {loadingTaiSan && (
                                    <i
                                        className="fas fa-spinner fa-spin"
                                        style={{
                                            position: 'absolute',
                                            left: '405px',
                                            top: '20%',
                                            transform: 'translateY(-50%)',
                                            color: 'blue',
                                            //marginTop: '-24px',
                                            fontSize: '16px',
                                        }}
                                    ></i>
                                )}
                            </div>
                            <div className='col-md-4 d-flex custom-font-input-kiemke'>
                                <label className='' style={{ fontWeight: 'bold' }}>Serial:</label>
                                <div className="col-md-4" style={{ width: '60%', minWidth: '100px', marginLeft: '32px' }}>
                                    <input
                                        type="text"
                                        value={Serial}
                                        onChange={handleInputChangeSerial}
                                        className="form-control file-input"
                                        placeholder="Nhập Serial..."
                                        style={{ fontSize: '13px', fontStyle: 'italic' }}
                                        onKeyDown={handleKeyDownSerial}
                                        disabled={rowData.length > 0 && rowData[0].XacNhanKiemKe === 1}
                                    //autoFocus
                                    //ref={inputRef}
                                    />
                                    {loadingSearchSR && (
                                        <i
                                            className="fas fa-spinner fa-spin"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                //top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'blue',
                                                marginTop: '-24px',
                                                fontSize: '16px',
                                            }}
                                        ></i>
                                    )}
                                </div>
                            </div>
                            <div className='col-md-2 d-flex custom-font-label-kiemke'>
                                <label className='' style={{ fontWeight: 'bold' }}>Còn lại:</label>
                                <div className="col-md-2" style={{ width: '10%', minWidth: '100px', marginLeft: '12px' }}>
                                    <input
                                        type="text"
                                        value={ConLai}
                                        className="form-control file-input"
                                        style={{ fontSize: '13px', fontStyle: 'italic', fontWeight: 'bold', color: 'blue' }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-2 me-auto" style={{ display: 'inline-block', width: '15%', minWidth: '100px', marginLeft: '52px' }}>
                                {/* Button xác nhận (hiển thị nếu không có phần tử XacNhanKiemKe === 1 hoặc có XacNhanKiemKe === null) */}
                                {/* {!(rowData.some(item => item.XacNhanKiemKe === 1)) && ( */}
                                {Array.isArray(rowData) && !(rowData.some(item => item.XacNhanKiemKe === 1)) && (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                            type="button"
                                            className="btn btn-primary px-1 button-import"
                                            onClick={handleThemTaiSan}
                                            disabled={!sessionStorage.getItem('KhoTaiSan_Id') || rowData.length === 0}
                                        >
                                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Thêm tài sản</i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary px-1 button-import"
                                            onClick={handleXacNhanKiemKe}
                                            disabled={!sessionStorage.getItem('KhoTaiSan_Id') || rowData.length === 0}
                                        >
                                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Xác nhận</i>
                                        </button>
                                    </div>
                                )}
                                {/* Button hủy xác nhận (hiển thị nếu có XacNhanKiemKe === 1 và không có XacNhanKiemKe === null) */}
                                {/* {rowData.some(item => item.XacNhanKiemKe === 1) && !rowData.some(item => item.XacNhanKiemKe === null) && ( */}
                                {Array.isArray(rowData) && rowData.some(item => item.XacNhanKiemKe === 1) && !rowData.some(item => item.XacNhanKiemKe === null) && (
                                    <button
                                        type="button"
                                        className="btn btn-warning px-1 button-import"
                                        onClick={handleHuyXacNhanKiemKe}
                                    >
                                        <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Hủy Xác Nhận</i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row d-flex input-row-kiemke-search">
                    <div className="col-md-12 d-flex flex-column">
                        <div className="col-md-12 d-flex">
                            <div className='col-md-4 d-flex custom-font-label-kiemke'>
                                <label className='' style={{ fontWeight: 'bold' }}>Phòng ban:</label>
                                <Select
                                    value={selectedOptionKhoTimKiem}
                                    onChange={handleSelectChangeKhoTimKiem}
                                    options={optionsKhoTimKiem}
                                    menuPlacement="bottom"
                                    placeholder="Chọn phòng ban..."
                                    isClearable={true} // Thêm thuộc tính này để cho phép xóa lựa chọn
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            position: 'relative',
                                            zIndex: 100,
                                            marginTop: '-1px',
                                            marginLeft: '14px'
                                        }),
                                        control: (provided) => ({
                                            ...provided,
                                            paddingRight: '10px',
                                            minHeight: '33px',
                                            minWidth: '250px',
                                            height: '33px',
                                            with: '250px',
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
                            <div className='col-md-2 d-flex custom-font-label-kiemke'>
                                <label className='' style={{ fontWeight: 'bold' }}>Khoa QL:</label>
                                <Select
                                    value={selectedOptionKhoQLTK}
                                    onChange={handleSelectChangeKhoQLTK}
                                    options={optionsKhoQLTK}
                                    menuPlacement="bottom"
                                    placeholder="Chọn khoa quản lý..."
                                    isClearable={true} // Thêm thuộc tính này để cho phép xóa lựa chọn
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            position: 'relative',
                                            zIndex: 110,
                                            marginTop: '-1px',
                                            marginLeft: '45px'
                                        }),
                                        control: (provided) => ({
                                            ...provided,
                                            paddingRight: '10px',
                                            minHeight: '33px',
                                            minWidth: '150px',
                                            height: '33px',
                                            with: '150px',
                                            position: 'relative', // Bổ sung để có thể căn chỉnh nút xóa
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
                            <div className='col-md-6 d-flex custom-font-input-kiemke' style={{ width: '50%', minWidth: '100px', marginLeft: '60px' }}>
                                <label className='' style={{ fontWeight: 'bold' }}>Từ ngày:</label>
                                <div className="col-md-3 me-2" style={{ width: '20%', minWidth: '100px', marginLeft: '18px' }}>
                                    <input
                                        type="date"
                                        value={TuNgay}
                                        onChange={(e) => setTuNgay(e.target.value)}
                                        className="form-control file-input"
                                        style={{ fontSize: '13px', fontStyle: 'italic', color: 'blue' }}
                                    //autoFocus
                                    //ref={inputRef}
                                    />
                                </div>
                                <label className='' style={{ fontWeight: 'bold' }}>Đến ngày:</label>
                                <div className="col-md-3 me-2" style={{ width: '20%', minWidth: '100px', marginLeft: '1px' }}>
                                    <input
                                        type="date"
                                        value={DenNgay}
                                        onChange={(e) => setDenNgay(e.target.value)}
                                        className="form-control file-input"
                                        style={{ fontSize: '13px', fontStyle: 'italic', color: 'blue' }}
                                    //autoFocus
                                    //ref={inputRef}
                                    />
                                </div>
                                <div className="col-md-2 me-2" style={{ width: '15%', minWidth: '100px', marginLeft: '20px' }}>
                                    <button
                                        type="button"
                                        className="btn btn-primary px-1 button-import "
                                        onClick={handleButtonTimKiem}
                                    >
                                        {/* {loadingDongBo && (
                                            <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                        )} */}
                                        <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Tìm kiếm</i>
                                    </button>
                                </div>
                                <div className="col-md-2" style={{ width: '25%', minWidth: '100px', marginLeft: '-20px' }}>
                                    <button
                                        type="button"
                                        className="btn btn-primary px-1 button-import "
                                        style={{ width: '50px' }}
                                        onClick={handleButtonIn}
                                        disabled={rowData.length > 0 && rowData[0].XacNhanKiemKe !== 1}
                                    >
                                        {/* {loadingDongBo && (
                                            <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                        )} */}
                                        <i style={{ fontSize: '13px', fontStyle: 'normal' }}>In</i>
                                    </button>
                                </div>
                            </div>
                            <div className='col-md-3 d-flex custom-font-input-kiemke me-2'>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ag-theme-alpine container" id='myGrid' style={gridStyle}>
                    <AgGridReact
                        ref={gridRef}
                        popupParent={document.body}
                        //rowData={rowData}
                        rowData={rowData && Array.isArray(rowData) ? rowData : []}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize='1000'
                        gridOptions={gridOptions}
                        onGridReady={onGridReady}
                        onFirstDataRendered={onFirstDataRendered}
                        frameworkComponents={{ ColourCellRenderer }}
                        onCellValueChanged={handleCellValueChanged}
                        // frameworkComponents={{
                        //     CustomDropdownEditor // Đăng ký CustomDropdownEditor
                        // }}
                        rowClassRules={{
                            //'row-highlight': (params) => params.data.MaTaiSan === highlightedRow,
                            // 'row-highlight': (params) =>
                            //     params.data.MaTaiSan === highlightedRow || params.data.MaTaiSanNew === highlightedRow || params.data.Serial === highlightedRow && params.data.Serial !== null,
                            'row-highlight-yelow': (params) => {
                                const isHighlighted =
                                    params.data.MaTaiSan === highlightedRow ||
                                    params.data.MaTaiSanNew === highlightedRow ||
                                    (params.data.Serial === highlightedRow && params.data.Serial !== null);
                                return isHighlighted && params.data.KhoDuocSaiViTri_Id !== null;
                            },
                            // Điều kiện cho hàng màu vàng khi KhoDuocSaiViTri_Id === null
                            'row-highlight': (params) => {
                                const isHighlighted =
                                    params.data.MaTaiSan === highlightedRow ||
                                    params.data.MaTaiSanNew === highlightedRow ||
                                    (params.data.Serial === highlightedRow && params.data.Serial !== null);
                                return isHighlighted && params.data.KhoDuocSaiViTri_Id === null;
                            },
                            'row-pink': (params) => params.data.IsCheckKiemKe === 0,
                            'row-yelow': (params) => params.data.KhoDuocSaiViTri_Id !== null,
                        }}
                    />
                </div>
                <div>
                    <ModalXacNhanXoa
                        show={showModalXacNhanKiemKe || showModalHuyXacNhanKiemKe || showModalXacNhanXoaKiemKe || showModalThemTaiSan || showModalXacNhanHuyKiemKe}
                        dataXacNhanXoa={dataXacNhanKiemKe}
                        handleClose={handleClose}
                        onGridReady={getTaiSanTheoKho}
                        handleCloseXacNhanKiemKe={handleCloseXacNhanKiemKe}
                        handleCloseThemTaiSan={handleCloseThemTaiSan}
                        handleCloseHuyXacNhanKiemKe={handleCloseHuyXacNhanKiemKe}
                        handleCloseXacNhanXoaKiemKe={handleCloseXacNhanXoaKiemKe}
                        handleCloseXacNhanHuyKiemKe={handleCloseXacNhanHuyKiemKe}
                        handleSelectChangeKho={handleSelectChangeKho}
                        handleSelectChangeKhoTimKiem={handleSelectChangeKhoTimKiem}
                        handleSelectChangeKhoQLTK={handleSelectChangeKhoQLTK}
                        socket={socket}
                    />
                </div>
                <div>
                    <ModalInKiemKe
                        show={showModalInKiemKe}
                        dataXacNhanXoa={dataXacNhanKiemKe}
                        handleClose={handleClose}
                        onGridReady={getTaiSanTheoKho}
                        handleCloseInKiemKe={handleCloseInKiemKe}
                        socket={socket}
                    />
                </div>
                <div>
                    <ModalLichSuKiemKe
                        show={showModalLichSuKiemKe}
                        dataLichSuKiemKe={dataLichSuKiemKe}
                        handleClose={handleClose}
                        //onGridReady={getTaiSanTheoKho}
                        handleCloseLichSuKiemKe={handleCloseLichSuKiemKe}
                        socket={socket}
                        onRowClick={handleRowClick} // Truyền callback này xuống modal
                    />
                </div>
                <div>
                    <ModalInKiemKeTong
                        show={showModalInKiemKeTong}
                        dataXacNhanXoa={dataXacNhanKiemKe}
                        handleClose={handleClose}
                        onGridReady={getTaiSanTheoKho}
                        handleCloseInKiemKeTong={handleCloseInKiemKeTong}
                        socket={socket}
                    />
                </div>
            </div>
        </>
    )
}
export default KiemKeTaiSan_bak;