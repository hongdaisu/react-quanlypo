import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { newRoleService } from '../../services/grouproleService'
import { toast } from 'react-toastify';
import Select from 'react-select';
import { fetchAllPhongBanHis, newPhongBanService } from '../../services/phongbanServices';


const ModalNewPhongBan = (props) => {
    const { show, handleClose, getAllPhongBan, socket } = props;
    const [truongkhoa, setTruongKhoa] = useState('');
    const [dieuduongtruong, setDieuDuongTruong] = useState('');
    const [selectedOptionPhongBan, setSelectedOptionPhongBan] = useState([]);
    const [optionsPhongBan, setOptionsPhongBan] = useState([]);
    const [phongban, setPhongBan] = useState('');
    const [tenphongban, setTenPhongBan] = useState('');
    const [updatingData, setUpdatingData] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);

    const newPhongBan = { truongkhoa, dieuduongtruong, phongban, tenphongban };
    const handleSavePhongBan = async () => {
        try {
            let res = await newPhongBanService(newPhongBan);
            if (res && res.errCode === 0) {
                socket.emit('new_phong_ban', { data: newPhongBan });
                setTruongKhoa('');
                setDieuDuongTruong('');
                setPhongBan('');
                setTenPhongBan('');
                // getAllPhongBan();
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
        setTenPhongBan(selectedOptionPhongBan.label);
        setUpdatingData(true);
    };

    const handleCloseModal = () => {
        setTruongKhoa('');
        setDieuDuongTruong('');
        setPhongBan('');
        setTenPhongBan('');
        handleClose();
    }

    const handleSelectPhongBan = async () => {
        let response = await fetchAllPhongBanHis();
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
            // getAllPhongBan();
            setModalOpened(true);
        } else {
            setModalOpened(false);
            setSelectedOptionPhongBan(null);
        }
    }, [show]);

    useEffect(() => {
        // console.log('socket modal', socket)
        if (socket) {
            socket.on('phong_ban_new', (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllPhongBan(); // Cập nhật danh sách phòng ban
            });
        }
        return () => {
            if (socket) {
                socket.off('phong_ban_new');
            }
        };
    }, [socket, getAllPhongBan]);
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Thêm Phòng Ban</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
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
                    <div className='input-container max-w'>
                        <label>Tên phòng ban:<i className='lable-i'>*</i></label>
                        <input type="text"
                            value={tenphongban}
                            onChange={(e) => setTenPhongBan(e.target.value)}
                            className='form-control top-input'
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Trưởng khoa phòng:<i className='lable-i'></i></label>
                        <input type="text"
                            value={truongkhoa}
                            onChange={(e) => setTruongKhoa(e.target.value)}
                            className='form-control top-input'
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Điều dưỡng trưởng:<i className='lable-i'></i></label>
                        <input type="text"
                            value={dieuduongtruong}
                            onChange={(e) => setDieuDuongTruong(e.target.value)}
                            className='form-control top-input'
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleSavePhongBan()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalNewPhongBan;