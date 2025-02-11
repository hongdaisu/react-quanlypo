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
    importDataPO, fetchAllPO, getChungTu, editMaTaiSan, editMaTaiSanNew, fetchOnePO, downloadFile, downloadFilePO,
    fetchAllLogChungTuPO, checkPO, checkEditMaTaiSanPO, checkEditSoLuongPO, fetchAllLogPOPR
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
import ModalXacNhanXoa from './ModalXacNhanXoa';
import ModalLogPOPR from './ModalLogPOPR';
import { exportDataPO } from "../../services/exportServices";
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

const DanhSachPO = () => {
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
    const [machungtu, setMaChungTu] = useState('');
    const [loadingImport, setLoadingImport] = useState(false);
    const [loadingDongBo, setLoadingDongBo] = useState(false);
    const [loadOnePO, setLoadOnePO] = useState(false);
    const [loadAllPO, setLoadAllPO] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef(null);
    const [rowDataLog, setDataLog] = useState();
    const [showModalLog, setShowModalLog] = useState(false);
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false)
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState([]);
    const [isColumn, setIsColumn] = useState();

    const [actionEditSoLuong, setActionEditSoLuong] = useState('EDITSL');
    const [actionDeletePO, setActionDeletePO] = useState('DELETE');
    const [actionImportPO, setActionImportPO] = useState('IMPORT');
    const [actionEditMaTaiSan, setActionEditMaTaiSan] = useState('EDITMTS');
    const [actionEditTenTaiSan, setActionEditTenTaiSan] = useState('EDITTTS');
    const [actionViewLogPOPR, setActionViewLogPOPR] = useState('VLOGPRPO');

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

                // // Kiểm tra kiểu dữ liệu của row[10]
                // worksheet.forEach((row, index) => {
                //     console.log(`Row ${index}:`, row[10], ' - Type:', typeof row[10]);
                // });

                // Chuyển dữ liệu từ Excel sang JSON
                const formattedData = worksheet.map((row) => ({
                    mataisan: row[0],
                    tentaisan: row[1],
                    donvitinh: row[2],
                    soluongpo: row[3],
                    dongiapo: row[4],
                    vat: row[5],
                    thanhtien: row[6],
                    thanhtienvat: row[7],
                    sopr: row[8],
                    sopo: row[9],
                    ngaypo: typeof row[10] === 'number' ? excelDateToJSDate(row[10]) : row[10],
                }));

                setExcelData(formattedData);
                //console.log('Dữ liệu Excel:', formattedData);
            };

            reader.readAsBinaryString(file);
        }
    };

    const handleInputChange = (event) => {
        setMaChungTu(event.target.value);
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

    const handleImport = async () => {
        try {
            //console.log('numberColumn', isColumn)
            if (isColumn === 11) {
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
                let res_action = await handleGetAction(actionImportPO);
                if (res_action && res_action.errCode === 0) {
                    let res = await importDataPO(dataToSend);
                    if (res && res.errCode === 0) {
                        socket.emit('po_new_server', { data: res });
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
                toast.warning('File import chưa đúng mẫu import PO')
            }
        } catch (e) {
            setLoadingImport(false);
            console.error('Lỗi:', e);
        }
    };

    const handleRefeshAllPO = async () => {
        try {
            onFetchAllPO();
        } catch (e) {
            //setLoadingDongBo(false);
            console.error('Lỗi:', e);
        }
    };

    const handleTaiFile = async () => {
        try {
            //const response = await downloadFile('TemplatePO.xlsx');
            const blob = await downloadFile('TemplatePO.xlsx');

            // Tạo URL cho blob và tải file về
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'TemplatePO.xlsx'); // Tên tệp khi tải về
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

    const handleTaiDataPO = async () => {
        try {
            let res = await exportDataPO();
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
                    { header: "Số lượng po", field: "soluongpo", isNumber: true },
                    { header: "Số lượng đã nhập", field: "soluongdanhap", isNumber: true },
                    { header: "Số lượng pr", field: "soluongpr", isNumber: true },
                    { header: "Đơn giá", field: "dongiapo", isNumber: true },
                    { header: "VAT", field: "vat", isNumber: true },
                    { header: "Thành tiền", field: "thanhtien", isNumber: true },
                    { header: "Số PR", field: "sopr" },
                    { header: "Số PO", field: "sopo" },
                    { header: "Người tạo", field: "nguoitao" },
                    { header: "Ngày tạo", field: "ngaytao", isDate: true },
                    { header: "Ngày PO", field: "ngaypo", isDate: true },
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
                const worksheet = workbook.addWorksheet('Data PO');

                const titleRow = worksheet.addRow(['Data PO']);
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
                saveAs(blob, 'Data PO.xlsx');
                toast.success(res.errMessage);
            } else {
                toast.warning(res.errMessage);
            }
        } catch (error) {
            console.error('Error while downloading file', error);
            toast.error('Có lỗi xảy ra khi tải file!');
        }
    };


    // const handleTaiDataPO = async () => {
    //     try {
    //         let res = await exportDataPO();
    //         if (res && res.errCode === 0) {
    //             const formatCurrency = (value) => {
    //                 // Kiểm tra nếu value là số hợp lệ thì định dạng, nếu không thì trả về giá trị gốc
    //                 if (!isNaN(value)) {
    //                     const formattedValue = new Intl.NumberFormat('en-US').format(value);
    //                     //console.log('Giá trị gốc:', value, ' | Giá trị định dạng:', formattedValue); // In giá trị gốc và giá trị định dạng
    //                     return formattedValue;
    //                 }
    //                 //console.log('Giá trị không hợp lệ:', value); // In giá trị không hợp lệ nếu không phải số
    //                 return value;
    //             };

    //             const columnDefs = [
    //                 //{ header: "STT", field: "stt" },
    //                 { header: "Mã tài sản", field: "mataisan" },
    //                 { header: "Check vói danh mục", field: "checkmats" },
    //                 { header: "Tên tài sản", field: "tentaisan" },
    //                 { header: "Check vói danh mục", field: "checktents" },
    //                 { header: "Đơn vị tính", field: "donvitinh" },
    //                 { header: "Số lượng", field: "soluongpo" },
    //                 { header: "Đơn giá", field: "dongiapo" },
    //                 { header: "VAT", field: "vat" },
    //                 { header: "Thành tiền", field: "thanhtien" },
    //                 { header: "Số PR", field: "sopr" },
    //                 { header: "Số PO", field: "sopo" },
    //                 { header: "Người tạo", field: "nguoitao" },
    //                 { header: "Ngày tạo", field: "ngaytao" },
    //                 { header: "Ngày PO", field: "ngaypo" },
    //             ];

    //             // Hàm để tính toán tên cột Excel theo chỉ số
    //             const getExcelColumnName = (colIndex) => {
    //                 let columnName = '';
    //                 while (colIndex > 0) {
    //                     let remainder = (colIndex - 1) % 26;
    //                     columnName = String.fromCharCode(65 + remainder) + columnName;
    //                     colIndex = Math.floor((colIndex - 1) / 26);
    //                 }
    //                 return columnName;
    //             };

    //             // Tạo workbook và worksheet
    //             const workbook = new ExcelJS.Workbook();
    //             const worksheet = workbook.addWorksheet('Data PO');

    //             // Thêm tiêu đề báo cáo
    //             const titleRow = worksheet.addRow(['Data PO']);
    //             titleRow.font = { size: 16, bold: true };
    //             const lastColumn = getExcelColumnName(columnDefs.length); // Tính toán cột cuối cùng (ví dụ: AH cho cột 34)
    //             worksheet.mergeCells(`A1:${lastColumn}1`);
    //             titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    //             // Thêm header
    //             const headerRow = worksheet.addRow(columnDefs.map(col => col.header));
    //             headerRow.eachCell((cell) => {
    //                 cell.font = { bold: true };
    //                 cell.border = {
    //                     top: { style: 'thin' },
    //                     left: { style: 'thin' },
    //                     bottom: { style: 'thin' },
    //                     right: { style: 'thin' }
    //                 };
    //             });

    //             // Thêm dữ liệu
    //             res.report.forEach(dataRow => {
    //                 const row = worksheet.addRow(columnDefs.map(col => dataRow[col.field]));
    //                 row.eachCell((cell) => {
    //                     cell.border = {
    //                         top: { style: 'thin' },
    //                         left: { style: 'thin' },
    //                         bottom: { style: 'thin' },
    //                         right: { style: 'thin' }
    //                     };
    //                 });
    //             });

    //             // Thiết lập border cho tất cả các ô
    //             worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    //                 row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    //                     cell.border = {
    //                         top: { style: 'thin' },
    //                         left: { style: 'thin' },
    //                         bottom: { style: 'thin' },
    //                         right: { style: 'thin' }
    //                     };
    //                 });
    //             });

    //             // Tạo buffer và lưu file
    //             const buffer = await workbook.xlsx.writeBuffer();
    //             const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //             saveAs(blob, 'Data PO.xlsx');
    //             toast.success(res.errMessage);
    //         } else {
    //             toast.warning(res.errMessage)
    //         }
    //         // //const response = await downloadFile('TemplatePO.xlsx');
    //         // const blob = await downloadFilePO('DataPO.xlsx');

    //         // // Tạo URL cho blob và tải file về
    //         // const url = window.URL.createObjectURL(blob);
    //         // const link = document.createElement('a');
    //         // link.href = url;
    //         // link.setAttribute('download', 'DataPO.xlsx'); // Tên tệp khi tải về
    //         // document.body.appendChild(link);
    //         // link.click();
    //         // link.remove();

    //         // // Giải phóng URL
    //         // window.URL.revokeObjectURL(url);
    //         // toast.success('File tải về thành công!');
    //     } catch (error) {
    //         console.error('Error while downloading file', error);
    //         toast.error('Có lỗi xảy ra khi tải file!');
    //     }
    // };

    const handleGetChungTu = async () => {
        try {
            if (!machungtu.trim()) {
                toast.warning('Vui lòng nhập mã chứng từ');
                return;
            } else {
                setLoadingDongBo(true);
                setLoadOnePO(true);
                setIsUpdating(true);
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
            const tentaisanNew = event.newValue;
            const sopo = event.data.sopo;

            // Kiểm tra xem trường `mataisan` có được cập nhật không
            if (updatedField === 'mataisan' && mataisanNew === mataisanOld) {  // Chỉ thực hiện khi giá trị mới giống giá trị cũ
                const dataEdit = {
                    mataisanNew: mataisanNew,
                    sopo: sopo,
                    rowId: rowId,
                    loai: 'PO',
                    colma: 'MA',
                };

                let res_action = await handleGetAction(actionEditMaTaiSan);
                if (res_action && res_action.errCode === 0) {
                    let res = await editMaTaiSanNew(dataEdit);
                    if (res && res.errCode === 0) {
                        socket.emit('edit_mataisan_server', { data: res });
                        toast.success(res.errMessage);
                    } else {
                        onFetchAllPO();
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
        try {
            const updatedField = event.colDef.field;
            const mataisanNew = event.newValue;
            const rowId = event.data.id;
            const tentaisanNew = event.newValue;
            const sopo = event.data.sopo;

            // // Gọi API để cập nhật giá trị mới
            if (updatedField === 'mataisan') {
                const dataEdit = {
                    mataisanNew: mataisanNew,
                    sopo: sopo,
                    rowId: rowId,
                    loai: 'PO',
                    colma: 'MA',
                };
                let res_action = await handleGetAction(actionEditMaTaiSan);
                if (res_action && res_action.errCode === 0) {
                    let res = await editMaTaiSan(dataEdit);
                    //('editmataisan', res)
                    if (res && res.errCode === 0) {
                        socket.emit('edit_mataisan_server', { data: res });
                        toast.success(res.errMessage)
                    } else {
                        onFetchAllPO();
                        toast.warning(res.errMessage)
                    }
                }
            } else if (updatedField === 'tentaisan') {
                const dataEdit = {
                    tentaisanNew: tentaisanNew,
                    sopo: sopo,
                    rowId: rowId,
                    loai: 'PO',
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
                        onFetchAllPO();
                        toast.warning(res.errMessage)
                    }
                }
            }
        } catch (e) {
            setLoadingImport(false);
            console.error('Lỗi:', e);
        }
    };


    const handleClose = () => {
        setShowModalLog(false);
        setShowModalXacNhanXoa(false);

    }

    const handleXemLog = async (data) => {
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
                    setDataLog(response.data);
                    setShowModalLog(true);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleXoaPO = async (data) => {
        let sopo = (data.data.sopo)
        try {
            let res_action = await handleGetAction(actionDeletePO);
            if (res_action && res_action.errCode === 0) {
                let checkhd = await checkPO(sopo);
                if (checkhd && checkhd.errCode === 0) {
                    const modifiedData = { sopo: sopo, Nhom: 'xoapo' };
                    setDataXacNhanXoa(modifiedData);
                    setShowModalXacNhanXoa(true);
                } else {
                    toast.warning(checkhd.errMessage)
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
            width: 90,
            maxWidth: 90,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) => {
                if (params.data) {
                    return (
                        <div className="btn-action">
                            <button className='btn-delete' onClick={() => handleXoaPO(params)} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                            <button className='btn-view' onClick={() => handleXemLog(params)} data-tooltip-id="viewlog"><i className="fas fa-eye"></i></button>
                        </div>
                    );
                }
                return null;
            }
        },
        {
            headerName: 'Số PO',
            field: 'sopo',
            //pinned: 'left',
            width: 170,
            maxWidth: 170,
            rowGroup: true, // Nhóm theo "Số PR"
            hide: true,     // Ẩn cột sau khi nhóm
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Ngày PO',
            field: 'ngaypo',
            width: 110,
            pinned: 'left',
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
            pinned: 'left',
            width: 170,
            maxWidth: 170,
            autoHeight: true,
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
            //pinned: 'left',
            width: 250,
            maxWidth: 250,
            editable: true,
            autoHeight: true,
            cellStyle: params => {
                // Màu nền chung cho toàn bộ cột để biết cột có thể sửa
                let baseStyle = {
                    backgroundColor: '#edf5ef',
                    whiteSpace: 'normal',
                    color: 'black'
                };
                if (!params.node.group) {
                    // Lấy giá trị checknhacungcap từ params.data
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
            headerName: 'SL PO',
            headerClass: 'header-wrap',
            field: 'soluongpo',
            width: 80,
            maxWidth: 80,
            editable: true,
            valueFormatter: (params) => {
                if (params.value != null && !isNaN(params.value)) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                const baseStyle = {
                    backgroundColor: '#edf5ef',
                    color: 'black'
                };
                return baseStyle;
            }
        },
        {
            headerName: 'Đơn giá',
            field: 'dongiapo',
            width: 110,
            maxWidth: 110,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                const baseStyle = {
                    backgroundColor: '#edf5ef',
                    color: 'black'
                };
                return baseStyle;
            }
        },
        {
            headerName: 'VAT',
            field: 'vat',
            width: 80,
            maxWidth: 80,
            editable: true,
            cellStyle: params => {
                const baseStyle = {
                    backgroundColor: '#edf5ef',
                    color: 'black'
                };
                return baseStyle;
            }
        },
        {
            headerName: 'Đơn giá Vat',
            field: 'dongiapovat',
            headerClass: 'header-wrap',
            width: 110,
            maxWidth: 110,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        // {
        //     headerName: 'Chênh lệch SL CT',
        //     field: 'soluongnhap',
        //     width: 100,
        //     maxWidth: 100,
        //     headerClass: 'header-wrap',
        //     valueFormatter: (params) => {
        //         if (params.value) {
        //             return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
        //         }
        //         return params.value;
        //     },
        //     cellStyle: params => {
        //         const value = params.value;
        //         if (value === null || value === undefined) {
        //             return { backgroundColor: 'white', color: 'white' };
        //         } else if (value > 0) {
        //             return { backgroundColor: 'red', color: 'white' };
        //         } else if (value <= 0) {
        //             return { backgroundColor: 'green', color: 'white' };
        //         }
        //         return {};
        //     }
        // },
        // {
        //     headerName: 'Chênh lệch giá CT',
        //     field: 'dongianhap',
        //     width: 110,
        //     maxWidth: 110,
        //     headerClass: 'header-wrap',
        //     valueFormatter: (params) => {
        //         if (params.value) {
        //             return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
        //         }
        //         return params.value;
        //     },
        //     cellStyle: params => {
        //         const value = params.value;
        //         if (value === null || value === undefined) {
        //             return { backgroundColor: 'white', color: 'white' };
        //         } else if (value > 0) {
        //             return { backgroundColor: 'red', color: 'white' };
        //         } else if (value === 0) {
        //             return { backgroundColor: 'green', color: 'white' };
        //         } else if (value < 0) {
        //             return { backgroundColor: 'red', color: 'white' };
        //         }
        //         return {};
        //     }
        // },
        // {
        //     headerName: 'Chênh lệch giá Vat CT',
        //     field: 'dongiavatnhap',
        //     width: 125,
        //     maxWidth: 125,
        //     headerClass: 'header-wrap',
        //     valueFormatter: (params) => {
        //         if (params.value) {
        //             return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
        //         }
        //         return params.value;
        //     },
        //     cellStyle: params => {
        //         const value = params.value;
        //         if (value === null || value === undefined) {
        //             return { backgroundColor: 'white', color: 'white' };
        //         } else if (value > 0) {
        //             return { backgroundColor: 'red', color: 'white' };
        //         } else if (value === 0) {
        //             return { backgroundColor: 'green', color: 'white' };
        //         } else if (value < 0) {
        //             return { backgroundColor: 'red', color: 'white' };
        //         }
        //         return {};
        //     }
        // },
        {
            headerName: 'SL đã nhập',
            field: 'soluongdanhap',
            width: 120,
            maxWidth: 120,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Thành tiền',
            field: 'thanhtien',
            width: 115,
            maxWidth: 115,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Thành tiền VAT',
            field: 'thanhtienvat',
            width: 140,
            maxWidth: 140,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Số PR',
            field: 'sopr',
            width: 170,
            maxWidth: 170,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
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
            return !params.node.group && params.data?.checkmataisanvoict === 1;  // Chỉ áp dụng cho các hàng chi tiết
        },
        // 'row-pink': (params) => {
        //     return params.data.checkmataisanvoict === 1;
        // },
    };
    let tempRawValue = '';
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
            const sopo = event.data.sopo;
            const mataisan = event.data.mataisan;
            // let checkhd = await checkEditMaTaiSanPO(sopo, mataisan);
            // if (checkhd.errCode !== 0) {
            //     toast.warning('Mã tài sản đã được kiểm tra, không thể sửa');
            //     // Hủy bỏ chế độ chỉnh sửa ô
            //     event.api.stopEditing();
            //     return;  // Kết thúc hàm tại đây nếu có lỗi
            // }
            if (event.colDef.field === 'soluongpo' || event.colDef.field === 'dongiapo' || event.colDef.field === 'vat') {
                try {
                    let res_action = await handleGetAction(actionEditSoLuong);
                    if (res_action && res_action.errCode === 0) {
                        let checkeditsl = await checkEditSoLuongPO(sopo, mataisan);
                        //console.log('checkeditsl', checkeditsl)
                        if (checkeditsl.errCode !== 0) {
                            toast.warning('Đã được kiểm tra với chứng từ, không thể sửa');
                            // Hủy bỏ chế độ chỉnh sửa ô
                            event.api.stopEditing();
                            return;  // Kết thúc hàm tại đây nếu có lỗi
                        } else {
                            let rawValue = event.value;
                            const input = document.querySelector('.ag-cell-inline-editing input');

                            //console.log('rawValue onCellEditingStarted', rawValue, input);
                            if (input) {
                                // Đổi kiểu input thành 'text' để hỗ trợ việc định dạng với dấu phân tách
                                input.setAttribute('type', 'text');

                                // Loại bỏ dấu phân cách hàng nghìn khi hiển thị giá trị thô
                                input.value = rawValue != null ? rawValue.toString().replace(/\./g, '') : '';

                                // Đặt con trỏ ở cuối của giá trị trong input
                                input.setSelectionRange(input.value.length, input.value.length);

                                let typingTimer;

                                // Lắng nghe sự kiện nhập dữ liệu từ người dùng
                                input.addEventListener('input', (e) => {
                                    clearTimeout(typingTimer);  // Reset bộ đếm để tránh nhiều cập nhật cùng lúc

                                    let caretPosition = input.selectionStart; // Lưu vị trí con trỏ
                                    let rawInputValue = e.target.value.replace(/\D/g, ''); // Chỉ giữ số

                                    // Lưu giá trị thô vào biến tạm
                                    tempRawValue = rawInputValue;

                                    // Thiết lập bộ đếm để thực hiện định dạng sau khi người dùng dừng gõ
                                    typingTimer = setTimeout(() => {
                                        if (rawInputValue) {
                                            // Cập nhật giá trị đã định dạng
                                            e.target.value = new Intl.NumberFormat('vi-VN').format(rawInputValue);
                                        }

                                        // Đặt lại con trỏ về vị trí cũ sau khi định dạng
                                        input.setSelectionRange(caretPosition, caretPosition);
                                    }, 50);  // Giảm thời gian trễ xuống để hiển thị nhanh
                                });
                            }
                        }
                    }
                } catch (error) {
                    onFetchAllPO();
                    console.error('Lỗi:', error);
                }
            } else if (event.colDef.field === 'mataisan' || event.colDef.field === 'tentaisan') {
                let checkhd = await checkEditMaTaiSanPO(sopo, mataisan);
                if (checkhd.errCode !== 0) {
                    toast.warning('Mã tài sản đã được kiểm tra, không thể sửa');
                    // Hủy bỏ chế độ chỉnh sửa ô
                    event.api.stopEditing();
                    return;  // Kết thúc hàm tại đây nếu có lỗi
                }
            }
        },

        onCellEditingStopped: async (event) => {
            const { api, column, rowIndex } = event;
            if (event.colDef.field === 'soluongpo') {
                // console.log('editMaTaiSan', event.colDef.field)
                // Sử dụng giá trị thô từ biến tạm (được cập nhật trong quá trình nhập liệu)
                let rawValue = tempRawValue || event.value;
                if (typeof rawValue === 'string') {
                    // Chuyển đổi giá trị thô thành số
                    let numericValue = parseFloat(rawValue.replace(/\./g, ''));
                    // Kiểm tra giá trị hợp lệ và định dạng hiển thị
                    if (!isNaN(numericValue)) {
                        //console.log('Giá trị trước khi lưu:', numericValue); // Ghi lại giá trị
                        // Cập nhật giá trị số vào ô (dùng giá trị thực, không dấu chấm)
                        api.getRowNode(rowIndex).setDataValue(column.colId, numericValue);
                        // Làm mới lại ô để hiển thị giá trị đã định dạng với dấu phân tách hàng nghìn
                        api.refreshCells({
                            rowNodes: [api.getRowNode(rowIndex)],
                            columns: [column.colId]
                        });
                        // Định dạng giá trị thành chuỗi có dấu chấm
                        let formattedValue = new Intl.NumberFormat('vi-VN').format(numericValue);
                        // Cập nhật lại giá trị hiển thị đã định dạng
                        api.getRowNode(rowIndex).setDataValue(column.colId, formattedValue);

                        // Gọi API để cập nhật giá trị mới
                        const sopo = event.data.sopo; // Lấy giá trị `sopo` từ dữ liệu hàng
                        const rowId = event.data.id;  // Lấy `id` của hàng để gửi API

                        const dataEdit = {
                            soluongpo: numericValue,
                            sopo: sopo,
                            rowId: rowId,
                            loai: 'PO',
                            colsl: 'SL',
                        };

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
                                            let res_action = await handleGetAction(actionEditSoLuong);
                                            if (res_action && res_action.errCode === 0) {
                                                let res = await editMaTaiSan(dataEdit);  // Gọi API
                                                //console.log('editMaTaiSan', res)
                                                if (res && res.errCode === 0) {
                                                    newSocket.emit('edit_soluongpo_server', { data: res });  // Emit socket nếu thành công
                                                    toast.success(res.errMessage);
                                                } else {
                                                    onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                                                    toast.warning(res.errMessage);
                                                }
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
                    } else {
                        //console.log('Giá trị không hợp lệ:', event.value);
                    }
                    // Reset biến tạm sau khi kết thúc chỉnh sửa
                    tempRawValue = '';
                }
            } else if (event.colDef.field === 'dongiapo') {
                // Sử dụng giá trị thô từ biến tạm (được cập nhật trong quá trình nhập liệu)
                let rawValue = tempRawValue || event.value;
                if (typeof rawValue === 'string') {
                    // Chuyển đổi giá trị thô thành số
                    let numericValue = parseFloat(rawValue.replace(/\./g, ''));
                    // Kiểm tra giá trị hợp lệ và định dạng hiển thị
                    if (!isNaN(numericValue)) {
                        //console.log('Giá trị trước khi lưu:', numericValue); // Ghi lại giá trị
                        // Cập nhật giá trị số vào ô (dùng giá trị thực, không dấu chấm)
                        api.getRowNode(rowIndex).setDataValue(column.colId, numericValue);
                        // Làm mới lại ô để hiển thị giá trị đã định dạng với dấu phân tách hàng nghìn
                        api.refreshCells({
                            rowNodes: [api.getRowNode(rowIndex)],
                            columns: [column.colId]
                        });
                        // Định dạng giá trị thành chuỗi có dấu chấm
                        let formattedValue = new Intl.NumberFormat('vi-VN').format(numericValue);
                        // Cập nhật lại giá trị hiển thị đã định dạng
                        api.getRowNode(rowIndex).setDataValue(column.colId, formattedValue);

                        // Gọi API để cập nhật giá trị mới
                        const sopo = event.data.sopo; // Lấy giá trị `sopo` từ dữ liệu hàng
                        const rowId = event.data.id;  // Lấy `id` của hàng để gửi API

                        const dataEdit = {
                            dongiapo: numericValue,
                            sopo: sopo,
                            rowId: rowId,
                            loai: 'PO',
                            coldg: 'DG',
                        };

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
                                            let res_action = await handleGetAction(actionEditSoLuong);
                                            if (res_action && res_action.errCode === 0) {
                                                let res = await editMaTaiSan(dataEdit);  // Gọi API
                                                if (res && res.errCode === 0) {
                                                    newSocket.emit('edit_dongiapo_server', { data: res });  // Emit socket nếu thành công
                                                    toast.success(res.errMessage);
                                                } else {
                                                    onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                                                    toast.warning(res.errMessage);
                                                }
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
                    } else {
                        //console.log('Giá trị không hợp lệ:', event.value);
                    }
                    // Reset biến tạm sau khi kết thúc chỉnh sửa
                    tempRawValue = '';
                }
            } else if (event.colDef.field === 'vat') {
                // Sử dụng giá trị thô từ biến tạm (được cập nhật trong quá trình nhập liệu)
                let rawValue = tempRawValue || event.value;
                if (typeof rawValue === 'string') {
                    // Chuyển đổi giá trị thô thành số
                    let numericValue = parseFloat(rawValue.replace(/\./g, ''));

                    // Kiểm tra giá trị hợp lệ và định dạng hiển thị
                    if (!isNaN(numericValue)) {
                        //console.log('Giá trị trước khi lưu:', numericValue); // Ghi lại giá trị
                        // Cập nhật giá trị số vào ô (dùng giá trị thực, không dấu chấm)
                        api.getRowNode(rowIndex).setDataValue(column.colId, numericValue);
                        // Làm mới lại ô để hiển thị giá trị đã định dạng với dấu phân tách hàng nghìn
                        api.refreshCells({
                            rowNodes: [api.getRowNode(rowIndex)],
                            columns: [column.colId]
                        });
                        // Định dạng giá trị thành chuỗi có dấu chấm
                        let formattedValue = new Intl.NumberFormat('vi-VN').format(numericValue);
                        // Cập nhật lại giá trị hiển thị đã định dạng
                        api.getRowNode(rowIndex).setDataValue(column.colId, formattedValue);

                        // Gọi API để cập nhật giá trị mới
                        const sopo = event.data.sopo; // Lấy giá trị `sopo` từ dữ liệu hàng
                        const rowId = event.data.id;  // Lấy `id` của hàng để gửi API

                        const dataEdit = {
                            vat: numericValue,
                            sopo: sopo,
                            rowId: rowId,
                            loai: 'PO',
                            colvat: 'VAT',
                        };

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
                                            let res_action = await handleGetAction(actionEditSoLuong);
                                            if (res_action && res_action.errCode === 0) {
                                                let res = await editMaTaiSan(dataEdit);  // Gọi API
                                                if (res && res.errCode === 0) {
                                                    newSocket.emit('edit_vat_server', { data: res });  // Emit socket nếu thành công
                                                    toast.success(res.errMessage);
                                                } else {
                                                    onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                                                    toast.warning(res.errMessage);
                                                }
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
                    } else {
                        //console.log('Giá trị không hợp lệ:', event.value);
                    }
                    // Reset biến tạm sau khi kết thúc chỉnh sửa
                    tempRawValue = '';
                }
            } else if (event.colDef.field === 'mataisan') {
                //console.log('chạy hàm onCellEditingStopped')
                try {
                    const updatedField = event.colDef.field;
                    const mataisanNew = event.newValue;
                    const mataisanOld = event.oldValue;  // Lấy giá trị ban đầu
                    const rowId = event.data.id;
                    const tentaisanNew = event.newValue;
                    const sopo = event.data.sopo;

                    // Kiểm tra xem trường `mataisan` có được cập nhật không
                    if (updatedField === 'mataisan' && mataisanNew === mataisanOld) {  // Chỉ thực hiện khi giá trị mới giống giá trị cũ
                        const dataEdit = {
                            mataisanNew: mataisanNew,
                            sopo: sopo,
                            rowId: rowId,
                            loai: 'PO',
                            colma: 'MA',
                        };
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
                                            let res_action = await handleGetAction(actionEditMaTaiSan);
                                            if (res_action && res_action.errCode === 0) {
                                                let res = await editMaTaiSanNew(dataEdit);  // Gọi API
                                                if (res && res.errCode === 0) {
                                                    newSocket.emit('edit_mataisan_server', { data: res });  // Emit socket nếu thành công
                                                    toast.success(res.errMessage);
                                                } else {
                                                    onFetchAllPO();  // Reload lại danh sách nếu có lỗi
                                                    toast.warning(res.errMessage);
                                                }
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
                        // let res_action = await handleGetAction(actionEditMaTaiSan);
                        // if (res_action && res_action.errCode === 0) {
                        //     let res = await editMaTaiSanNew(dataEdit);
                        //     if (res && res.errCode === 0) {
                        //         socket.emit('edit_mataisan_server', { data: res });
                        //         toast.success(res.errMessage);
                        //     } else {
                        //         onFetchAllPO();
                        //         toast.warning(res.errMessage);
                        //     }
                        // }
                    }
                } catch (e) {
                    setLoadingImport(false);
                    console.error('Lỗi:', e);
                }
            }
        }
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

    // const onGridReady = useCallback(async () => {
    //     try {
    //         console.log('loadOnePO', loadOnePO)
    //         // let response = await fetchAllPO();
    //         // if (response && response.errCode === 0) {
    //         //     setRowData(response.data)
    //         // }
    //         if (!loadOnePO) {
    //             console.log('k có mã chứng từ')
    //             let response = await fetchAllPO();
    //             console.log('response old', response.data)
    //             if (response && response.errCode === 0) {
    //                 setRowData(response.data)
    //             }
    //         } else {
    //             console.log('có mã chứng từ')
    //             let response = await fetchOnePO(machungtu);
    //             console.log('response new', response.data)
    //             if (response && response.errCode === 0) {
    //                 setRowData(response.data)
    //             }
    //             setMaChungTu('');
    //             setLoadOnePO(false);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // }, [loadOnePO, machungtu]);

    const onFetchAllPO = useCallback(async () => {
        try {
            //console.log('fetching all PO');
            let response = await fetchAllPO();
            if (response && response.errCode === 0) {
                //console.log('response all', response.data);
                setRowData(response.data);
                setLoadOnePO(false);
            }
        } catch (error) {
            console.error("Error fetching all PO:", error);
        }
    }, []);

    const onFetchOnePO = useCallback(async () => {
        try {
            //console.log('fetching one PO with mã chứng từ:', machungtu);
            let response = await fetchOnePO(machungtu);
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
        //console.log('loadOnePO')
        if (!isUpdating && loadOnePO) {
            //console.log("loadOnePR is true, fetching one PR...", loadOnePO);
            onFetchOnePO();
            setLoadOnePO(false); // Tắt cờ sau khi hoàn thành
        }
    }, [isUpdating, loadOnePO, onFetchOnePO]);


    useEffect(() => {
        //console.log('loadAllPO')
        if (loadAllPO) {
            //console.log("Initial page load, fetching all PR...");
            onFetchAllPO();
            setLoadAllPO(false);  // Đặt lại cờ sau lần load ban đầu
        }
    }, [loadAllPO, onFetchAllPO]);

    // useEffect(() => {
    //     if (loadOnePO) {
    //         onFetchOnePO();  // Chỉ gọi fetchOnePO khi loadOnePO là true
    //     } else {
    //         onFetchAllPO();  // Gọi fetchAllPO khi loadOnePO là false
    //     }
    // }, [loadOnePO, onFetchAllPO, onFetchOnePO]);  // Thêm cả onFetchOnePO và onFetchAllPO vào dependencies


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
                setLoadAllPO(true);
                //onFetchAllPO();
                setSocketEventReceived(true);
            });

            socket.on("getmachungtu_client", (data) => {
                setLoadOnePO(true);
                //onFetchOnePO();
                setSocketEventReceived(true);
            });

            socket.on("edit_mataisan_client", (data) => {
                setLoadAllPO(true);
                //onFetchAllPO();
                setSocketEventReceived(true);
            });

            socket.on("edit_soluongpo_client", (data) => {
                setLoadAllPO(true);
                //onFetchAllPO();
                setSocketEventReceived(true);
            });

            socket.on("edit_dongiapo_client", (data) => {
                setLoadAllPO(true);
                //onFetchAllPO();
                setSocketEventReceived(true);
            });

            socket.on("edit_vat_client", (data) => {
                setLoadAllPO(true);
                //onFetchAllPO();
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
                    {/* <div className="col-md-2" style={{ width: '15%', minWidth: '100px' }}>
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
                    <div className="col-md-2">
                        <button
                            type="button"
                            className="btn btn-primary px-1 button-import"
                            onClick={handleGetChungTu}
                        >
                            {loadingDongBo && (
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            )}
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Đồng bộ</i>
                        </button>
                    </div> */}
                    <div className="col-md-2">
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
                            onClick={handleTaiDataPO}
                        >
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>Báo cáo</i>
                        </button>
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
                            <i style={{ fontSize: '13px', fontStyle: 'normal' }}>All PO</i>
                        </button>
                    </div>
                </div>
                <div className="ag-theme-alpine container" id='myGrid' style={gridStyle}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        masterDetail={true}
                        // detailCellRendererParams={detailCellRendererParams}
                        gridOptions={gridOptions}
                        pagination={true}
                        paginationPageSize='20'
                        onCellValueChanged={handleCellValueChanged}
                    //onCellEditingStopped={handleCellEditingStopped}
                    />
                </div>
                {/* <div>
                    <ModalLogCTPO
                        show={showModalLog}
                        rowDataLog={rowDataLog}
                        handleClose={handleClose}
                        socket={socket}
                        onFetchAllPO={onFetchAllPO}
                    />
                </div> */}
                <div>
                    <ModalLogPOPR
                        show={showModalLog}
                        rowDataLog={rowDataLog}
                        handleClose={handleClose}
                        socket={socket}
                        onFetchAllPR={onFetchAllPO}
                    />
                </div>
                <div>
                    <ModalXacNhanXoa
                        show={showModalXacNhanXoa}
                        dataXacNhanXoa={dataXacNhanXoa}
                        handleClose={handleClose}
                        onGridReady={onFetchAllPO}
                        socket={socket}
                    />
                </div>
            </div>
        </>
    );
};

export default DanhSachPO;