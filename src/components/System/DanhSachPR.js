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
    importDataPR, fetchAllPR, getSoPO, editMaTaiSan, editMaTaiSanNew,
    fetchOnePR, fetchLogPOPR, checkPR, checkEditMaTaiSanPR, downloadFile, downloadFilePR
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
import ModalLogPOPR from './ModalLogPOPR';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import { exportDataPR } from "../../services/exportServices";
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

const DanhSachPR = () => {
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

    const [excelData, setExcelData] = useState([]);
    const [sopo, setSoPO] = useState('');
    const [loadingImport, setLoadingImport] = useState(false);
    const [loadingDongBo, setLoadingDongBo] = useState(false);
    const [loadOnePR, setLoadOnePR] = useState(false);
    const [loadAllPR, setLoadAllPR] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef(null);

    const [rowDataLog, setDataLog] = useState();
    const [showModalLog, setShowModalLog] = useState(false);
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false)
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState([]);
    const [isColumn, setIsColumn] = useState();

    const [actionImportPR, setActionImportPR] = useState('IMPORT');
    const [actionCheckPO, setActionCheckPO] = useState('CHECKPO');
    const [actionViewLogPOPR, setActionViewLogPOPR] = useState('VLOGPRPO');
    const [actionEditMaTaiSan, setActionEditMaTaiSan] = useState('EDITMTS');
    const [actionEditTenTaiSan, setActionEditTenTaiSan] = useState('EDITTTS');


    //console.log('rowdata', rowData)

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Lấy file đầu tiên được chọn

        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const binaryString = evt.target.result;
                const workbook = XLSX.read(binaryString, { type: 'binary' });

                // Chọn sheet đầu tiên
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

                // Lấy hàng đầu tiên làm header
                const headerRow = worksheet[0];

                // Đếm số cột có nội dung trong header (không phải cột trống)
                const numberColumn = headerRow.filter(cell => cell !== undefined && cell !== null && cell !== '').length;
                setIsColumn(numberColumn);

                // Chuyển dữ liệu từ Excel sang JSON
                const formattedData = worksheet.map((row) => ({
                    mataisan: row[0],
                    tentaisan: row[1],
                    donvitinh: row[2],
                    soluongpr: row[3],
                    dongiaprvat: row[4],
                    thanhtienprvat: row[5],
                    ngaycanhang: typeof row[6] === 'number' ? excelDateToJSDate(row[6]) : row[6],
                    ghichu: row[7],
                    sopr: row[8],
                }));

                setExcelData(formattedData);
                //console.log('Dữ liệu Excel:', formattedData);
            };

            reader.readAsBinaryString(file);
        }
    };

    // Hàm chuyển đổi số serial thành ngày tháng
    function excelDateToJSDate(serial) {
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400; // 86400 seconds in a day
        const date_info = new Date(utc_value * 1000);

        // Chuyển đổi múi giờ nếu cần thiết
        const date = new Date(date_info.getTime() + date_info.getTimezoneOffset() * 60 * 1000);

        return date.toLocaleDateString(); // Định dạng lại ngày thành chuỗi "dd/mm/yyyy"
    }

    const handleInputChange = (event) => {
        setSoPO(event.target.value);
    };

    const handleImport = async () => {
        try {
            if (isColumn === 9) {
                // Kiểm tra xem có file được chọn hay không
                if (!fileInputRef.current || !fileInputRef.current.files.length) {
                    toast.warning("Vui lòng chọn file để import dữ liệu!");
                    return; // Ngừng thực hiện nếu không có file
                }
                setLoadingImport(true);
                const dataToSend = {
                    excelData: excelData,
                    user_id: UserId, // Thêm UserId vào đây
                };
                let res_action = await handleGetAction(actionImportPR);
                if (res_action && res_action.errCode === 0) {
                    let res = await importDataPR(dataToSend);
                    if (res && res.errCode === 0) {
                        socket.emit('pr_new_server', { data: res });
                        toast.success(res.errMessage)
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        setLoadingImport(false);
                        setExcelData([]);
                    } else {
                        toast.warning(res.errMessage)
                        setLoadingImport(false);
                        //setSoBenhAn('');
                    }
                }
            } else {
                toast.warning('File import chưa đúng mẫu import PR')
            }
        } catch (e) {
            setLoadingImport(false);
            console.error('Lỗi:', e);
        }
    };

    const handleRefeshAllPR = async () => {
        try {

            onFetchAllPR();
        } catch (e) {
            //setLoadingDongBo(false);
            console.error('Lỗi:', e);
        }
    };

    const handleTaiFile = async () => {
        try {
            //const response = await downloadFile('TemplatePO.xlsx');
            const blob = await downloadFile('TemplatePR.xlsx');

            // Tạo URL cho blob và tải file về
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'TemplatePR.xlsx'); // Tên tệp khi tải về
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Giải phóng URL
            window.URL.revokeObjectURL(url);
            toast.success('File tải về thành công!');
        } catch (error) {
            console.error('Error while downloading file', error);
            toast.error('Có lỗi xảy ra khi tải file!');
        }
    };

    // const handleTaiDataPR = async () => {
    //     try {
    //         //const response = await downloadFile('TemplatePO.xlsx');
    //         const blob = await downloadFilePR('DataPR.xlsx');

    //         // Tạo URL cho blob và tải file về
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'DataPR.xlsx'); // Tên tệp khi tải về
    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();

    //         // Giải phóng URL
    //         window.URL.revokeObjectURL(url);
    //         toast.success('File tải về thành công!');
    //     } catch (error) {
    //         console.error('Error while downloading file', error);
    //         toast.error('Có lỗi xảy ra khi tải file!');
    //     }
    // };

    const handleTaiDataPR = async () => {
        try {
            let res = await exportDataPR();
            if (res && res.errCode === 0) {
                const formatCurrency = (value) => {
                    if (!isNaN(value)) {
                        const formattedValue = new Intl.NumberFormat('en-US').format(value);
                        return formattedValue;
                    }
                    return value;
                };

                // Hàm format ngày từ chuỗi về định dạng dd/mm/yyyy
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };

                const columnDefs = [
                    { header: "Mã tài sản", field: "mataisan" },
                    { header: "Check vói danh mục", field: "checkmats" },
                    { header: "Tên tài sản", field: "tentaisan" },
                    { header: "Check vói danh mục", field: "checktents" },
                    { header: "Đơn vị tính", field: "donvitinh" },
                    { header: "Số lượng", field: "soluongpr", isNumber: true }, // Cột số lượng
                    { header: "Đơn giá vat", field: "dongiaprvat", isNumber: true },  // Cột đơn giá
                    { header: "Thành tiền vat", field: "thanhtienprvat", isNumber: true },
                    { header: "Ngày cần hàng", field: "ngaycanhang", isDate: true },
                    { header: "Ghi chú", field: "ghichu" },
                    { header: "Số PR", field: "sopr" },
                    { header: "Người tạo", field: "nguoitao" },
                    { header: "Ngày tạo", field: "ngaytao", isDate: true },
                ];

                const getExcelColumnName = (colIndex) => {
                    let columnName = '';
                    while (colIndex > 0) {
                        let remainder = (colIndex - 1) % 26;
                        columnName = String.fromCharCode(65 + remainder) + columnName;
                        colIndex = Math.floor((colIndex - 1) / 26);
                    }
                    return columnName;
                };

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Data PR');

                const titleRow = worksheet.addRow(['Data PR']);
                titleRow.font = { size: 16, bold: true };
                const lastColumn = getExcelColumnName(columnDefs.length);
                worksheet.mergeCells(`A1:${lastColumn}1`);
                titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

                const headerRow = worksheet.addRow(columnDefs.map(col => col.header));
                headerRow.eachCell((cell) => {
                    cell.font = { bold: true };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });

                res.report.forEach(dataRow => {
                    const rowData = columnDefs.map(col => {
                        let value = dataRow[col.field];
                        // Kiểm tra nếu cột là số thì định dạng
                        if (col.isNumber) {
                            value = formatCurrency(value);
                        }
                        // Kiểm tra nếu cột là ngày thì định dạng
                        if (col.isDate && value) {
                            value = formatDate(value);
                        }
                        return value;
                    });
                    const row = worksheet.addRow(rowData);
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                });

                worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                });

                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'Data PR.xlsx');
                toast.success(res.errMessage);
            } else {
                toast.warning(res.errMessage);
            }
        } catch (error) {
            console.error('Error while downloading file', error);
            toast.error('Có lỗi xảy ra khi tải file!');
        }
    };



    const handleGetSoPR = async () => {
        try {
            if (!sopo.trim()) {
                toast.warning('Vui lòng nhập số PO');
                return;
            } else {
                setLoadingDongBo(true);
                setLoadOnePR(true);
                setIsUpdating(true);
                let res_action = await handleGetAction(actionCheckPO);
                if (res_action && res_action.errCode === 0) {
                    let res = await getSoPO(sopo, UserId);
                    if (res && res.errCode === 0) {
                        setLoadingDongBo(false);
                        socket.emit('getsopr_server', { data: res });
                        toast.success(res.errMessage)
                        setIsUpdating(false);
                    } else {
                        toast.warning(res.errMessage)
                        setLoadingDongBo(false);
                        setIsUpdating(false);
                        setSoPO('');
                    }
                }
            }
        } catch (e) {
            setLoadingDongBo(false);
            console.error('Lỗi:', e);
        }
    };

    const handleCellEditingStopped = async (event) => {
        try {
            const updatedField = event.colDef.field;
            const mataisanNew = event.newValue;
            const mataisanOld = event.oldValue;  // Lấy giá trị ban đầu
            const rowId = event.data.id;
            const sopr = event.data.sopr;

            // Kiểm tra xem trường `mataisan` có được cập nhật không
            if (updatedField === 'mataisan' && mataisanNew === mataisanOld) {  // Chỉ thực hiện khi giá trị mới giống giá trị cũ
                const dataEdit = {
                    mataisanNew: mataisanNew,
                    sopr: sopr,
                    rowId: rowId,
                    loai: 'PR',
                    colma: 'MA',
                };

                let res_action = await handleGetAction(actionEditMaTaiSan);
                if (res_action && res_action.errCode === 0) {
                    let res = await editMaTaiSanNew(dataEdit);
                    if (res && res.errCode === 0) {
                        socket.emit('edit_mataisan_server', { data: res });
                        toast.success(res.errMessage);
                    } else {
                        onFetchAllPR();
                        toast.warning(res.errMessage);
                    }
                }
            }
        } catch (e) {
            setLoadingImport(false);
            console.error('Lỗi:', e);
        }
    };


    const handleCellValueChanged = async (event) => {
        const updatedField = event.colDef.field;
        const mataisanNew = event.newValue;
        const rowId = event.data.id;
        const tentaisanNew = event.newValue;
        const sopr = event.data.sopr;
        try {
            // // Gọi API để cập nhật giá trị mới
            if (updatedField === 'mataisan') {
                const dataEdit = {
                    mataisanNew: mataisanNew,
                    sopr: sopr,
                    rowId: rowId,
                    loai: 'PR',
                    colma: 'MA',
                };
                let res_action = await handleGetAction(actionEditMaTaiSan);
                if (res_action && res_action.errCode === 0) {
                    let res = await editMaTaiSan(dataEdit);
                    if (res && res.errCode === 0) {
                        socket.emit('edit_mataisan_server', { data: res });
                        toast.success(res.errMessage)
                    } else {
                        onFetchAllPR();
                        toast.warning(res.errMessage)
                    }
                }
            } else if (updatedField === 'tentaisan') {
                const dataEdit = {
                    tentaisanNew: tentaisanNew,
                    sopr: sopr,
                    rowId: rowId,
                    loai: 'PR',
                    colten: 'TEN',
                };
                let res_action = await handleGetAction(actionEditTenTaiSan);
                //console.log('Kết quả từ handleGetAction:', res_action);
                if (res_action && res_action.errCode === 0) {
                    let res = await editMaTaiSan(dataEdit);
                    if (res && res.errCode === 0) {
                        socket.emit('edit_mataisan_server', { data: res });
                        toast.success(res.errMessage)
                    } else {
                        onFetchAllPR();
                        toast.warning(res.errMessage)
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    };


    const handleClose = () => {
        setShowModalLog(false);
        setShowModalXacNhanXoa(false);
    }

    const handleXoaPR = async (data) => {
        let sopr = (data.data.sopr)
        try {
            let checkpr = await checkPR(sopr);
            if (checkpr && checkpr.errCode === 0) {
                const modifiedData = { sopr: sopr, Nhom: 'xoapr' };
                setDataXacNhanXoa(modifiedData);
                setShowModalXacNhanXoa(true);
            } else {
                toast.warning(checkpr.errMessage)
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleXemLog = async (data) => {

        let sopr = (data.data.sopr)
        try {
            let res_action = await handleGetAction(actionViewLogPOPR);
            if (res_action && res_action.errCode === 0) {
                let response = await fetchLogPOPR(sopr);
                if (response && response.errCode === 0) {
                    setDataLog(response.data);
                    setShowModalLog(true);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Action',
            field: '',
            pinned: 'left',
            width: 90,
            maxWidth: 90,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) => {
                if (params.data) {
                    return (
                        <div className="btn-action">
                            <button className='btn-delete' onClick={() => handleXoaPR(params)} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                            <button className='btn-view' onClick={() => handleXemLog(params)} data-tooltip-id="viewlog"><i className="fas fa-eye"></i></button>
                        </div>
                    );
                }
                return null;
            }
        },
        {
            headerName: 'Số PR',
            field: 'sopr',
            width: 170,
            maxWidth: 170,
            rowGroup: true, // Nhóm theo "Số PR"
            hide: true,     // Ẩn cột sau khi nhóm
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Số PR',
            pinned: 'left',
            field: 'sopr',
            width: 170,
            maxWidth: 170,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Mã TS',
            field: 'mataisan',
            pinned: 'left',
            width: 100,
            maxWidth: 100,
            editable: true,
            cellStyle: params => {
                // Màu nền chung cho toàn bộ cột để biết cột có thể sửa
                let baseStyle = {
                    backgroundColor: '#edf5ef',
                    color: 'black'
                };
                if (!params.node.group) {
                    // Lấy giá trị checknhacungcap từ params.data
                    const checkma = params.data.checkma;
                    // Kiểm tra điều kiện dựa trên checknhacungcap và ghi đè màu
                    if (checkma === null || checkma === undefined) {
                        // Không thay đổi, giữ màu nền của cột
                        return baseStyle;
                    } else if (checkma === 1) {
                        return { ...baseStyle, backgroundColor: '#edf5ef', color: 'black' };
                    } else if (checkma === 0) {
                        return { ...baseStyle, backgroundColor: 'red', color: 'black' };
                    }
                }
                return baseStyle;
            }
        },
        {
            headerName: 'Tên tài sản',
            field: 'tentaisan',
            width: 250,
            maxWidth: 250,
            editable: true,
            autoHeight: true,
            autoHeight: true,
            cellStyle: params => {
                // Màu nền chung cho toàn bộ cột để biết cột có thể sửa
                let baseStyle = {
                    backgroundColor: '#edf5ef',
                    whiteSpace: 'normal',
                    color: 'black'
                };
                // Lấy giá trị checknhacungcap từ params.data
                if (!params.node.group) {
                    const checkten = params.data.checkten;
                    // Kiểm tra điều kiện dựa trên checknhacungcap và ghi đè màu
                    if (checkten === null || checkten === undefined) {
                        // Không thay đổi, giữ màu nền của cột
                        return baseStyle;
                    } else if (checkten === 1) {
                        return { ...baseStyle, backgroundColor: '#edf5ef', color: 'black' };
                    } else if (checkten === 0) {
                        return { ...baseStyle, backgroundColor: 'red', color: 'black' };
                    }
                }
                return baseStyle;
            }
        },
        {
            headerName: 'ĐVT',
            field: 'donvitinh',
            width: 85,
            maxWidth: 85,
        },
        {
            headerName: 'SL PR',
            field: 'soluongpr',
            width: 90,
            maxWidth: 90,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Chênh lệch PO',
            field: 'soluongpo',
            width: 140,
            maxWidth: 140,
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
            headerName: 'Đơn giá PR',
            field: 'dongiaprvat',
            width: 120,
            maxWidth: 120,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Thành tiền VAT',
            field: 'thanhtienprvat',
            width: 140,
            maxWidth: 140,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Tổng SL PO',
            field: 'tongsoluongpo',
            width: 120,
            maxWidth: 120,
        },
        {
            headerName: 'Ngày cần hàng',
            field: 'ngaycanhang',
            width: 160,
            maxWidth: 160,
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
            headerName: 'Ghi chú',
            field: 'ghichu',
            width: 120,
            maxWidth: 120,
        },
        {
            headerName: 'Người tạo',
            field: 'nguoitao',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Ngày tạo',
            field: 'ngaytao',
            width: 160,
            maxWidth: 160,
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
            return !params.node.group && params.data?.checkmataisan === 1;  // Chỉ áp dụng cho các hàng chi tiết
        },
        // 'row-pink': (params) => {
        //     return params.data.checkmataisan === 1;
        // },
    };

    const gridOptions = {
        rowClassRules: rowClassRules,
        suppressRowClickSelection: true,  // Ngăn việc chọn hàng khi click
        groupSelectsChildren: true,  // Khi chọn hàng nhóm, chọn luôn các hàng con
        isRowMaster: (params) => {
            return params.data && params.data.details && params.data.details.length > 0;  // Chỉ những hàng có "details" mới được mở rộng
        },
        suppressAutoColumn: true, // Không tự động thêm cột nhóm
        groupDisplayType: 'groupRows',
        // // Tắt hiển thị cột "Group" trong các hàng chi tiết
        getRowStyle: (params) => {
            if (params.node.group) {
                return {
                    fontWeight: 'bold',
                    fontSize: '30px',  // Kích thước font lớn hơn cho hàng group
                    backgroundColor: '#edf5ef',  // Thêm màu nền nếu cần
                };
            }
        },
        onCellEditingStarted: async (event) => {
            const sopr = event.data.sopr;
            const mataisan = event.data.mataisan;
            // Kiểm tra trước khi chỉnh sửa
            let checkhd = await checkEditMaTaiSanPR(sopr, mataisan);
            if (checkhd.errCode !== 0) {
                toast.warning('Mã tài sản đã được kiểm tra, không thể sửa');
                event.api.stopEditing();  // Hủy chế độ chỉnh sửa ô
                return;  // Kết thúc hàm nếu có lỗi
            }
        },
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

    const onFetchAllPR = useCallback(async () => {
        try {
            let response = await fetchAllPR();
            if (response && response.errCode === 0) {
                //console.log('response all', response.data);
                setRowData(response.data);
                setLoadOnePR(false)
            }
            // setLoadOnePR(false)
        } catch (error) {
            console.error("Error fetching all PO:", error);
        }
    }, []);

    const onFetchOnePR = useCallback(async () => {
        try {
            let response = await fetchOnePR(sopo);
            if (response && response.errCode === 0) {
                //console.log('response one', response.data);
                setRowData(response.data);
            }
            setSoPO('');
            // setLoadOnePR(false)
        } catch (error) {
            console.error("Error fetching one PO:", error);
        }
    }, [loadOnePR]);

    useEffect(() => {
        if (!isUpdating && loadOnePR) {
            //console.log("loadOnePR is true, fetching one PR...", loadOnePR);
            onFetchOnePR();
            setLoadOnePR(false); // Tắt cờ sau khi hoàn thành
        }
    }, [isUpdating, loadOnePR, onFetchOnePR]);


    useEffect(() => {
        if (loadAllPR) {
            //console.log("Initial page load, fetching all PR...");
            onFetchAllPR();
            setLoadAllPR(false);  // Đặt lại cờ sau lần load ban đầu
        }
    }, [loadAllPR, onFetchAllPR]);

    useEffect(() => {
        try {
            const fetchUrlView = async () => {
                try {
                    let res = await getUrl();
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

            socket.on("pr_new_client", (data) => {
                setLoadAllPR(true);
                //onFetchAllPR();
                setSocketEventReceived(true);
            });

            socket.on("getsopr_client", (data) => {
                setLoadOnePR(true)
                //onFetchOnePR();
                setSocketEventReceived(true);
            });

            socket.on("edit_mataisan_client", (data) => {
                setLoadAllPR(true);
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
                place="top-start"
                variant="info"
                content="Xóa"
            />
            <ReactTooltip
                id="viewlog"
                place="top"
                variant="info"
                content="Xem log"
            />
            <div className='row grid-container'>
                <div className="row d-flex input-row-dongbo">
                    <div className="col-md-2" style={{ width: '15%', minWidth: '100px' }}>
                        <input
                            type="text"
                            value={sopo}
                            onChange={handleInputChange}
                            className="form-control file-input"
                            placeholder="Nhập mã số PO..."
                            style={{ fontSize: '13px', fontStyle: 'italic' }}
                        //autoFocus
                        //ref={inputRef}
                        />
                    </div>
                    <div className="col-md-2">
                        <button
                            type="button"
                            className="btn btn-primary px-1 button-import"
                            onClick={handleGetSoPR}
                        >
                            {loadingDongBo && (
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            )}
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Kiểm tra</i>
                        </button>
                    </div>
                    <div className="col-md-4">
                        <input
                            type="file"
                            className='form-control file-input'
                            style={{ marginRight: '-10px', fontSize: '13px' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="col-md-2 d-flex">
                        <button
                            type="button"
                            className="btn btn-primary px-1 button-import me-2"
                            onClick={handleImport}
                        >
                            {loadingImport && (
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            )}
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Import</i>
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary px-1 button-import me-2"
                            style={{ backgroundColor: 'orange', color: 'black', border: 'none' }}
                            onClick={handleTaiFile}
                        >
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>File</i>
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary px-1 button-import"
                            style={{ backgroundColor: 'orange', color: 'black', border: 'none' }}
                            onClick={handleTaiDataPR}
                        >
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Báo cáo</i>
                        </button>
                    </div>
                    <div className="col-md-2 d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-primary px-1 button-import"
                            onClick={handleRefeshAllPR}
                        >
                            {loadingDongBo && (
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            )}
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>All PR</i>
                        </button>
                    </div>
                </div>
                <div className="ag-theme-alpine container" id='myGrid' style={gridStyle}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        masterDetail={true}
                        gridOptions={gridOptions}
                        pagination={true}
                        paginationPageSize='20'
                        onCellValueChanged={handleCellValueChanged}
                        onCellEditingStopped={handleCellEditingStopped}
                    />
                </div>
                <div>
                    <ModalLogPOPR
                        show={showModalLog}
                        rowDataLog={rowDataLog}
                        handleClose={handleClose}
                        socket={socket}
                        onFetchAllPR={onFetchAllPR}
                    />
                </div>
                <div>
                    <ModalXacNhanXoa
                        show={showModalXacNhanXoa}
                        dataXacNhanXoa={dataXacNhanXoa}
                        handleClose={handleClose}
                        onGridReady={onFetchAllPR}
                        socket={socket}
                    />
                </div>
            </div>
        </>
    );
};

export default DanhSachPR;