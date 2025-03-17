import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { editNhanVienService, fetchAllPhongBan } from '../../services/nhanvienServices'
import Select from 'react-select';
import { toast } from 'react-toastify';

const ModalEditNhanVien = (props) => {
    const { show, handleClose, dataEditNhanVien, getAllNhanVien, socket } = props;
    const [editedData, setEditedData] = useState({ ...dataEditNhanVien });
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [modalOpened, setModalOpened] = useState(false);

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditedData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // };

    //console.log('editedData', editedData)

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'radio') {
            // Xử lý đặc biệt cho radio button
            setEditedData((prevData) => {
                const newData = {
                    ...prevData,
                    [name]: parseInt(value, 10),
                };
                // console.log(newData.LoaiCongVan); // In giá trị mới của editedData
                return newData;
            });
        } else {
            setEditedData((prevData) => {
                const newData = {
                    ...prevData,
                    [name]: value.toString(),
                };
                return newData;
            });
        }
    };

    const getAllPhongBan = async () => {
        let response = await fetchAllPhongBan();
        const data = response.phongban.map(item => ({
            value: item.PhongBan_Id,
            label: item.TenPhongBan
        }));
        if (response && response.errCode === 0) {
            setOptions(data)
        }
    }

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setEditedData({ ...editedData, PhongBan_Id: selectedOption.value });
    };

    const handleSaveNhanVien = async () => {
        // console.log('editedData', editedData)
        try {
            let res = await editNhanVienService(editedData);
            if (res && res.errCode === 0) {
                socket.emit('new_nhanvien', { data: res });
                // getAllNhanVien()
                handleClose()
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {

        }

    }



    useEffect(() => {
        // console.log('check dataEditUser', editedData)
    }, [editedData])

    useEffect(() => {
        if (show) {
            setModalOpened(true);
            setSelectedOption({
                value: dataEditNhanVien.PhongBan_Id,
                label: dataEditNhanVien.TenPhongBan,
            });
            getAllNhanVien();
            getAllPhongBan();
            setEditedData({ ...dataEditNhanVien });
        } else {
            // Nếu modal đóng, setModalOpened(false)
            setModalOpened(false);
            setSelectedOption(null);
        }
    }, [show, dataEditNhanVien]);


    useEffect(() => {
        // console.log('socket modal', socket)
        if (socket) {
            socket.on('nhanvien_edited', (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllNhanVien(); // Cập nhật danh sách phòng ban
            });
        }
        return () => {
            if (socket) {
                socket.off('nhanvien_edited');
            }
        };
    }, [socket, getAllNhanVien]);

    useEffect(() => {
        if (show) {
            setEditedData({ ...dataEditNhanVien });
            // getAllNhanVien();
        }
    }, [dataEditNhanVien])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Sửa nhân viên</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>Tên nhân viên</label>
                        <input type="text"
                            name="TenNhanVien"
                            value={editedData.TenNhanVien} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Email</label>
                        <input type="text"
                            name="Email"
                            value={editedData.Email} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                    <div className='row input-row select-container-user'>
                        <div className='col-md-12 selectContainerStyle'>
                            <label className=''>Phòng ban:<i className='lable-i'>*</i></label>
                            <Select
                                value={selectedOption}
                                onChange={handleSelectChange}
                                options={options}
                                menuPlacement="top"
                                placeholder="Chọn tên phòng ban"
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
                    <div className='row input-row select-container-user'>
                        <div className='col-md-6'>
                            <label>Trạng thái:<i className='lable-i'>*</i></label>
                            <div className='radio'>
                                Tạm ngưng: <input
                                    className="input-user"
                                    id="K_Edit"
                                    type="radio"
                                    name="TrangThai_Int"
                                    value={1}
                                    checked={editedData.TrangThai_Int === 1}
                                    onChange={handleInputChange}
                                />
                                Hoạt động: <input
                                    className="input-user"
                                    id="BT_Edit"
                                    type="radio"
                                    name="TrangThai_Int"
                                    value={0}
                                    checked={editedData.TrangThai_Int === 0}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        {/* <div className='col-md-6'>
                            <label>Nhận công văn:<i className='lable-i'>*</i></label>
                            <div className='radio'>
                                Có quyền: <input
                                    className="input-user"
                                    id="K_Edit"
                                    type="radio"
                                    name="CheckGui_Int"
                                    value={1}
                                    checked={editedData.CheckGui_Int === 1}
                                    onChange={handleInputChange}
                                />
                                Không có quyền: <input
                                    className="input-user"
                                    id="BT_Edit"
                                    type="radio"
                                    name="CheckGui_Int"
                                    value={0}
                                    checked={editedData.CheckGui_Int === 0}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div> */}
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => handleSaveNhanVien()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleClose} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalEditNhanVien;