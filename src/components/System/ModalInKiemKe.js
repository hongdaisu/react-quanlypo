import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { deleteGroupService } from '../../services/grouproleService'
import { deleteRoleService } from '../../services/grouproleService'
import { deleteUser } from '../../services/userServices'
import { deletePhongBan } from '../../services/phongbanServices'
import { fetchAllNhanVien, fetchAllNhanVienPhong } from '../../services/importService'
import { deleteNhanVien } from '../../services/nhanvienServices'
import { toast } from 'react-toastify';
import Select from 'react-select';

const ModalInKiemKe = (props) => {
    const { show, socket, handleClose, dataXacNhanXoa } = props;

    const [selectedOptionNhanVien, setSelectedOptionNhanVien] = useState(null);
    const [optionsNhanVien, setOptionsNhanVien] = useState([]);
    const [NhanVien_Id, setNhanVien_Id] = useState('');
    const [TenNhanVien, setTenNhanVien] = useState('');
    const [TenChucDanh, setTenChucDanh] = useState('');

    const [selectedOptionNhanVienPhong, setSelectedOptionNhanVienPhong] = useState(null);
    const [optionsNhanVienPhong, setOptionsNhanVienPhong] = useState([]);
    const [NhanVienPhong_Id, setNhanVienPhong_Id] = useState('');
    const [TenNhanVienPhong, setTenNhanVienPhong] = useState('');
    const [TenNhanVienPhongBan, setTenNhanVienPhongBan] = useState('');
    const [TenChucDanhNhanVienPhong, setTenChucDanhNhanVienPhong] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    //console.log('dataXacNhanXoa', dataXacNhanXoa.rowData)

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
            chucDanh: item.TenChucDanh
        }));
        if (response && response.errCode === 0) {
            setOptionsNhanVien(data)
        }
    }

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
        setTenNhanVien(tenNhanVien);
        setTenChucDanh(tenChucDanh);
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
            const KhoaPhongSuDung = dataXacNhanXoa.rowData.length > 0 ? dataXacNhanXoa.rowData[0].KhoaPhongSuDung : '';
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
                        </style>
                    </head>
                    <body>
                        <h1 style="text-align: center;">BIÊN BẢN KIỂM KÊ TSCC SỬ DỤNG TẠI KHOA PHÒNG NĂM ${NamKiemKe}</h1>
                        <p><strong>Ban kiểm kê gồm:</strong></p>
                        <p style="display: flex; align-items: center;padding-left: 30px;font-weight: bold;">
                            <span style="width: 50px;flex-shrink: 0;">Ông/Bà:</span>
                            <span style="flex: 0 0 170px;"> ${TenNhanVien}</span>
                            <span style="width: 50px;text-align: right;margin-left:50px;flex-shrink: 0;">Chức vụ:</span>
                            <span style="flex: 0 0 170px;"> ${TenChucDanh}</span>
                        </p>
                        <p style="display: flex; align-items: center;padding-left: 30px;font-weight: bold;">
                            <span style="width: 50px;flex-shrink: 0;">Ông/bà:</span>
                            <span style="flex: 0 0 170px;"> ${TenNhanVienPhongBan}</span>
                            <span style="width: 50px;text-align: right;margin-left:50px;flex-shrink: 0;">Chức vụ:</span>
                            <span style="flex: 0 0 170px;">${TenChucDanhNhanVienPhong}</span>
                        </p>
                        <p style="display: flex; align-items: center;padding-left: 30px;font-weight: bold;">
                            <span style="width: 50px;flex-shrink: 0;">Ông/bà:</span>
                            <span style="flex: 0 0 170px;"> ${NguoiKiemKe}</span>
                            <span style="width: 50px;text-align: right;margin-left:50px;flex-shrink: 0;">Chức vụ:</span>
                            <span style="flex: 0 0 170px;">${ChucDanhKiemKe}</span>
                        </p>
                        <p><strong>Đã kiểm kê tại khoa phòng: ${KhoaPhongSuDung} vào lúc ${GioBatDau} giờ, từ ngày ${TuNgayKK} tháng ${TuThangKK} năm ${TuNamKK} đến ngày ${DenNgayKK} tháng ${DenThangKK} năm ${DenNamKK}</strong></p></strong></p>
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <!--<td><th>Mã Tài Sản</th>-->
                                    <th>Mã Tài Sản Mới</th>
                                    <th>Bệnh viện</th>
                                    <th>Phân loại</th>
                                    <th>Tên tài sản</th>
                                    <th>Manufacturer</th>
                                    <th>Model Name</th>
                                    <th>Serial Number</th>
                                    <th>TG đưa vào</th>
                                    <th>Nguyên giá</th>
                                    <th>Số lượng</th>
                                    <th>Khoa phòng thực tế</th>
                                    <!--<th>Vị trí</th>-->
                                    <!--<th>Ghi chú</th>-->
                                    <th>Khoa QL</th>
                                    <th>SL thực tế</th>
                                    <th>Chênh lệch</th>
                                    <th>Khoa phòng hiện tại</th>
                                    <th>Vị trí hiện tại</th>
                                    <th>Ghi chú hiện tại</th>
                                    <th>Tình trạng</th>
                                    <!--<td><th>Ngày kiểm kê</th>-->
                                </tr>
                                <tr>
                                    <th>1</th>
                                    <!--<td><th>Mã Tài Sản</th>-->
                                    <th>2</th>
                                    <th>3</th>
                                    <th>4</th>
                                    <th>5</th>
                                    <th>6</th>
                                    <th>7</th>
                                    <th>8</th>
                                    <th>9</th>
                                    <th>10</th>
                                    <th>11</th>
                                    <th>12</th>
                                    <!--<th>Vị trí</th>-->
                                    <!--<th>Ghi chú</th>-->
                                    <th>13</th>
                                    <th>14</th>
                                    <th>15</th>
                                    <th>16</th>
                                    <th>17</th>
                                    <th>18</th>
                                    <th>19</th>
                                    <!--<td><th>Ngày kiểm kê</th>-->
                                </tr>
                            </thead>
                            <tbody id="table-body"></tbody>
                        </table>
                        <div class="location-info">
                            <strong>Đà Nẵng, Ngày…………..Tháng……………..Năm ${NamKiemKe}</strong>
                        </div>
                        <div class="info-container">
                            <div class="info-tp"><strong>Điều dưỡng trưởng/Trưởng khoa phòng kiểm kê</strong></div>
                            <div class="info-nv"><strong>Nhân viên kế toán</strong></div>
                            <div class="info-nvp"><strong>Nhân viên phòng ban quản lý</strong></div>
                        </div>
                        <div class="info-container-ky">
                            <div><strong>${TenNhanVien}</strong></div>
                            <div><strong>${NguoiKiemKe}</strong></div>
                            <div><strong>${TenNhanVienPhongBan}</strong></div>
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
                                    <!--<td><td>\${item.MaTaiSan || ''}</td>-->
                                    <td>\${item.MaTaiSanNew || ''}</td>
                                    <td>\${item.BenhVien || ''}</td>
                                    <td>\${item.PhanLoai || ''}</td>
                                    <td>\${item.TenTaiSan || ''}</td>
                                    <td>\${item.Manufacturer || ''}</td>
                                    <td>\${item.Model || ''}</td>
                                    <td>\${item.Serial || ''}</td>
                                    <td style="text-align: center;">\${item.ThoiGianDuaVao ? new Date(item.ThoiGianDuaVao).toLocaleDateString('vi-VN') : ''}</td>
                                    <td style="text-align: center;">\${item.NguyenGia ? item.NguyenGia.toLocaleString() : ''}</td>
                                    <td style="text-align: center;">\${item.SoLuong || ''}</td>
                                    <td>\${item.KhoaPhongSuDung || ''}</td>
                                    <!--<td>\${item.ViTri || ''}</td>-->
                                    <!--<td>\${item.GhiChu || ''}</td>-->
                                    <td>\${item.KhoaQuanLy || ''}</td>
                                    <td style="text-align: center;">\${item.SoLuongThucTe || ''}</td>
                                    <td style="text-align: center;">\${item.ChenhLech === null || item.ChenhLech === undefined ? 0 : item.ChenhLech}</td>
                                    <td>\${item.KhoaPhongHienTai || ''}</td>
                                    <td>\${item.ViTriHienTai || ''}</td>
                                    <td>\${item.GhiChuHienTai || ''}</td>
                                    <td>\${item.TinhTrang || ''}</td>
                                    <!--<td><td>\${item.NgayKiemKe ? new Date(item.NgayKiemKe).toLocaleDateString('vi-VN') : ''}</td>-->
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
            getAllNhanVienPhong();
        } else {
            setSelectedOptionNhanVien(null);
            setSelectedOptionNhanVienPhong(null);
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
                                        zIndex: 150,
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
                            <label className=''>Nhân viên phòng ban quản lý:</label>
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

export default ModalInKiemKe;