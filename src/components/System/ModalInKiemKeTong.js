import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { deleteGroupService } from '../../services/grouproleService'
import { deleteRoleService } from '../../services/grouproleService'
import { deleteUser } from '../../services/userServices'
import { deletePhongBan } from '../../services/phongbanServices'
import { fetchAllNhanVien, fetchAllNhanVienPhong, fetchAllNguoiLap, fetchKeToanTaiSan, fetchKeToanTruong, fetchGiamDoc } from '../../services/importService'
import { deleteNhanVien } from '../../services/nhanvienServices'
import { toast } from 'react-toastify';
import Select from 'react-select';

const ModalInKiemKeTong = (props) => {
    const { show, socket, handleClose, dataXacNhanXoa } = props;

    const [selectedOptionNhanVien, setSelectedOptionNhanVien] = useState(null);
    const [optionsNhanVien, setOptionsNhanVien] = useState([]);
    const [NhanVien_Id, setNhanVien_Id] = useState('');
    const [TenNhanVien, setTenNhanVien] = useState('');
    const [TenChucDanh, setTenChucDanh] = useState('');
    const [TenPhongBan, setTenPhongBan] = useState('');

    const [selectedOptionNguoiLap, setSelectedOptionNguoiLap] = useState(null);
    const [optionsNguoiLap, setOptionsNguoiLap] = useState([]);
    const [NguoiLap_Id, setNguoiLap_Id] = useState('');
    const [TenNguoiLap, setTenNguoiLap] = useState('');
    const [TenChucDanhNguoiLap, setTenChucDanhNguoiLap] = useState('');

    const [KeToanTruong, setKeToanTruong] = useState('');
    const [KeToanTaiSan, setKeToanTaiSan] = useState('');
    const [GiamDoc, setGiamDoc] = useState('');

    const [selectedOptionNhanVienPhong, setSelectedOptionNhanVienPhong] = useState(null);
    const [optionsNhanVienPhong, setOptionsNhanVienPhong] = useState([]);
    const [NhanVienPhong_Id, setNhanVienPhong_Id] = useState('');
    const [TenNhanVienPhong, setTenNhanVienPhong] = useState('');
    const [TenNhanVienPhongBan, setTenNhanVienPhongBan] = useState('');
    const [TenChucDanhNhanVienPhong, setTenChucDanhNhanVienPhong] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    //console.log('dataXacNhanXoa', TenNhanVien, TenChucDanh, TenPhongBan)

    const handleCloseModal = () => {
        //setIsLoading(false);
        handleClose();
    }

    const getAllNhanVien = async () => {
        let response = await fetchAllNhanVien();
        //console.log('getAllNhanVien', response)
        const data = response.data.map(item => ({
            value: item.NhanVien_Id,
            label: item.TenNhanVienPhong,
            nhanVien: item.TenNhanVien,
            chucDanh: item.TenChucDanh,
            phongBan: item.TenKhoaPhong
        }));
        if (response && response.errCode === 0) {
            setOptionsNhanVien(data)
        }
    }

    const getAllNguoiLap = async () => {
        let response = await fetchAllNguoiLap();
        //console.log('getAllNhanVien', response)
        const data = response.data.map(item => ({
            value: item.NguoiLap_Id,
            label: item.TenNguoiLap,
            chucDanh: item.TenChucDanhNguoiLap
        }));
        if (response && response.errCode === 0) {
            setOptionsNguoiLap(data)
        }
    }

    const getKeToanTruong = async () => {
        let response = await fetchKeToanTruong();
        //console.log('getAllNhanVien', response)
        const data = response.data.map(item => ({
            value: item.KeToanTruong,
            label: item.KeToanTruong,
        }));
        if (response && response.errCode === 0) {
            setKeToanTruong(data)
        }
    }

    const getGiamDoc = async () => {
        let response = await fetchGiamDoc();
        //console.log('getAllNhanVien', response)
        const data = response.data.map(item => ({
            value: item.GiamDoc,
            label: item.GiamDoc,
        }));
        if (response && response.errCode === 0) {
            setGiamDoc(data)
        }
    }

    const getKeToanTaiSan = async () => {
        let response = await fetchKeToanTaiSan();
        //console.log('getAllNhanVien', response)
        const data = response.data.map(item => ({
            value: item.KeToanTaiSan,
            label: item.KeToanTaiSan,
        }));
        if (response && response.errCode === 0) {
            setKeToanTaiSan(data)
        }
    }


    const handleSelectChangeNguoiLap = (selectedOptionNguoiLap) => {
        setSelectedOptionNguoiLap(selectedOptionNguoiLap);
        setNguoiLap_Id({ ...NhanVien_Id, NhanVien_Id: selectedOptionNguoiLap.value });
        const tenNguoiLap = selectedOptionNguoiLap?.label;
        const tenChucDanhNguoiLap = selectedOptionNguoiLap?.chucDanh;
        setTenNguoiLap(tenNguoiLap);
        setTenChucDanhNguoiLap(tenChucDanhNguoiLap);
    };


    const getAllNhanVienPhong = async () => {
        let response = await fetchAllNhanVienPhong();
        //console.log('getAllNhanVien', response)
        const data = response.data.map(item => ({
            value: item.NhanVienPhong_Id,
            label: item.TenNhanVienPhong,
            nhanVien: item.TenNhanVien,
            chucDanh: item.TenChucDanh
        }));
        if (response && response.errCode === 0) {
            setOptionsNhanVienPhong(data)
        }
    }

    const handleSelectChangeNhanVien = (selectedOptionNhanVien) => {
        setSelectedOptionNhanVien(selectedOptionNhanVien);
        setNhanVien_Id({ ...NhanVien_Id, NhanVien_Id: selectedOptionNhanVien.value });
        const tenNhanVien = selectedOptionNhanVien?.nhanVien;
        const tenChucDanh = selectedOptionNhanVien?.chucDanh;
        const tenPhongBan = selectedOptionNhanVien?.phongBan;
        setTenNhanVien(tenNhanVien);
        setTenChucDanh(tenChucDanh);
        setTenPhongBan(tenPhongBan);
    };

    const handleSelectChangeNhanVienPhong = (selectedOptionNhanVienPhong) => {
        setSelectedOptionNhanVienPhong(selectedOptionNhanVienPhong);
        setNhanVienPhong_Id({ ...NhanVienPhong_Id, NhanVienPhong_Id: selectedOptionNhanVienPhong.value });
        const tenNhanVienPhong = selectedOptionNhanVienPhong?.nhanVien;
        const tenChucDanhPhong = selectedOptionNhanVienPhong?.chucDanh;
        setTenNhanVienPhongBan(tenNhanVienPhong);
        setTenChucDanhNhanVienPhong(tenChucDanhPhong);
    };

    const handleButtonIn = async () => {
        try {
            // console.log('dataXacNhanXoa.rowData a', dataXacNhanXoa, KhoaPhongSuDungA)
            if (!selectedOptionNguoiLap) {
                toast.warning('Vui lòng chọn người lập');
                return;
            }

            if (!selectedOptionNhanVien) {
                toast.warning('Vui lòng chọn trưởng khoa/điều dưỡng trưởng');
                return;
            }

            if (!selectedOptionNhanVienPhong) {
                toast.warning('Vui lòng chọn nhân viên');
                return;
            }
            // Lưu rowData vào sessionStorage
            sessionStorage.setItem('rowData', JSON.stringify(dataXacNhanXoa.rowData));

            // Mở tab mới
            const printWindow = window.open('', '_blank');
            // Lấy thông tin khoa phòng từ rowData
            //const KhoaPhongSuDung = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].KhoaPhongSuDung : '';
            let KhoaPhongSuDung = '';
            if (dataXacNhanXoa.Nhom === 'inkiemketongtv') {
                KhoaPhongSuDung = TenPhongBan;
            } else if (dataXacNhanXoa.Nhom === 'inkiemketongkp') {
                KhoaPhongSuDung = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].KhoaPhongSuDung : '';
            }
            const NguoiKiemKe = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].NguoiTao : '';
            const ChucDanhKiemKe = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].ChucDanh : '';
            const NamKiemKe = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].NamKiemKe : '';
            const GioBatDau = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].GioBatDau : '';
            const TuNgayKK = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].TuNgayKK : '';
            const TuThangKK = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].TuThangKK : '';
            const TuNamKK = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].TuNamKK : '';
            const DenNgayKK = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].DenNgayKK : '';
            const DenThangKK = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].DenThangKK : '';
            const DenNamKK = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].DenNamKK : '';

            const TenKeToanTruong = KeToanTruong.length > 0 ? KeToanTruong[0].label : null;
            const TenKeToanTaiSan = KeToanTaiSan.length > 0 ? KeToanTaiSan[0].label : null;
            const TenGiamDoc = GiamDoc.length > 0 ? GiamDoc[0].label : null;

            // Ghi nội dung HTML vào tab mới
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Preview</title>
                        <style>
                            @page {
                                size: A4 landscape; 
                                margin: 10mm;
                            }
                            body {
                                font-family: Arial, sans-serif;
                                font-size: 10px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                border-collapse: collapse; 
                                border: 1px solid #000;
                            }
                            th, td {
                                padding: 4px;
                                border: 1px solid #ddd;
                                font-size: 9px;
                                border: 1px solid #000;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                            .location-info {
                                text-align: right;
                                margin-top: 20px;
                                font-weight: bold;
                            }
                            .info-container {
                                display: flex;
                                justify-content: space-between;
                                margin-top: 10px;
                            }
                            .info-tp,
                            .info-nv,
                            .info-nvp {
                                flex: 1;
                                text-align: center;
                            }
                            .info-container-ky {
                                display: flex;
                                justify-content: space-between;
                                margin-top: 50px;
                            }
                            .info-container-ky div {
                                width: 30%;
                                text-align: center;
                            }
                             #printButton {
                                background-color: #007bff;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 14px;
                                transition: background-color 0.3s ease;
                            }

                            #printButton:hover {
                                background-color: #0056b3; /* Màu khi hover */
                            }

                            #printButton:active {
                                background-color: #004080; /* Màu khi click */
                            }
                            @media print {
                                #printButton {
                                    display: none;
                                }
                                .info-container {
                                    display: flex;
                                    justify-content: space-between;
                                    margin-bottom: 20px;
                                }

                                .info-container-ky {
                                    display: flex;
                                    justify-content: space-between;
                                    margin-bottom: 20px;
                                }

                                .info-tp,
                                .info-nv,
                                .info-nvp {
                                    flex: 1;
                                    text-align: center;
                                    margin: 0;
                                    padding: 0;
                                }

                                .info-container-ky div {
                                    flex: 1;
                                    text-align: center;
                                    margin: 0;
                                    padding: 0;
                                }
                            }

                            .container {
                                display: flex;
                                border: 1px solid #ccc;
                                border-radius: 8px;
                                width: 100%;
                                height:50px;
                            }
                            .column1 {
                                flex: 1;
                                padding: 10px;
                                flex-direction: column;
                                height:30px;
                                display: flex;
                                align-items: center; /* Canh giữa theo chiều dọc */
                                justify-content: center; /* Canh giữa theo chiều ngang */
                                overflow: hidden; /* Ẩn phần thừa nếu ảnh lớn hơn div */
                            }
                            .column2 {
                                flex: 1;
                                padding: 10px;
                                flex-direction: column;
                                height:30px;
                                display: flex;
                                align-items: center; /* Canh giữa theo chiều dọc */
                                justify-content: center; /* Canh giữa theo chiều ngang */
                                overflow: hidden; /* Ẩn phần thừa nếu ảnh lớn hơn div */
                            }
                            .full-width-image {
                                height: 100%; /* Chiều cao ảnh bằng chiều cao div */
                                width: auto; /* Chiều rộng tự động theo tỷ lệ */
                                object-fit: contain; /* Đảm bảo ảnh nằm gọn trong khung mà không bị méo */
                            }
                            .column img {
                                max-width: 100%;
                                height: 50px;
                                border-radius: 8px;
                                margin-right: 100px;
                            }
                          
                            .column2 h4 {
                                margin: 0; 
                                line-height: 1.2; 
                                font-size: 12px; 
                            }
                            .column h4 {
                                margin: 0; 
                                line-height: 1.2; 
                                font-size: 12px; 
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="column">
                                <img src='/logohmdnnew.png' alt='description' className='full-width-image' />
                            </div>
                            <div class="column2" style="width: 400px;">
                                <h4>TẬP ĐOÀN Y KHOA HOÀN MỸ</h4>
                                <h4>BIÊN BẢN KIỂM KÊ TÀI SẢN NĂM ${NamKiemKe}</h4>
                                <h4>FIXED ASSETS, TOOLS & EQUIPMENT COUNT MINUTE</h4>
                            </div>
                            <div class="column">
                                <h4>Mã số: HMC-AC-RE-09.F05</h4>
                                <h4>Lần soát xét: 02</h4>
                                <h4>Hiệu lực: 30/11/2023</h4>
                            </div>
                        </div>
                        <h2>Đơn vị/Unit : BỆNH VIỆN ĐA KHOA HOÀN MỸ ĐÀ NẴNG</h2>
                        <p><strong>Bộ phận/Department: ${KhoaPhongSuDung}</strong></p>
                        <p style="padding-left: 30px;"><strong>Thời điểm kiểm kê: ${GioBatDau} giờ, từ ngày ${TuNgayKK} tháng ${TuThangKK} năm ${TuNamKK} đến ngày ${DenNgayKK} tháng ${DenThangKK} năm ${DenNamKK}</strong></p>
                        <p style="padding-left: 30px;"><strong style="font-style: italic; font-weight: normal;">Time of inventory count:</strong></p>
                        <p><strong>Ban kiểm kê/Participants:</strong></p>
                        <p style="display: flex; align-items: center;padding-left: 30px;font-weight: bold;">
                            <span style="width: 50px;flex-shrink: 0;">Ông/Bà:</span>
                            <span style="flex: 0 0 170px;"> ${TenNhanVien}</span>
                            <span style="width: 50px;text-align: right;margin-left:50px;flex-shrink: 0;">Chức vụ:</span>
                            <span style="flex: 0 0 170px;"> ${TenChucDanh}</span>
                            <span style="width: 50px;text-align: right;margin-left:30px;flex-shrink: 0;">Đại diện:</span>
                            <span style="flex: 0 0 300px;"> ${KhoaPhongSuDung}</span>
                        </p>
                        <p style="display: flex; align-items: center;padding-left: 30px;font-weight: bold;">
                            <span style="width: 50px;flex-shrink: 0;">Ông/bà:</span>
                            <span style="flex: 0 0 170px;"> ${TenNhanVienPhongBan}</span>
                            <span style="width: 50px;text-align: right;margin-left:50px;flex-shrink: 0;">Chức vụ:</span>
                            <span style="flex: 0 0 170px;">${TenChucDanhNhanVienPhong}</span>
                            <span style="width: 50px;text-align: right;margin-left:30px;flex-shrink: 0;">Đại diện:</span>
                            <span style="flex: 0 0 300px;"> ${KhoaPhongSuDung}</span>
                        </p>
                        <p style="display: flex; align-items: center;padding-left: 30px;font-weight: bold;">
                            <span style="width: 50px;flex-shrink: 0;">Ông/bà:</span>
                            <span style="flex: 0 0 170px;"> ${TenKeToanTruong}</span>
                            <span style="width: 50px;text-align: right;margin-left:50px;flex-shrink: 0;">Chức vụ:</span>
                            <span style="flex: 0 0 170px;">Kế toán trưởng</span>
                            <span style="width: 50px;text-align: right;margin-left:30px;flex-shrink: 0;">Đại diện:</span>
                            <span style="flex: 0 0 170px;"> Phòng TCKT</span>
                        </p>
                        <p style="display: flex; align-items: center;padding-left: 30px;font-weight: bold;">
                            <span style="width: 50px;flex-shrink: 0;">Ông/bà:</span>
                            <span style="flex: 0 0 170px;"> ${TenNguoiLap}</span>
                            <span style="width: 50px;text-align: right;margin-left:50px;flex-shrink: 0;">Chức vụ:</span>
                            <span style="flex: 0 0 170px;">Kế toán TSCĐ</span>
                            <span style="width: 50px;text-align: right;margin-left:30px;flex-shrink: 0;">Đại diện:</span>
                            <span style="flex: 0 0 170px;"> Phòng TCKT</span>
                        </p>
                        <p><strong>Đã kiểm kê các tài sản dưới đây/Assets have been counted, the results as below</strong></p>
                        <table>
                            <thead>
                                <tr>
                                    <th rowspan="4">STT</th>
                                    <th>Tên TSCĐ, Công cụ dụng cụ</th>
                                    <th>Mã số</th>
                                    <th>Mẫu mã</th>
                                    <th>Nơi sử dụng</th>
                                    <th>Khoa phòng</th>
                                    <th>Thời gian đưa vào sử dụng</th>
                                    <th>Nguyên giá</th>
                                    <th colspan="3">Số lượng</th>
                                    <th>Tình trạng tài sản</th>
                                    <th>Ghi chú</th>
                                </tr>
                                <!-- Sub-header 1 -->
                                <tr>
                                    <th rowspan="3">Assets name</th>
                                    <th rowspan="3">Code</th>
                                    <th rowspan="3">Model</th>
                                    <th rowspan="3">Location</th>
                                    <th rowspan="3">Department</th>
                                    <th rowspan="3">Time put into use</th>
                                    <th rowspan="3">Original price</th>
                                    <th colspan="3">Quantity</th>
                                    <th rowspan="3">Status of assets</th>
                                    <th rowspan="3">Note</th>
                                </tr>
                                <!-- Sub-header 2 -->
                                <tr>
                                    <th>Sổ sách</th>
                                    <th>Thực tế</th>
                                    <th>Chênh lệch</th>
                                </tr>
                                <!-- Sub-header 3 -->
                                <tr>
                                    <th>Per book</th>
                                    <th>Actual</th>
                                    <th>Difference</th>
                                </tr>
                                <!-- Sub-header 4 -->
                                <tr>
                                    <th>A</th>
                                    <th>B</th>
                                    <th>C</th>
                                    <th>D</th>
                                    <th>E</th>
                                    <th>1</th>
                                    <th>2</th>
                                    <th>3</th>
                                    <th>4</th>
                                    <th>5</th>
                                    <th>6</th>
                                    <th>7</th>
                                    <th>8</th>
                                </tr>
                            </thead>
                            <tbody id="table-body"></tbody>
                        </table>
                        <div class="location-info">
                            <strong>Đà Nẵng, Ngày…………..Tháng……………..Năm ${NamKiemKe}</strong>
                        </div>
                        <div class="info-container">
                            <div class="info-tp"><strong>Người lập</strong></div>
                            <div class="info-tp"><strong>Trưởng khoa phòng</strong></div>
                            <div class="info-tp"><strong>Thủ kho khoa phòng</strong></div>
                            <div class="info-nv"><strong>Kế toán trưởng</strong></div>
                            <div class="info-nvp"><strong>Giám đốc bệnh viện</strong></div>
                        </div>
                        <div class="info-container-ky">
                            <div><strong>${TenNguoiLap}</strong></div>
                            <div><strong>${TenNhanVien}</strong></div>
                            <div><strong>${TenNhanVienPhongBan}</strong></div>
                            <div><strong>${TenKeToanTruong}</strong></div>
                            <div><strong>${TenGiamDoc}</strong></div>
                        </div>
                        <div class="info-container">
                            <button id="printButton">In biên bản</button>
                        </div>
                        <script>
                            const rowData = JSON.parse(sessionStorage.getItem('rowData')) || [];
                            const tableBody = document.getElementById('table-body');
    
                            rowData.forEach((item, index) => {
                                if (item.IsCheckKiemKe === 1) {
                                const row = document.createElement('tr');
                                row.innerHTML = \`
                                    <td style="text-align: center;">\${index + 1}</td>
                                    <td>\${item.TenTaiSan || ''}</td>
                                    <td>\${item.MaTaiSanNew || ''}</td>
                                    <td>\${item.Serial || ''}</td>
                                    <td>\${item.ViTri || ''}</td>
                                    <td>\${item.KhoaPhongSuDung || ''}</td>
                                    <td style="text-align: center;">\${item.ThoiGianDuaVao ? new Date(item.ThoiGianDuaVao).toLocaleDateString('vi-VN') : ''}</td>
                                    <td style="text-align: center;">\${item.NguyenGia ? item.NguyenGia.toLocaleString() : ''}</td>
                                    <td style="text-align: center;">\${item.SoLuong || ''}</td>
                                    <td style="text-align: center;">\${item.SoLuongThucTe || ''}</td>
                                    <td style="text-align: center;">\${item.ChenhLech === null || item.ChenhLech === undefined ? 0 : item.ChenhLech}</td>
                                    <td>\${item.TinhTrang || ''}</td>
                                    <td>\${item.GhiChuHienTai || ''}</td>
                                \`;
                                tableBody.appendChild(row);
                                }
                            });
    
                            document.getElementById('printButton').addEventListener('click', () => window.print());
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        } catch (e) {
            console.error('Đã xảy ra lỗi khi mở trang in:', e);
        }
    };


    useEffect(() => {
        if (socket) {
            // socket.on('huyxacnhan_kiemke_client', (data) => {
            //     //console.log('Socket event received', dataXacNhanXoa.KhoTaiSan_Id, dataXacNhanXoa.UserId);
            //     if (typeof onGridReady === 'function') {
            //         sessionStorage.removeItem('KhoTaiSan_Id');
            //         sessionStorage.removeItem('TimKiemKhoTaiSan_Id');
            //         setTimeout(() => {
            //             onGridReady(null, dataXacNhanXoa.UserId);
            //             //onGridReady();
            //         }, 500);
            //     } else {
            //         console.warn('onGridReady is not a function');
            //     }
            // });
        }
        return () => {
            if (socket) {
                socket.off('huyxacnhan_kiemke_client');
            }
        };
    }, [socket]);

    useEffect(() => {
        if (show) {
            getAllNhanVien();
            getAllNguoiLap();
            getKeToanTaiSan();
            getKeToanTruong();
            getGiamDoc();
            getAllNhanVienPhong();
        } else {
            setSelectedOptionNhanVien(null);
            setSelectedOptionNguoiLap(null);
            setSelectedOptionNhanVienPhong(null);
            setKeToanTaiSan('')
            setKeToanTruong('')
            setGiamDoc('')
        }
    }, [show])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Thông tin biên bản kiểm kê</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='row input-row-ts select-container-user'>
                        <div className='col-md-12 custom-font-label'>
                            <label className=''>Người lập:</label>
                            <Select
                                value={selectedOptionNguoiLap}
                                onChange={handleSelectChangeNguoiLap}
                                options={optionsNguoiLap}
                                menuPlacement="bottom"
                                placeholder=""
                                // isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 140,
                                        marginTop: '-1px'
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                        minHeight: '33px',  // Đặt chiều cao tối thiểu của ô input
                                        height: '33px',     // Đặt chiều cao cố định cho ô input
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        fontFamily: 'Arial, sans-serif',
                                        fontSize: '12px',
                                    }),
                                }}
                            />
                        </div>
                        <div className='col-md-12 custom-font-label' style={{ marginTop: '10px' }}>
                            <label className=''>Trưởng khoa-Điều dưỡng trưởng:</label>
                            <Select
                                value={selectedOptionNhanVien}
                                onChange={handleSelectChangeNhanVien}
                                options={optionsNhanVien}
                                menuPlacement="bottom"
                                placeholder=""
                                // isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 120,
                                        marginTop: '-1px'
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                        minHeight: '33px',  // Đặt chiều cao tối thiểu của ô input
                                        height: '33px',     // Đặt chiều cao cố định cho ô input
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        fontFamily: 'Arial, sans-serif',
                                        fontSize: '12px',
                                    }),
                                }}
                            />
                        </div>
                        <div className='col-md-12 custom-font-label' style={{ marginTop: '10px' }}>
                            <label className=''>Thủ kho khoa phòng:</label>
                            <Select
                                value={selectedOptionNhanVienPhong}
                                onChange={handleSelectChangeNhanVienPhong}
                                options={optionsNhanVienPhong}
                                menuPlacement="bottom"
                                placeholder=""
                                // isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 100,
                                        marginTop: '-1px'
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                        minHeight: '33px',  // Đặt chiều cao tối thiểu của ô input
                                        height: '33px',     // Đặt chiều cao cố định cho ô input
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        fontFamily: 'Arial, sans-serif',
                                        fontSize: '12px',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => handleButtonIn()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>IN</i></Button>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalInKiemKeTong;