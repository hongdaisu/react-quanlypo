import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import Select from 'react-select';
import { fetchAllPhongBan } from '../../services/phongbanServices';
import { fetchAllNhanVien, fetchAllGroup } from '../../services/userServices';
import { editUserService } from '../../services/userServices';
import { toast } from 'react-toastify';

const ModalEditUser = (props) => {
    const { show, handleClose, dataEditUser, getAllUsers, imageUrlData } = props;
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOptionGroup, setSelectedOptionGroup] = useState(null);
    const [optionsGroup, setOptionsGroup] = useState([]);
    const [editedData, setEditedData] = useState({ ...dataEditUser });
    const [modalOpened, setModalOpened] = useState(false);

    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageUrlUser, setImageUrlUser] = useState(imageUrlData);
    const [selectedFile, setSelectedFile] = useState(null);

    // console.log('imageUrlUser', imageUrlUser)
    // console.log('imageUrlData', imageUrlData)

    const getAllNhanVien = async () => {
        let response = await fetchAllNhanVien();
        const data = response.nhanvien.map(item => ({
            value: item.NhanVien_Id,
            label: item.TenNhanVien
        }));
        if (response && response.errCode === 0) {
            setOptions(data)
        }
    }

    // const handleFileChange = (e) => {
    //     const selectedFile = e.target.files[0];
    //     setFile(selectedFile);
    //     if (selectedFile) {
    //         const url = URL.createObjectURL(selectedFile);
    //         setImageUrl(url);
    //     }
    // };

    const resetFileInput = () => {
        // Đặt giá trị của input file thành null để trở về trạng thái mặc định
        document.getElementById('imageky').value = null;
        setFile(null);
    };

    const getAllGroup = async () => {
        let response = await fetchAllGroup();
        const data = response.group.map(item => ({
            value: item.id,
            label: item.MoTa
        }));
        if (response && response.errCode === 0) {
            setOptionsGroup(data)
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'radio') {
            // Xử lý đặc biệt cho radio button
            setEditedData((prevData) => ({
                ...prevData,
                [name]: parseInt(value, 10),
            }));
        } else if (type === 'file') {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                //console.log('url', url)
                setSelectedFile(file);
                setImageUrlUser(null);
                setImageUrl(url);
                setEditedData((prevData) => ({
                    ...prevData,
                    [name]: value.toString(),
                }));
            }
        } else {
            // Xử lý cho các trường input khác
            setEditedData((prevData) => ({
                ...prevData,
                [name]: value.toString(),
            }));
        }
    };


    // const handleInputChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     if (type === 'radio') {
    //         // Xử lý đặc biệt cho radio button
    //         setEditedData((prevData) => {
    //             const newData = {
    //                 ...prevData,
    //                 [name]: parseInt(value, 10),
    //             };
    //             // console.log(newData.LoaiCongVan); // In giá trị mới của editedData
    //             return newData;
    //         });
    //     } else {
    //         if (type === 'file') {
    //             const file = e.target.files[0];
    //             console.log('type', type);
    //             setSelectedFile(file);
    //             // console.log('setSelectedFile', setSelectedFile(file));
    //             if (selectedFile) {
    //                 const url = URL.createObjectURL(selectedFile);
    //                 console.log('url', url);
    //                 setImageUrl(url);
    //             }
    //             setEditedData((prevData) => ({
    //                 ...prevData,
    //                 [name]: value.toString(),
    //                 // FormData: formData,
    //             }));
    //         } else {
    //             // Xử lý cho các trường input khác
    //             setEditedData((prevData) => {
    //                 const newData = {
    //                     ...prevData,
    //                     [name]: value.toString(),
    //                 };
    //                 // console.log(newData); // In giá trị mới của editedData
    //                 return newData;
    //             });
    //         }
    //     }
    //     // } else {
    //     //     setEditedData((prevData) => {
    //     //         const newData = {
    //     //             ...prevData,
    //     //             [name]: value.toString(),
    //     //         };
    //     //         return newData;
    //     //     });
    //     // }
    // };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setEditedData({ ...editedData, NhanVien_Id: selectedOption.value });
    };

    const handleSelectChangeGroup = (selectedOptionGroup) => {
        setSelectedOptionGroup(selectedOptionGroup);
        setEditedData({ ...editedData, id: selectedOptionGroup.value });
    };

    const handleSaveUser = async () => {
        try {
            const formData = new FormData();
            formData.append('account', editedData.account);
            formData.append('NhanVien_Id', editedData.NhanVien_Id);
            formData.append('id', editedData.id);
            formData.append('tamngung', editedData.tamngung);
            formData.append('User_Id', editedData.User_Id);
            if (selectedFile) {
                formData.append('File', selectedFile);
            }

            // // Kiểm tra xem formData đã được tạo đúng chưa
            // for (const pair of formData.entries()) {
            //     console.log(pair[0] + ': ' + pair[1]);
            // }
            // let res = await editUserService(editedData);
            let res = await editUserService(formData);
            if (res && res.errCode === 0) {
                getAllUsers()
                handleClose()
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {

        }
    }
    // useEffect(() => {
    //     console.log('check dataEditUser', editedData)
    // }, [editedData])
    useEffect(() => {
        if (show) {
            resetFileInput();
            setModalOpened(true);
            setSelectedOption({
                value: dataEditUser.NhanVien_Id,
                label: dataEditUser.TenNhanVien,
            });

            setSelectedOptionGroup({
                value: dataEditUser.use_groupId,
                label: dataEditUser.MoTa,
            });
            getAllNhanVien();
            getAllGroup();
            setEditedData({ ...dataEditUser });
            setImageUrlUser(imageUrlData);
            setImageUrl(null);
        } else {
            // Nếu modal đóng, setModalOpened(false)
            setModalOpened(false);
            setSelectedOption(null);
            setSelectedOptionGroup(null);
            setSelectedFile(null);
            setImageUrl(null);
        }
    }, [show, dataEditUser, imageUrlData]); // Thêm imageUrlData vào dependency array

    //console.log('imageUrlUser', imageUrlUser);
    //console.log('imageUrlData', imageUrlData);
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Sửa user</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    {/* <div className='input-container'>
                        <label>User</label>
                        <input type="text"
                            name="account"
                            value={editedData.account} onChange={handleInputChange}
                        />
                    </div> */}
                    <div className='input-container max-w'>
                        <label>User:<i className='lable-i'>*</i></label>
                        <input type="text"
                            name="account"
                            value={editedData.account} onChange={handleInputChange}
                            className='form-control top-input'
                            autocomplete="off"
                        />
                    </div>
                    <div className='row input-row select-container-user'>
                        <div className='col-md-6 selectContainerStyle'>
                            <label className=''>Tên nhân viên:<i className='lable-i'>*</i></label>
                            <Select
                                value={selectedOption}
                                onChange={handleSelectChange}
                                options={options}
                                menuPlacement="top"
                                placeholder="Chọn tên nhân viên"
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
                        <div className='col-md-6'>
                            <label>Phòng ban:<i className='lable-i'>*</i></label>
                            <input type="text"
                                name="TenPhongBan"
                                value={editedData.TenPhongBan} //onChange={handleInputChange}
                                className='form-control top-input'
                                autocomplete="off"
                            />
                        </div>
                    </div>
                    {/* <div className='input-container max-w'>
                        <label>Phòng ban:<i className='lable-i'>*</i></label>
                        <input type="text"
                            name="TenPhongBan"
                            value={editedData.TenPhongBan} //onChange={handleInputChange}
                            className='form-control top-input'
                            autocomplete="off"
                        />
                    </div> */}
                    <div className='row input-row select-container-user'>
                        <div className='col-md-6 selectContainerStyle'>
                            <label className=''>Group:<i className='lable-i'>*</i></label>
                            <Select
                                value={selectedOptionGroup}
                                onChange={handleSelectChangeGroup}
                                options={optionsGroup}
                                menuPlacement="top"
                                placeholder="Chọn group"
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
                        <div className='col-md-6'>
                            <label>Trạng thái:<i className='lable-i'>*</i></label>
                            <div className='radio'>
                                Tạm ngưng: <input
                                    className="input-user"
                                    id="K_Edit"
                                    type="radio"
                                    name="tamngung"
                                    value={1}
                                    checked={editedData.tamngung === 1}
                                    onChange={handleInputChange}
                                />
                                Hoạt động: <input
                                    className="input-user"
                                    id="BT_Edit"
                                    type="radio"
                                    name="tamngung"
                                    value={0}
                                    checked={editedData.tamngung === 0}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row input-row select-container-user '>
                        <div className='col-md-8'>
                            <label>Chọn chữ ký</label>
                            <input type="file"
                                name="File"
                                id="imageky"
                                onChange={handleInputChange}
                                className='form-control file-input'
                            />
                        </div>
                        <div className='col-md-4'>
                            <label className='label-file'>Hình ảnh:</label>
                            {/* {imageUrlUser ? (
                                // Nếu có file, hiển thị hình ảnh
                                <img src={imageUrlUser} alt="Chữ ký" className='image-preview' />
                            ) : (
                                // Nếu không có file, hiển thị ghi chú màu đỏ
                                <span className='nofile'>Chưa có file đính kèm</span>
                            )} */}
                            {imageUrlUser ? (
                                // Nếu có imageUrl2 (tức là hình ảnh từ server), hiển thị hình ảnh từ server
                                <img src={imageUrlUser} alt="Chữ ký" className='image-preview' />
                            ) : imageUrl ? (
                                // Nếu có imageUrl (tức là hình ảnh khi mở modal), hiển thị hình ảnh khi mở modal
                                <img src={imageUrl} alt="Chữ ký" className='image-preview' />
                            ) : (
                                // Nếu không có cả hai, hiển thị ghi chú màu đỏ
                                <span className='nofile'>Chưa có chữ ký</span>
                            )}
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => handleSaveUser()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleClose} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalEditUser;