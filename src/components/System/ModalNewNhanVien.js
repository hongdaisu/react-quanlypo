import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { newNhanVienService, fetchAllPhongBan } from '../../services/nhanvienServices';

const ModalNewNhanVien = (props) => {
    const { show, handleClose, getAllNhanVien, socket } = props;
    const [tennhanvien, setTenNhanVien] = useState('');
    const [email, setEmail] = useState('');
    const [selectedOptionPhongBan, setSelectedOptionPhongBan] = useState([]);
    const [optionsPhongBan, setOptionsPhongBan] = useState([]);
    const [phongban, setPhongBan] = useState('');
    const [updatingData, setUpdatingData] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);

    const newNhanVien = { tennhanvien, email, phongban };
    const handleSaveNhanVien = async () => {
        try {
            let res = await newNhanVienService(newNhanVien);
            if (res && res.errCode === 0) {
                socket.emit('new_nhanvien', { data: res });
                setTenNhanVien('');
                setEmail('');
                setPhongBan('');
                // getAllNhanVien();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {

        }

    }

    const handleSelectChangePhongBan = (selectedOptionPhongBan) => {
        // console.log(selectedOption)
        setSelectedOptionPhongBan(selectedOptionPhongBan);
        setPhongBan({ ...phongban, PhongBan_Id: selectedOptionPhongBan.value });
        setUpdatingData(true);
    };

    const handleCloseModal = () => {
        setTenNhanVien('');
        setEmail('');
        setPhongBan('');
        handleClose();
    }

    const handleSelectPhongBan = async () => {
        let response = await fetchAllPhongBan();
        const data = response.phongban.map(item => ({
            value: item.PhongBan_Id,
            label: item.TenPhongBan
        }));
        if (response && response.errCode === 0) {
            setOptionsPhongBan(data)
        }
    }


    // useEffect(() => {
    //     console.log('New user changed:', newPhongBan);
    // }, [newPhongBan]);

    useEffect(() => {
        if (show) {
            // handleSelectPhongBan();
            handleSelectPhongBan();
            // getAllNhanVien();
            setModalOpened(true);
        } else {
            setModalOpened(false);
            setSelectedOptionPhongBan(null);
        }
    }, [show]);

    useEffect(() => {
        // console.log('socket modal', socket)
        if (socket) {
            socket.on('nhanvien_new', (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllNhanVien(); // Cập nhật danh sách phòng ban
            });
        }
        return () => {
            if (socket) {
                socket.off('nhanvien_new');
            }
        };
    }, [socket, getAllNhanVien]);
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Thêm Phòng Ban</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>Tên nhân viên:<i className='lable-i'>*</i></label>
                        <input type="text"
                            value={tennhanvien}
                            onChange={(e) => setTenNhanVien(e.target.value)}
                            className='form-control top-input'
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Email:<i className='lable-i'>*</i></label>
                        <input type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='form-control top-input'
                        />
                    </div>
                    <div className='row input-row select-container-user'>
                        <div className='col-md-12 selectContainerStyle'>
                            <label className=''>Phòng ban:<i className='lable-i'>*</i></label>
                            <Select
                                value={selectedOptionPhongBan}
                                onChange={handleSelectChangePhongBan}
                                options={optionsPhongBan}
                                menuPlacement="top"
                                placeholder="Chọn phòng ban"
                                // isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 1,
                                        marginTop: '4px'
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleSaveNhanVien()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalNewNhanVien;