import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { editPhongBanService } from '../../services/phongbanServices'

import { toast } from 'react-toastify';

const ModalEditPhongBan = (props) => {
    const { show, handleClose, dataEditPhongBan, getAllPhongBan, socket } = props;
    const [editedData, setEditedData] = useState({ ...dataEditPhongBan });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSavePhongBan = async () => {
        // console.log('editedData', editedData)
        try {
            let res = await editPhongBanService(editedData);
            if (res && res.errCode === 0) {
                socket.emit('edit_phong_ban', { data: editedData });
                // getAllPhongBan()
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
            socket.on('phong_ban_edited', (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllPhongBan(); // Cập nhật danh sách phòng ban
            });
        }
        return () => {
            if (socket) {
                socket.off('phong_ban_edited');
            }
        };
    }, [socket, getAllPhongBan]);

    useEffect(() => {
        if (show) {
            setEditedData({ ...dataEditPhongBan });
            // getAllPhongBan();
        }
    }, [dataEditPhongBan])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Sửa phòng ban</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>Tên phòng ban</label>
                        <input type="text"
                            name="TenPhongBan"
                            value={editedData.TenPhongBan} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Trường khoa</label>
                        <input type="text"
                            name="TruongKhoa"
                            value={editedData.TruongKhoa} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Điều dưỡng trưởng</label>
                        <input type="text"
                            name="DieuDuongTruong"
                            value={editedData.DieuDuongTruong} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => handleSavePhongBan()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleClose} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalEditPhongBan;