import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { newRoleService } from '../../services/grouproleService'
import { toast } from 'react-toastify';
import Select from 'react-select';
import { fetchAllPhongBan } from '../../services/phongbanServices';
import { fetchAllGroup, newUserService, fetchAllNhanVien } from '../../services/userServices';

const ModalNewUser = (props) => {
    const { show, handleClose, getAllUsers } = props;
    const [account, setAccount] = useState('');
    const [nhanvien_id, setNhanVien_Id] = useState('');
    // const [selectedOptionPhongBan, setSelectedOptionPhongBan] = useState([]);
    const [selectedOptionGroup, setSelectedOptionGroup] = useState([]);
    const [selectedOptionTenNhanVien, setSelectedOptionTenNhanVien] = useState([]);
    // const [optionsPhongBan, setOptionsPhongBan] = useState([]);
    const [optionsGroup, setOptionsGroup] = useState([]);
    const [optionsTenNhanVien, setOptionsTenNhanVien] = useState([]);
    // const [phongban, setPhongBan] = useState('');
    const [group, setGroup] = useState('');
    const [updatingData, setUpdatingData] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);

    const newUser = { account, nhanvien_id, group };
    const handleSaveUser = async () => {
        try {
            let res = await newUserService(newUser);
            if (res && res.errCode === 0) {
                setGroup('');
                // setPhongBan('');
                setNhanVien_Id('');
                setAccount('');
                getAllUsers();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {

        }

    }

    // const handleSelectChangePhongBan = (selectedOptionPhongBan) => {
    //     // console.log(selectedOption)
    //     setSelectedOptionPhongBan(selectedOptionPhongBan);
    //     setPhongBan({ ...phongban, id: selectedOptionPhongBan.value });
    //     setUpdatingData(true);
    // };

    const handleSelectChangeGroup = (selectedOptionGroup) => {
        // console.log(selectedOption)
        setSelectedOptionGroup(selectedOptionGroup);
        setGroup({ ...group, id: selectedOptionGroup.value });
        setUpdatingData(true);
    };

    const handleSelectChangeTenNhanVien = (selectedOptionTenNhanVien) => {
        // console.log(selectedOption)
        setSelectedOptionTenNhanVien(selectedOptionTenNhanVien);
        setNhanVien_Id({ ...nhanvien_id, NhanVien_Id: selectedOptionTenNhanVien.value });
        setUpdatingData(true);
    };
    const handleCloseModal = () => {
        setGroup('');
        // setPhongBan('');
        setNhanVien_Id('');
        setAccount('');
        handleClose();
    }

    // const handleSelectPhongBan = async () => {
    //     let response = await fetchAllPhongBan();
    //     const data = response.phongban.map(item => ({
    //         value: item.id,
    //         label: item.TenPhongBan
    //     }));
    //     if (response && response.errCode === 0) {
    //         setOptionsPhongBan(data)
    //     }
    // }

    const handleSelectGroup = async () => {
        let response = await fetchAllGroup();
        const data = response.group.map(item => ({
            value: item.id,
            label: item.MoTa
        }));
        if (response && response.errCode === 0) {
            setOptionsGroup(data)
        }
    }

    const handleSelectNhanVien = async () => {
        let response = await fetchAllNhanVien();
        const data = response.nhanvien.map(item => ({
            value: item.NhanVien_Id,
            label: item.TenNhanVien
        }));
        if (response && response.errCode === 0) {
            setOptionsTenNhanVien(data)
        }
    }


    // useEffect(() => {
    //     console.log('New user changed:', newUser);
    // }, [newUser]);

    useEffect(() => {
        if (show) {
            // handleSelectPhongBan();
            handleSelectGroup();
            handleSelectNhanVien();
            getAllUsers();
            setModalOpened(true);
        } else {
            setModalOpened(false);
            // setSelectedOptionPhongBan(null);
            setSelectedOptionGroup(null);
            setSelectedOptionTenNhanVien(null);
        }
    }, [show]);

    // useEffect(() => {
    //     if (show) {
    //         getAllUsers();
    //     }
    // }, [])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Thêm User</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>User:<i className='lable-i'>*</i></label>
                        <input type="text"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            className='form-control top-input'
                        />
                    </div>
                    <div className='row input-row select-container-user'>
                        <div className='col-md-12 selectContainerStyle'>
                            <label className=''>Tên nhân viên:<i className='lable-i'>*</i></label>
                            <Select
                                value={selectedOptionTenNhanVien}
                                onChange={handleSelectChangeTenNhanVien}
                                options={optionsTenNhanVien}
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
                    </div>
                    <div className='row input-row select-container-user'>
                        <div className='col-md-12 selectContainerStyle'>
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
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleSaveUser()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalNewUser;