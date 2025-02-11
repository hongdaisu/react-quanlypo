
import React, { StrictMode, useCallback, useMemo, useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
// import * as XLSX from 'xlsx';
// import * as XLSX from 'xlsx-style';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { exportNhapNCC, exportBienLaiChiTiet, exportDoiChieuDongBo, exportKiemKe } from '../../services/exportServices';
import { fetchAllKhoQL } from '../../services/importService';
import { toast } from 'react-toastify';
import Select from 'react-select';

const BaoCao = () => {
    const [rowData, setRowData] = useState([]);
    const [tungay_ct, setTuNgayCT] = useState('');
    const [denngay_ct, setDenNgayCT] = useState('');

    const [tungay_kk, setTuNgayKK] = useState('');
    const [denngay_kk, setDenNgayKK] = useState('');

    const [tungay_chitiet, setTuNgayChiTiet] = useState('');
    const [denngay_chitiet, setDenNgayChiTiet] = useState('');

    const [tungay_dongbo, setTuNgayDongBo] = useState('');
    const [denngay_dongbo, setDenNgayDongBo] = useState('');

    const [selectedOptionKhoQL, setSelectedOptionKhoQL] = useState(null);
    const [optionsKhoQL, setOptionsKhoQL] = useState([]);
    const [KhoQuanLy, setKhoQuanLy] = useState('');

    const dataexportnhapncc = { tungay_ct, denngay_ct };
    const dataexportkiemke = { tungay_kk, denngay_kk, KhoQuanLy };
    const [loadingExport, setLoadingExport] = useState(false);
    const [loadingExportNCC, setLoadingExportNCC] = useState(false);

    //console.log('optionsKhoQL', optionsKhoQL)

    const handleExportNhapNCC = async () => {
        try {
            setLoadingExportNCC(true)
            let res = await exportNhapNCC(dataexportnhapncc);
            if (res && res.errCode === 0) {
                const formatCurrency = (value) => {
                    // Kiểm tra nếu value là số hợp lệ thì định dạng, nếu không thì trả về giá trị gốc
                    if (!isNaN(value)) {
                        const formattedValue = new Intl.NumberFormat('en-US').format(value);
                        //console.log('Giá trị gốc:', value, ' | Giá trị định dạng:', formattedValue); // In giá trị gốc và giá trị định dạng
                        return formattedValue;
                    }
                    //console.log('Giá trị không hợp lệ:', value); // In giá trị không hợp lệ nếu không phải số
                    return value;
                };

                const columnDefs = [
                    { header: "STT", field: "stt" },
                    { header: "Ngày chứng từ", field: "ngaychungtu" },
                    { header: "Mã chứng từ", field: "machungtu" },
                    { header: "Mã tài sản", field: "mataisan" },
                    { header: "Tên tài sản", field: "tentaisan" },
                    { header: "Đơn vị tính", field: "donvitinh" },
                    { header: "Số lượng", field: "soluongct" },
                    { header: "Đơn giá", field: "dongiact" },
                    { header: "Thành tiền", field: "thanhtienct" },
                    { header: "VAT", field: "vatct" },
                    { header: "Đơn giá VAT", field: "dongianhapctvat" },
                    { header: "Thành tiền VAT", field: "thanhtiennhapctvat" },
                    { header: "Tên nhà cung cấp", field: "tennhacungcap" },
                    { header: "Kho nhập", field: "khonhap" },
                    { header: "Người nhập", field: "nguoinhap" },
                    { header: "Số PO", field: "sopo" },
                    { header: "Ngày PO", field: "ngaypo" },
                    { header: "Số lượng PO", field: "soluongpo" },
                    { header: "Đơn giá PO", field: "dongiapo" },
                    { header: "VAT PO", field: "vat" },
                    { header: "Đơn giá VAT PO", field: "dongiapovat" },
                    { header: "Chênh lệch SL PO", field: "chenhlechslpo" },
                    { header: "Chênh lệch đơn giá PO", field: "chenhlechdgpo" },
                    { header: "Chênh lệch đơn giá VAT PO", field: "chenhlechdgvatpo" },
                    { header: "Số lượng đã nhập", field: "soluongpodanhap" },
                    { header: "Số PR", field: "sopr" },
                    { header: "Đơn giá HĐ", field: "dongiahd" },
                    { header: "Đơn giá VAT HĐ", field: "dongiahdvat" },
                    { header: "Chênh lệch đơn giá HĐ", field: "chenhlechdghd" },
                    { header: "Chênh lệch đơn giá Vat HĐ", field: "chenhlechdgvathd" },
                    { header: "Ngày hiệu lực", field: "ngayhieuluc" },
                    { header: "Ngày kết thúc", field: "ngayketthuc" },
                    { header: "Người kiểm tra", field: "nguoikiemtra" },
                    { header: "Ngày kiểm tra", field: "ngaykiemtra" },
                ];

                // Hàm để tính toán tên cột Excel theo chỉ số
                const getExcelColumnName = (colIndex) => {
                    let columnName = '';
                    while (colIndex > 0) {
                        let remainder = (colIndex - 1) % 26;
                        columnName = String.fromCharCode(65 + remainder) + columnName;
                        colIndex = Math.floor((colIndex - 1) / 26);
                    }
                    return columnName;
                };

                // Tạo workbook và worksheet
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Thống kê nhập NCC');

                // Thêm tiêu đề báo cáo
                const titleRow = worksheet.addRow(['Thống kê nhập NCC']);
                titleRow.font = { size: 16, bold: true };
                const lastColumn = getExcelColumnName(columnDefs.length); // Tính toán cột cuối cùng (ví dụ: AH cho cột 34)
                worksheet.mergeCells(`A1:${lastColumn}1`);
                titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

                // Thêm thông tin ngày
                const dateRangeRow = worksheet.addRow([`Từ ngày: ${tungay_ct} - Đến ngày: ${denngay_ct}`]);
                dateRangeRow.font = { size: 12, italic: true };
                worksheet.mergeCells(`A2:${lastColumn}2`);
                dateRangeRow.alignment = { vertical: 'middle', horizontal: 'center' };
                // Thêm header
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

                // Thêm dữ liệu
                res.report.forEach(dataRow => {
                    const row = worksheet.addRow(columnDefs.map(col => dataRow[col.field]));
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                });

                // Thiết lập border cho tất cả các ô
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

                // Tạo buffer và lưu file
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'Thống kê nhập NCC.xlsx');
                toast.success(res.errMessage);
                setLoadingExportNCC(false)
            } else {
                setLoadingExportNCC(false)
                toast.warning(res.errMessage)
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    const handleExportKiemKe = async () => {
        try {
            setLoadingExport(true);
            //console.log('loadingExport', loadingExport)
            let res = await exportKiemKe(dataexportkiemke);
            if (res && res.errCode === 0) {
                const formatCurrency = (value) => {
                    // Kiểm tra nếu value là số hợp lệ thì định dạng, nếu không thì trả về giá trị gốc
                    if (!isNaN(value)) {
                        const formattedValue = new Intl.NumberFormat('en-US').format(value);
                        //console.log('Giá trị gốc:', value, ' | Giá trị định dạng:', formattedValue); // In giá trị gốc và giá trị định dạng
                        return formattedValue;
                    }
                    //console.log('Giá trị không hợp lệ:', value); // In giá trị không hợp lệ nếu không phải số
                    return value;
                };

                const sortedData = res.report.sort((a, b) => {
                    if (a.KhoaPhongSuDung < b.KhoaPhongSuDung) return -1; // Sắp xếp tăng dần
                    //if (a.KhoaPhongSuDung > b.KhoaPhongSuDung) return 1;
                    return 0; // Bằng nhau thì giữ nguyên thứ tự
                });

                const columnDefs = [
                    {
                        header: "Trạng thái",
                        field: "IsCheckKiemKe",
                        valueFormatter: (params) => {
                            if (params.value === null) return "Chưa đồng bộ";
                            if (params.value === 0) return "Chưa kiểm kê";
                            if (params.value === 1) return "Đã kiểm kê";
                            return ""; // Trường hợp giá trị không xác định
                        },
                    },
                    {
                        header: "Lần kiểm kê",
                        field: "LanKiemKe",
                        valueFormatter: (params) => params.value || "",
                    },
                    { header: "Mã tài san", field: "MaTaiSan" },
                    { header: "Mã tài sản New", field: "MaTaiSanNew" },
                    {
                        header: "Bệnh viện",
                        field: "BenhVien",
                        valueFormatter: (params) => params.value || "",
                    },
                    {
                        header: "Phân loại",
                        field: "PhanLoai",
                        valueFormatter: (params) => params.value || "",
                    },
                    { header: "Tên tài sản", field: "TenTaiSan" },
                    {
                        header: "Model",
                        field: "Model",
                        valueFormatter: (params) => params.value || "",
                    },
                    {
                        header: "Serial",
                        field: "Serial",
                        valueFormatter: (params) => params.value || "",
                    },
                    {
                        header: "Thời gian đưa vào",
                        field: "ThoiGianDuaVao",
                        valueFormatter: (params) => {
                            if (!params.value) return ""; // Trả về chuỗi rỗng nếu không có giá trị
                            const date = new Date(params.value);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                        },
                    },
                    {
                        header: "Nguyên giá",
                        field: "NguyenGia",
                        valueFormatter: (params) => {
                            if (params.value == null) return ""; // Trả về rỗng nếu không có giá trị
                            return new Intl.NumberFormat("vi-VN").format(params.value);
                        },
                    },
                    {
                        header: "Số lượng",
                        field: "SoLuong",
                        valueFormatter: (params) => params.value || "",
                    },
                    { header: "Khoa phòng sử dụng", field: "KhoaPhongSuDung" },
                    {
                        header: "Vị trí",
                        field: "ViTri",
                        valueFormatter: (params) => params.value || "",
                    },
                    {
                        header: "Ghi chú",
                        field: "GhiChu",
                        valueFormatter: (params) => params.value || "",
                    },
                    { header: "Khoa quản lý", field: "KhoaQuanLy" },
                    { header: "Số lượng thực tế", field: "SoLuongThucTe" },
                    { header: "Chênh lệch", field: "ChenhLech" },
                    {
                        header: "Khoa phòng hiện tại",
                        field: "KhoaPhongHienTai",
                        valueFormatter: (params) => params.value || "",
                    },
                    {
                        header: "Vị trí hiện tại",
                        field: "ViTriHienTai",
                        valueFormatter: (params) => params.value || "",
                    },
                    {
                        header: "Ghi chú hiện tại",
                        field: "GhiChuHienTai",
                        valueFormatter: (params) => params.value || "",
                    },
                    {
                        header: "TinhTrang",
                        field: "TinhTrang",
                        valueFormatter: (params) => params.value || "",
                    },
                    {
                        header: "Ngày kiểm kê",
                        field: "NgayKiemKe",
                        valueFormatter: (params) => {
                            if (!params.value) return ""; // Trả về chuỗi rỗng nếu không có giá trị
                            const date = new Date(params.value);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                        },
                    },
                    { header: "Người kiểm kê", field: "NguoiTao" },
                    {
                        header: "Ngày xác nhận kiểm kê",
                        field: "NgayXacNhanKiemKe",
                        valueFormatter: (params) => {
                            if (!params.value) return ""; // Trả về chuỗi rỗng nếu không có giá trị
                            const date = new Date(params.value);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                        },
                    },
                    {
                        header: "Check mã tài sản",
                        field: "CheckMaTaiSan",
                        valueFormatter: (params) => {
                            if (params.value === 1) return "YES"; // Nếu giá trị là 1
                            if (params.value === 0) return "NO";  // Nếu giá trị là 0
                            return ""; // Trả về rỗng nếu không có giá trị
                        },
                    },
                    { header: "Duoc_Id", field: "Duoc_Id" },
                    { header: "ID", field: "id" },

                ];

                // Hàm để tính toán tên cột Excel theo chỉ số
                const getExcelColumnName = (colIndex) => {
                    let columnName = '';
                    while (colIndex > 0) {
                        let remainder = (colIndex - 1) % 26;
                        columnName = String.fromCharCode(65 + remainder) + columnName;
                        colIndex = Math.floor((colIndex - 1) / 26);
                    }
                    return columnName;
                };

                // Tạo workbook và worksheet
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Thống kê kiểm kê tài sản');

                // Thêm tiêu đề báo cáo
                const titleRow = worksheet.addRow(['Thống kê kiểm kê tài sản']);
                titleRow.font = { size: 16, bold: true };
                const lastColumn = getExcelColumnName(columnDefs.length); // Tính toán cột cuối cùng (ví dụ: AH cho cột 34)
                worksheet.mergeCells(`A1:${lastColumn}1`);
                titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

                // Hàm định dạng ngày
                const formatDate = (date) => {
                    const d = new Date(date); // Tạo đối tượng Date từ chuỗi ngày
                    const day = String(d.getDate()).padStart(2, '0'); // Lấy ngày, đảm bảo luôn có 2 chữ số
                    const month = String(d.getMonth() + 1).padStart(2, '0'); // Lấy tháng (0-11) + 1
                    const year = d.getFullYear(); // Lấy năm
                    return `${day}-${month}-${year}`; // Trả về chuỗi định dạng dd-mm-yyyy
                };

                // Định dạng lại ngày
                const formattedFromDate = formatDate(tungay_kk);
                const formattedToDate = formatDate(denngay_kk);

                // Thêm thông tin ngày
                const dateRangeRow = worksheet.addRow([`Từ ngày: ${formattedFromDate} - Đến ngày: ${formattedToDate}`]);
                dateRangeRow.font = { size: 12, italic: true };
                worksheet.mergeCells(`A2:${lastColumn}2`);
                dateRangeRow.alignment = { vertical: 'middle', horizontal: 'center' };
                // Thêm header
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

                // Thêm dữ liệu
                sortedData.forEach(dataRow => {
                    //const row = worksheet.addRow(columnDefs.map(col => dataRow[col.field]));
                    const row = worksheet.addRow(
                        columnDefs.map((col) => {
                            if (col.field === "IsCheckKiemKe") {
                                // Xử lý giá trị theo yêu cầu
                                if (dataRow[col.field] === null) return "Chưa đồng bộ";
                                if (dataRow[col.field] === 0) return "Chưa kiểm kê";
                                if (dataRow[col.field] === 1) return "Đã kiểm kê";
                                return ""; // Giá trị không xác định
                            }
                            // Xử lý cột NguyenGia
                            if (col.field === "NguyenGia") {
                                if (dataRow[col.field] == null) return ""; // Trả về rỗng nếu không có giá trị
                                return new Intl.NumberFormat("vi-VN").format(dataRow[col.field]); // Định dạng số
                            }

                            if (col.field === "ThoiGianDuaVao") {
                                if (!dataRow[col.field]) return ""; // Nếu giá trị là null hoặc không tồn tại
                                const date = new Date(dataRow[col.field]);
                                const day = String(date.getDate()).padStart(2, "0");
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const year = date.getFullYear();
                                return `${day}/${month}/${year}`; // Format ngày dạng DD/MM/YYYY
                            }

                            if (col.field === "NgayKiemKe") {
                                if (!dataRow[col.field]) return ""; // Nếu giá trị là null hoặc không tồn tại
                                const date = new Date(dataRow[col.field]);
                                const day = String(date.getDate()).padStart(2, "0");
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const year = date.getFullYear();
                                return `${day}/${month}/${year}`; // Format ngày dạng DD/MM/YYYY
                            }

                            if (col.field === "NgayXacNhanKiemKe") {
                                if (!dataRow[col.field]) return ""; // Nếu giá trị là null hoặc không tồn tại
                                const date = new Date(dataRow[col.field]);
                                const day = String(date.getDate()).padStart(2, "0");
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const year = date.getFullYear();
                                return `${day}/${month}/${year}`; // Format ngày dạng DD/MM/YYYY
                            }

                            if (col.field === "CheckMaTaiSan") {
                                // Xử lý giá trị theo yêu cầu
                                if (dataRow[col.field] === 0) return "NO";
                                if (dataRow[col.field] === 1) return "YES";
                                return ""; // Giá trị không xác định
                            }
                            // Giá trị mặc định cho các cột khác
                            return dataRow[col.field];
                        })
                    );
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                });

                // Thiết lập border cho tất cả các ô
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

                // Tạo buffer và lưu file
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'Thống kê kiểm kê tài sản.xlsx');
                toast.success(res.errMessage);
                setLoadingExport(false);
            } else {
                toast.warning(res.errMessage)
                setLoadingExport(false);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    const dataexportchitiet = { tungay_chitiet, denngay_chitiet };
    const handleExportExcelThuTienChiTiet = async () => {
        try {
            let res = await exportBienLaiChiTiet(dataexportchitiet);
            if (res && res.errCode === 0) {
                const formatCurrency = (value) => {
                    // Kiểm tra nếu value là số hợp lệ thì định dạng, nếu không thì trả về giá trị gốc
                    if (!isNaN(value)) {
                        const formattedValue = new Intl.NumberFormat('en-US').format(value);
                        //console.log('Giá trị gốc:', value, ' | Giá trị định dạng:', formattedValue); // In giá trị gốc và giá trị định dạng
                        return formattedValue;
                    }
                    //console.log('Giá trị không hợp lệ:', value); // In giá trị không hợp lệ nếu không phải số
                    return value;
                };

                const columnDefs = [
                    { header: "STT", field: "stt" },
                    { header: "Khoa phòng", field: "khoaphong" },
                    { header: "Mã y tế", field: "mayte" },
                    { header: "Số bệnh án", field: "sobenhan" },
                    { header: "Tên bệnh nhân", field: "tenbenhnhan" },
                    { header: "Tên dịch vụ", field: "tendichvu" },
                    { header: "Đơn vị tính", field: "donvitinh" },
                    { header: "Đơn giá", field: "dongia" },
                    { header: "Số lượng", field: "soluong" },
                    { header: "Người thu tiền", field: "nguoithutien" },
                    { header: "Ngày thu tiền", field: "ngaythubienlai" },
                    { header: "Người hủy", field: "nguoihuy" },
                    { header: "Ngày hủy", field: "ngayhuybienlai" },

                ];

                // Tạo workbook và worksheet
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Doanh thu chi tiết');

                // Thêm tiêu đề báo cáo
                const titleRow = worksheet.addRow(['Doanh thu chi tiết']);
                titleRow.font = { size: 16, bold: true };
                worksheet.mergeCells(`A1:${String.fromCharCode(65 + columnDefs.length - 1)}1`);
                titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

                // Thêm thông tin ngày
                const dateRangeRow = worksheet.addRow([`Từ ngày: ${tungay_chitiet} - Đến ngày: ${tungay_chitiet}`]);
                dateRangeRow.font = { size: 12, italic: true };
                worksheet.mergeCells(`A2:${String.fromCharCode(65 + columnDefs.length - 1)}2`);
                dateRangeRow.alignment = { vertical: 'middle', horizontal: 'center' };

                // Thêm header
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

                // Thêm dữ liệu
                res.report.forEach(dataRow => {
                    const row = worksheet.addRow(columnDefs.map(col => dataRow[col.field]));
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                });

                // Thiết lập border cho tất cả các ô
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

                // Tạo buffer và lưu file
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'Doanh thu chi tiết theo ngày.xlsx');
                toast.success(res.errMessage);
            } else {
                toast.warning(res.errMessage)
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };
    const dataexportdongbo = { tungay_dongbo, denngay_dongbo };
    const handleExportExcelDoiChieu = async () => {
        try {
            let res = await exportDoiChieuDongBo(dataexportdongbo);
            if (res && res.errCode === 0) {
                const formatCurrency = (value) => {
                    // Kiểm tra nếu value là số hợp lệ thì định dạng, nếu không thì trả về giá trị gốc
                    if (!isNaN(value)) {
                        const formattedValue = new Intl.NumberFormat('en-US').format(value);
                        //console.log('Giá trị gốc:', value, ' | Giá trị định dạng:', formattedValue); // In giá trị gốc và giá trị định dạng
                        return formattedValue;
                    }
                    //console.log('Giá trị không hợp lệ:', value); // In giá trị không hợp lệ nếu không phải số
                    return value;
                };

                const columnDefs = [
                    { header: "Khoa phòng", field: "TENPHONGBAN" },
                    { header: "Mã y tế", field: "MAYTE" },
                    { header: "Số bệnh án", field: "SOBENHAN" },
                    { header: "Tên bệnh nhân", field: "TENBENHNHAN" },
                    { header: "Giới tính", field: "GIOITINH" },
                    { header: "Ngày sinh", field: "NGAYSINH" },
                    { header: "Tuổi", field: "TUOI" },
                    { header: "Số điện thoại", field: "SODIENTHOAI" },
                    { header: "Địa chỉ", field: "DIACHITHUONGTRU" },
                    { header: "Ngày vào viện", field: "THOIGIANVAOKHOA" },
                    { header: "Ngày ra viện", field: "THOIGIANRAVIEN" },
                ];

                // Tạo workbook và worksheet
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Danh sách');

                // Thêm tiêu đề báo cáo
                const titleRow = worksheet.addRow(['Danh sách bệnh nhân chưa đồng bộ']);
                titleRow.font = { size: 16, bold: true };
                worksheet.mergeCells(`A1:${String.fromCharCode(65 + columnDefs.length - 1)}1`);
                titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

                // Thêm thông tin ngày
                const dateRangeRow = worksheet.addRow([`Từ ngày: ${tungay_dongbo} - Đến ngày: ${tungay_dongbo}`]);
                dateRangeRow.font = { size: 12, italic: true };
                worksheet.mergeCells(`A2:${String.fromCharCode(65 + columnDefs.length - 1)}2`);
                dateRangeRow.alignment = { vertical: 'middle', horizontal: 'center' };

                // Thêm header
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

                // Thêm dữ liệu
                res.report.forEach(dataRow => {
                    const row = worksheet.addRow(columnDefs.map(col => dataRow[col.field]));
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                });

                // Thiết lập border cho tất cả các ô
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

                // Tạo buffer và lưu file
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'Danh sách bệnh nhân chưa đồng bộ.xlsx');
                toast.success(res.errMessage);
            } else {
                toast.warning(res.errMessage)
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    const handleSelectChangeKhoQL = async (selectedOptionKhoQL) => {
        setSelectedOptionKhoQL(selectedOptionKhoQL);
        if (selectedOptionKhoQL) {
            setKhoQuanLy(selectedOptionKhoQL.value);
        } else {
            setSelectedOptionKhoQL(null)
            setOptionsKhoQL([])
        }
    };

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
        const fetchKhoQL = async () => {
            await getAllKhoQL();
        };
        fetchKhoQL();
    }, [selectedOptionKhoQL]);


    return (
        <>
            <ReactTooltip
                id="export"
                place="top"
                variant="info"
                content="Xuất báo cáo"
            />
            <div className="container-export">
                <div className="row-export">
                    <div className="row-lable">
                        <div className="col-md-12">
                            <label style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>Thống kê nhập nhà cung cấp:</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <label className="lable-input">Từ ngày:<i className='lable-i'>*</i></label>
                            <input type="date"
                                value={tungay_ct}
                                onChange={(e) => setTuNgayCT(e.target.value)}
                                className='form-control'
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="lable-input">Đến ngày:<i className='lable-i'>*</i></label>
                            <input type="date"
                                value={denngay_ct}
                                onChange={(e) => setDenNgayCT(e.target.value)}
                                className='form-control'
                            />
                        </div>
                        <div className="col-md-4">
                            <button
                                className="btn btn-primary px-1 export-button"
                                onClick={handleExportNhapNCC}
                                data-tooltip-id="export"
                                disabled={loadingExportNCC}
                                style={{
                                    display: 'flex', // Sử dụng flexbox
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative', // Giữ vị trí tương đối để tránh xung đột
                                }}
                            >
                                {loadingExportNCC ? (
                                    <i
                                        className="fas fa-spinner fa-spin"
                                        style={{
                                            transform: 'translateY(-50%)',
                                            color: 'blue',
                                            fontSize: '16px',
                                        }}
                                    ></i>
                                ) : (
                                    <i className="fa fa-file icon-report"></i>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row-export">
                    <div className="row-lable">
                        <div className="col-md-12">
                            <label style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>Thống kê kiểm kê tài sản:</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <label className="lable-input">Từ ngày:<i className='lable-i'>*</i></label>
                            <input type="date"
                                value={tungay_kk}
                                onChange={(e) => setTuNgayKK(e.target.value)}
                                className='form-control'
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="lable-input">Đến ngày:<i className='lable-i'>*</i></label>
                            <input type="date"
                                value={denngay_kk}
                                onChange={(e) => setDenNgayKK(e.target.value)}
                                className='form-control'
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="lable-input">Kho quản lý:<i className='lable-i'>*</i></label>
                            {/* <div className='col-md-2 d-flex custom-font-label-kiemke'> */}
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
                                        marginLeft: '0px',
                                        fontSize: '11px',
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                        minHeight: '33px',
                                        minWidth: '150px',
                                        height: '38px',
                                        with: '150px',
                                        position: 'relative',

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
                            {/* </div> */}
                        </div>
                        <div className="col-md-3">
                            <button
                                className="btn btn-primary px-1 export-button"
                                onClick={handleExportKiemKe}
                                data-tooltip-id="export"
                                disabled={loadingExport} // Đặt thuộc tính ở đây
                                style={{
                                    display: 'flex', // Sử dụng flexbox
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative', // Giữ vị trí tương đối để tránh xung đột
                                }}
                            >
                                {/* Nội dung nút hoặc biểu tượng */}
                                {loadingExport ? (
                                    <i
                                        className="fas fa-spinner fa-spin"
                                        style={{
                                            transform: 'translateY(-50%)',
                                            color: 'blue',
                                            fontSize: '16px',
                                        }}
                                    ></i>
                                ) : (
                                    <i className="fa fa-file icon-report"></i>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BaoCao;