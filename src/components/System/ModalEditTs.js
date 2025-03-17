import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { editPhongBanService } from '../../services/phongbanServices'
import Select from 'react-select';
import { toast } from 'react-toastify';
import { fetchAllDVT, fetchAllBV, fetchAllPL, fetchAllTGBH, fetchAllTGKH, editTaiSanService } from '../../services/importService';
import Cookies from 'js-cookie';

const ModalEditTs = (props) => {
    const { show, handleClose, dataEditTS, getAllTaiSan, socket } = props;
    const [editedData, setEditedData] = useState({ ...dataEditTS });

    const [selectedOptionDVT, setSelectedOptionDVT] = useState(null);
    const [optionsDVT, setOptionsDVT] = useState([]);

    const [selectedOptionBV, setSelectedOptionBV] = useState(null);
    const [optionsBV, setOptionsBV] = useState([]);

    const [selectedOptionPL, setSelectedOptionPL] = useState(null);
    const [optionsPL, setOptionsPL] = useState([]);

    const [selectedOptionTGBH, setSelectedOptionTGBH] = useState(null);
    const [optionsTGBH, setOptionsTGBH] = useState([]);

    const [selectedOptionTGKH, setSelectedOptionTGKH] = useState(null);
    const [optionsTGKH, setOptionsTGKH] = useState([]);
    const UserId = Cookies.get('id');

    //console.log('dataEditTS', dataEditTS)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const getAllDVT = async () => {
        let response = await fetchAllDVT();
        const data = response.data.map(item => ({
            value: item.DonViTinh_Id,
            label: item.TenDonViTinh
        }));
        if (response && response.errCode === 0) {
            setOptionsDVT(data)
        }
    }

    const handleSelectChangeDVT = (selectedOptionDVT) => {
        setSelectedOptionDVT(selectedOptionDVT);
        setEditedData({ ...editedData, DonViTinh_Id: selectedOptionDVT.value });
    };

    const getAllBV = async () => {
        let response = await fetchAllBV();
        const data = response.data.map(item => ({
            value: item.BenhVien_Id,
            label: item.TenBenhVien
        }));
        if (response && response.errCode === 0) {
            setOptionsBV(data)
        }
    }

    const handleSelectChangeBV = (selectedOptionBV) => {
        setSelectedOptionBV(selectedOptionBV);
        setEditedData({ ...editedData, BenhVien_Id: selectedOptionBV.value });
    };

    const getAllPL = async () => {
        let response = await fetchAllPL();
        const data = response.data.map(item => ({
            value: item.PhanLoai_Id,
            label: item.PhanLoai
        }));
        if (response && response.errCode === 0) {
            setOptionsPL(data)
        }
    }

    const handleSelectChangePL = (selectedOptionPL) => {
        setSelectedOptionPL(selectedOptionPL);
        setEditedData({ ...editedData, PhanLoai_Id: selectedOptionPL.value });
    };

    const getAllTGBH = async () => {
        let response = await fetchAllTGBH();
        const data = response.data.map(item => ({
            value: item.ThoiGianBaoHanh_Id,
            label: item.ThoiGianBaoHanh
        }));
        if (response && response.errCode === 0) {
            setOptionsTGBH(data)
        }
    }

    const handleSelectChangeTGBH = (selectedOptionTGBH) => {
        setSelectedOptionTGBH(selectedOptionTGBH);
        setEditedData({ ...editedData, ThoiGianBaoHanh_Id: selectedOptionTGBH.value });
    };

    const getAllTGKH = async () => {
        let response = await fetchAllTGKH();
        const data = response.data.map(item => ({
            value: item.ThoiGianKhauHao_Id,
            label: item.ThoiGianKhauHao
        }));
        if (response && response.errCode === 0) {
            setOptionsTGKH(data)
        }
    }

    const handleSelectChangeTGKH = (selectedOptionTGKH) => {
        setSelectedOptionTGKH(selectedOptionTGKH);
        setEditedData({ ...editedData, ThoiGianKhauHao_Id: selectedOptionTGKH.value });
    };


    const handleSaveEditTS = async () => {
        try {
            let updatedData = {
                ...editedData,
                UserId: UserId
            };
            let res = await editTaiSanService(updatedData);
            if (res && res.errCode === 0) {
                socket.emit('edit_taisan_server', { data: editedData });
                //getAllTaiSan()
                handleClose()
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {

        }
    }



    useEffect(() => {
        // console.log('socket modal', socket)
        if (socket) {
            socket.on('edit_taisan_client', (data) => {
                getAllTaiSan(); // Cập nhật danh sách phòng ban
            });
        }
        return () => {
            if (socket) {
                socket.off('edit_taisan_client');
            }
        };
    }, [socket, getAllTaiSan]);

    useEffect(() => {
        if (show) {
            setSelectedOptionDVT({
                value: dataEditTS.DonViTinh_Id_Id,
                label: dataEditTS.TenDonViTinh,
            });

            setSelectedOptionBV({
                value: dataEditTS.BenhVien_Id,
                label: dataEditTS.TenBenhVien,
            });
            setSelectedOptionPL({
                value: dataEditTS.PhanLoai_Id,
                label: dataEditTS.PhanLoai,
            });

            setSelectedOptionTGBH({
                value: dataEditTS.ThoiGianBaoHanh_Id,
                label: dataEditTS.ThoiGianBaoHanh,
            });

            setSelectedOptionTGKH({
                value: dataEditTS.ThoiGianKhauHao_Id,
                label: dataEditTS.ThoiGianKhauHao,
            });

            getAllBV();
            getAllDVT();
            getAllPL();
            getAllTGBH();
            getAllTGKH();
            setEditedData({ ...dataEditTS });
        } else {
            setSelectedOptionBV(null);
            setSelectedOptionDVT(null);
            setSelectedOptionPL(null);
            setSelectedOptionTGBH(null);
            setSelectedOptionTGKH(null);
        }
    }, [show, dataEditTS])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='xl'
        >
            <ModalHeader>Sửa tài sản</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='row input-row-ts select-container-user'>
                        <div className='col-md-1 custom-font-label'>
                            <label>STT</label>
                            <input type="number"
                                name="STT"
                                value={editedData.STT} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Mã tài sản</label>
                            <input type="text"
                                name="MaTaiSan"
                                value={editedData.MaTaiSan} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Mã tài sản New</label>
                            <input type="text"
                                name="MaTaiSanNew"
                                value={editedData.MaTaiSanNew} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-5 custom-font-label'>
                            <label>Tên tài sản</label>
                            <input type="text"
                                name="TenHang"
                                value={editedData.TenHang} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label className=''>Đơn vị tính:</label>
                            <Select
                                value={selectedOptionDVT}
                                onChange={handleSelectChangeDVT}
                                options={optionsDVT}
                                menuPlacement="top"
                                placeholder=""
                                // isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 110,
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
                    <div className='row input-row-ts select-container-user'>
                        <div className='col-md-2 custom-font-label'>
                            <label>Model</label>
                            <input type="text"
                                name="Model"
                                value={editedData.Model} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Serial</label>
                            <input type="text"
                                name="Serial"
                                value={editedData.Serial} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-3 custom-font-label'>
                            <label className=''>Phân loại:</label>
                            <Select
                                value={selectedOptionPL}
                                onChange={handleSelectChangePL}
                                options={optionsPL}
                                menuPlacement="bottom"
                                placeholder=""
                                // isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 110,
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
                        <div className='col-md-3 custom-font-label'>
                            <label>Hãng Sx</label>
                            <input type="text"
                                name="HangSanXuat"
                                value={editedData.HangSanXuat} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label className=''>Bệnh viện:</label>
                            <Select
                                value={selectedOptionBV}
                                onChange={handleSelectChangeBV}
                                options={optionsBV}
                                menuPlacement="bottom"
                                placeholder=""
                                // isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 110,
                                        marginTop: '-1px'
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                        minHeight: '33px',
                                        height: '33px',
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
                    <div className='row input-row-ts select-container-user'>
                        <div className='col-md-3 custom-font-label'>
                            <label className=''>Thời gian mua:</label>
                            <input type="date"
                                name="ThoiGianMua"
                                value={editedData.ThoiGianMua ? editedData.ThoiGianMua.split('T')[0] : ''}
                                onChange={handleInputChange}
                                className='form-control top-input'
                            />
                        </div>
                        <div className='col-md-3 custom-font-label'>
                            <label className=''>TG tính khấu hao:</label>
                            <input type="date"
                                name="ThoiGianTinhKhauHao"
                                value={editedData.ThoiGianTinhKhauHao ? editedData.ThoiGianTinhKhauHao.split('T')[0] : ''}
                                onChange={handleInputChange}
                                className='form-control top-input'
                            />
                        </div>
                        <div className='col-md-3 custom-font-label'>
                            <label className=''>TG khấu hao:</label>
                            <Select
                                value={selectedOptionTGKH}
                                onChange={handleSelectChangeTGKH}
                                options={optionsTGKH}
                                menuPlacement="bottom"
                                placeholder=""
                                // isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 99,
                                        marginTop: '-1px'
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                        minHeight: '33px',
                                        height: '33px',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        fontFamily: 'Arial, sans-serif',
                                        fontSize: '12px',
                                    }),
                                }}
                            />
                        </div>
                        <div className='col-md-3 custom-font-label'>
                            <label className=''>TG bảo hành:</label>
                            <Select
                                value={selectedOptionTGBH}
                                onChange={handleSelectChangeTGBH}
                                options={optionsTGBH}
                                menuPlacement="bottom"
                                placeholder=""
                                // isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 99,
                                        marginTop: '-1px'
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                        minHeight: '33px',
                                        height: '33px',
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
                    <div className='row input-row-ts select-container-user'>
                        <div className='col-md-2 custom-font-label'>
                            <label>Book</label>
                            <input type="text"
                                name="Book"
                                value={editedData.Book} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Account</label>
                            <input type="number"
                                name="Account"
                                value={editedData.Account} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>SubAccount</label>
                            <input type="text"
                                name="SubAccount"
                                value={editedData.SubAccount} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Budget-Owner</label>
                            <input type="text"
                                name="BudgetOwner"
                                value={editedData.BudgetOwner} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Budget</label>
                            <input type="text"
                                name="Budget"
                                value={editedData.Budget} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Năm sử dụng</label>
                            <input type="number"
                                name="NamSuDung"
                                value={editedData.NamSuDung} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                    </div>
                    <div className='row input-row-ts select-container-user'>
                        {/* <div className='col-md-6 custom-font-label'>
                            <label>Invoice</label>
                            <input type="text"
                                name="Invoice"
                                value={editedData.Invoice} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div> */}
                        <div className='col-md-12 custom-font-label'>
                            <label>Categories</label>
                            <input type="text"
                                name="Categories"
                                value={editedData.Categories} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                    </div>
                    {/* <div className='row input-row-ts select-container-user'>
                        <div className='col-md-6 custom-font-label'>
                            <label>Loại</label>
                            <input type="text"
                                name="Loai"
                                value={editedData.Loai} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-6 custom-font-label'>
                            <label>Ghi chú</label>
                            <input type="text"
                                name="GhiChu"
                                value={editedData.GhiChu} onChange={handleInputChange}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                    </div> */}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => handleSaveEditTS()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleClose} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalEditTs;