import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { editPhongBanService } from '../../services/phongbanServices'
import Select from 'react-select';
import { toast } from 'react-toastify';
import { fetchAllDVT, fetchAllBV, fetchAllPL, fetchAllTGBH, fetchAllTGKH, newTaiSanService } from '../../services/importService';
import Cookies from 'js-cookie';

const ModalNewTS = (props) => {
    const { show, handleClose, getAllTaiSan, socket } = props;

    const [selectedOptionDVT, setSelectedOptionDVT] = useState(null);
    const [optionsDVT, setOptionsDVT] = useState([]);
    const [DonViTinh_Id, setDonViTinh_Id] = useState('');

    const [selectedOptionBV, setSelectedOptionBV] = useState(null);
    const [optionsBV, setOptionsBV] = useState([]);
    const [BenhVien_Id, setBenhVien_Id] = useState('');

    const [selectedOptionPL, setSelectedOptionPL] = useState(null);
    const [optionsPL, setOptionsPL] = useState([]);
    const [PhanLoai_Id, setPhanLoai_Id] = useState('');

    const [selectedOptionTGBH, setSelectedOptionTGBH] = useState(null);
    const [optionsTGBH, setOptionsTGBH] = useState([]);
    const [ThoiGianBaoHanh_Id, setThoiGianBaoHanh_Id] = useState('');

    const [selectedOptionTGKH, setSelectedOptionTGKH] = useState(null);
    const [optionsTGKH, setOptionsTGKH] = useState([]);
    const [ThoiGianKhauHao_Id, setThoiGianKhauHao_Id] = useState('');

    const [MaTaiSan, setMaTaiSan] = useState('');
    const [MaTaiSanNew, setMaTaiSanNew] = useState('');
    const [TenHang, setTenHang] = useState('');
    const [Model, setModel] = useState('');
    const [Serial, setSerial] = useState('');
    const [HangSanXuat, setHangSanXuat] = useState('');
    const [Book, setBook] = useState('');
    const [Account, setAccount] = useState('');
    const [SubAccount, setSubAccount] = useState('');
    const [BudgetOwner, setBudgetOwner] = useState('');
    const [Budget, setBudget] = useState('');
    const [NamSuDung, setNamSuDung] = useState('');
    const [Invoice, setInvoice] = useState('');
    const [Categories, setCategories] = useState('');
    const [Loai, setLoai] = useState('');
    const [ThoiGianMua, setThoiGianMua] = useState('');
    const [ThoiGianTinhKhauHao, setThoiGianTinhKhauHao] = useState('');
    const [GhiChu, setGhiChu] = useState('');
    const [STT, setSTT] = useState('');
    const UserId = Cookies.get('id');

    const newTaiSan = {
        MaTaiSan, MaTaiSanNew, TenHang, Model, Serial, HangSanXuat, Book, Account, SubAccount, BudgetOwner, Budget, NamSuDung, Invoice, Categories
        , Loai, GhiChu, DonViTinh_Id, BenhVien_Id, PhanLoai_Id, ThoiGianBaoHanh_Id, ThoiGianKhauHao_Id, UserId, ThoiGianMua, ThoiGianTinhKhauHao, STT
    };

    const handleCloseModal = () => {
        setMaTaiSan('');
        setMaTaiSanNew('');
        setTenHang('');
        setModel('');
        setSerial('');
        setHangSanXuat('');
        setBook('');
        setAccount('');
        setSubAccount('');
        setBudgetOwner('');
        setBudget('');
        setNamSuDung('');
        setInvoice('');
        setCategories('');
        setLoai('');
        setGhiChu('');
        setDonViTinh_Id('');
        setBenhVien_Id('');
        setPhanLoai_Id('');
        setThoiGianBaoHanh_Id('');
        setThoiGianKhauHao_Id('');
        setThoiGianMua('');
        setThoiGianTinhKhauHao('');
        setSTT('');
        handleClose();
    }

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
        setDonViTinh_Id({ ...DonViTinh_Id, DonViTinh_Id: selectedOptionDVT.value });
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
        setBenhVien_Id({ ...BenhVien_Id, BenhVien_Id: selectedOptionBV.value });
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
        setPhanLoai_Id({ ...PhanLoai_Id, PhanLoai_Id: selectedOptionPL.value });
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
        setThoiGianBaoHanh_Id({ ...ThoiGianBaoHanh_Id, ThoiGianBaoHanh_Id: selectedOptionTGBH.value });
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
        setThoiGianKhauHao_Id({ ...ThoiGianKhauHao_Id, ThoiGianKhauHao_Id: selectedOptionTGKH.value });
    };


    const handleSaveTS = async () => {
        try {
            const requiredFields = [
                { field: 'TenHang', message: "Tên tài sản không được để trống" },
                { field: 'DonViTinh_Id', message: "Vui lòng chọn 'Đơn vị tính'" },
                //{ field: 'Model', message: "Vui lòng nhập thông tin cho 'Model'" },
                //{ field: 'Serial', message: "Vui lòng nhập thông tin cho 'Serial'" }
                // Thêm các trường khác nếu cần
            ];

            for (let i = 0; i < requiredFields.length; i++) {
                const { field, message } = requiredFields[i];
                if (!newTaiSan[field]) {
                    toast.warning(message);
                    return;
                }
            }
            let res = await newTaiSanService(newTaiSan);
            if (res && res.errCode === 0) {
                socket.emit('new_taisan_server', { data: res });
                //getAllTaiSan()
                handleCloseModal();
                handleClose();
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
            socket.on('new_taisan_client', (data) => {
                getAllTaiSan(); // Cập nhật danh sách phòng ban
            });
        }
        return () => {
            if (socket) {
                socket.off('new_taisan_client');
            }
        };
    }, [socket, getAllTaiSan]);

    useEffect(() => {
        if (show) {
            getAllBV();
            getAllDVT();
            getAllPL();
            getAllTGBH();
            getAllTGKH();
        } else {
            setSelectedOptionBV(null);
            setSelectedOptionDVT(null);
            setSelectedOptionPL(null);
            setSelectedOptionTGBH(null);
            setSelectedOptionTGKH(null);
        }
    }, [show])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='xl'
        >
            <ModalHeader>Tạo tài sản</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='row input-row-ts select-container-user'>
                        <div className='col-md-1 custom-font-label'>
                            <label>STT</label>
                            <input type="number"
                                value={STT}
                                onChange={(e) => setSTT(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Mã tài sản</label>
                            <input type="text"
                                value={MaTaiSan}
                                onChange={(e) => setMaTaiSan(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Mã tài sản New</label>
                            <input type="text"
                                value={MaTaiSanNew}
                                onChange={(e) => setMaTaiSanNew(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-5 custom-font-label'>
                            <label>Tên tài sản</label>
                            <input type="text"
                                value={TenHang}
                                onChange={(e) => setTenHang(e.target.value)}
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
                    <div className='row input-row-ts select-container-user'>
                        <div className='col-md-2 custom-font-label'>
                            <label>Model</label>
                            <input type="text"
                                value={Model}
                                onChange={(e) => setModel(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Serial</label>
                            <input type="text"
                                value={Serial}
                                onChange={(e) => setSerial(e.target.value)}
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
                                value={HangSanXuat}
                                onChange={(e) => setHangSanXuat(e.target.value)}
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
                                value={ThoiGianMua}
                                onChange={(e) => setThoiGianMua(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-3 custom-font-label'>
                            <label className=''>TG tính khấu hao:</label>
                            <input type="date"
                                value={ThoiGianTinhKhauHao}
                                onChange={(e) => setThoiGianTinhKhauHao(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
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
                    </div>
                    <div className='row input-row-ts select-container-user'>
                        <div className='col-md-2 custom-font-label'>
                            <label>Book</label>
                            <input type="text"
                                value={Book}
                                onChange={(e) => setBook(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Account</label>
                            <input type="number"
                                value={Account}
                                onChange={(e) => setAccount(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>SubAccount</label>
                            <input type="text"
                                value={SubAccount}
                                onChange={(e) => setSubAccount(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Budget-Owner</label>
                            <input type="text"
                                value={BudgetOwner}
                                onChange={(e) => setBudgetOwner(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Budget</label>
                            <input type="text"
                                value={Budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-2 custom-font-label'>
                            <label>Năm sử dụng</label>
                            <input type="number"
                                value={NamSuDung}
                                onChange={(e) => setNamSuDung(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                    </div>
                    <div className='row input-row-ts select-container-user'>
                        {/* <div className='col-md-6 custom-font-label'>
                            <label>Invoice</label>
                            <input type="text"
                                value={Invoice}
                                onChange={(e) => setInvoice(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div> */}
                        <div className='col-md-12 custom-font-label'>
                            <label>Categories</label>
                            <input type="text"
                                value={Categories}
                                onChange={(e) => setCategories(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                    </div>
                    {/* <div className='row input-row-ts select-container-user'>
                        <div className='col-md-6 custom-font-label'>
                            <label>Loại</label>
                            <input type="text"
                                value={Loai}
                                onChange={(e) => setLoai(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                        <div className='col-md-6 custom-font-label'>
                            <label>Ghi chú</label>
                            <input type="text"
                                value={GhiChu}
                                onChange={(e) => setGhiChu(e.target.value)}
                                className='form-control custom-font-input'
                                autocomplete="off"
                            />
                        </div>
                    </div> */}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => handleSaveTS()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalNewTS;