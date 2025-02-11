import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { editMenuConService, fetchAllGroup, getAllSelectMenuCha } from '../../services/menuService'
import Select from 'react-select';
import { toast } from 'react-toastify';

const ModalEditMenuCon = (props) => {
    const { show, handleClose, dataEditMenuCon, onGridReadyMenuCon, dataNhomQuyen, dataMenuCha, socket } = props;
    //const [editedData, setEditedData] = useState({ ...dataEditMenuCon });
    const [selectedOptionGroup, setSelectedOptionGroup] = useState([]);
    const [optionsGroup, setOptionsGroup] = useState([]);
    //const [group, setGroup] = useState([]);
    const [selectedOptionMenuCha, setSelectedOptionMenuCha] = useState([]);
    const [optionsMenuCha, setOptionsMenuCha] = useState([]);
    //const [menucha, setMenuCha] = useState('');
    const [editedData, setEditedData] = useState({
        ...dataEditMenuCon,
        //link: '',
        //tenmenu_con: '',
        // menucha: '',
        //group: '',
    });

    //console.log('editedData', editedData)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChangeMenuCha = (selectedOptionMenuCha) => {
        setSelectedOptionMenuCha(selectedOptionMenuCha);
        //setMenuCha({ ...editedData, menu_cha_id: selectedOptionMenuCha.value });
        // Cập nhật editedData với menu_cha_id mới
        setEditedData((prevData) => ({
            ...prevData,
            menu_cha_id: selectedOptionMenuCha.value  // Cập nhật menu_cha_id mới
        }));
    };


    const handleSelectMenuCha = async () => {
        let response = await getAllSelectMenuCha();
        //console.log('handleSelectMenuCha', response)
        const data = response.data.map(item => ({
            value: item.id,
            label: item.tenmenu_cha
        }));
        if (response && response.errCode === 0) {
            setOptionsMenuCha(data)
        }
    }

    const handleSelectChangeGroup = (selectedOptionGroup) => {
        setSelectedOptionGroup(selectedOptionGroup);
        // Lấy danh sách id từ các option đã chọn
        const selectedIds = selectedOptionGroup.map(option => option.value);
        setEditedData((prevData) => ({
            ...prevData,
            group: selectedIds
        }));
        // //setGroup(selectedIds);
        // setGroup({ ...editedData, group: selectedIds });
    };


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

    const handleSave = async () => {
        //console.log('handleSave', editedData)
        try {
            let res = await editMenuConService(editedData);
            if (res && res.errCode === 0) {
                socket.emit('edit_menu_cha_server', { data: res });
                //onGridReadyMenuCon()
                handleClose()
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {

        }

    }

    // useEffect(() => {
    //     const dataArray = Array.isArray(dataNhomQuyen) ? dataNhomQuyen : [];
    //     const ids = dataArray.map(item => item.id);
    //     setGroup(ids);

    //     const dataArrayMenuCha = Array.isArray(dataMenuCha) ? dataMenuCha : [];
    //     const ids_menucha = dataArrayMenuCha.map(item => item.id);
    //     setGroup(ids);
    //     //setMenuCha(ids_menucha);
    // }, [dataNhomQuyen, dataMenuCha]);

    useEffect(() => {
        if (socket) {
            socket.on('edit_menu_cha_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReadyMenuCon === 'function') {
                    //console.log('Calling onGridReadyMenuCon from socket event');
                    setTimeout(() => {
                        onGridReadyMenuCon();
                    }, 200);
                } else {
                    console.warn('onGridReadyMenuCon is not a function');
                }
            });
        }
        return () => {
            if (socket) {
                socket.off('create_menu_cha_client');
            }
        };
    }, [socket, onGridReadyMenuCon]);

    useEffect(() => {
        // console.log('dataEditMenuCon', dataEditMenuCon)
        if (show) {
            setEditedData({ ...dataEditMenuCon });
            handleSelectGroup();
            handleSelectMenuCha();
            onGridReadyMenuCon();
            if (dataNhomQuyen) {
                const selectedOptionGroup = dataNhomQuyen.map(item => {
                    return {
                        value: item.id,
                        label: item.MoTa
                    };
                });

                const selectedOptionMenuCha = dataMenuCha.map(item => {
                    return {
                        value: item.id,
                        label: item.tenmenu_cha
                    };
                });

                setSelectedOptionGroup(selectedOptionGroup);
                setSelectedOptionMenuCha(selectedOptionMenuCha);
            } else {
                setSelectedOptionGroup([]);
                setSelectedOptionMenuCha([]);
            }
        }
    }, [dataEditMenuCon])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Sửa menu con</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>Link</label>
                        <input type="text"
                            name="link"
                            value={editedData.link} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Tên menu</label>
                        <input type="text"
                            name="tenmenu_con"
                            value={editedData.tenmenu_con} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                    <div className='row input-row select-container-user'>
                        <div className='col-md-12 selectContainerStyle'>
                            <label>Menu cha:<i className='lable-i'>*</i></label>
                            <Select
                                value={selectedOptionMenuCha || []}
                                onChange={handleSelectChangeMenuCha}
                                options={optionsMenuCha}
                                menuPlacement="top"
                                placeholder="Chọn nhóm quyền..."
                                //isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 1,
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontSize: '14px',
                                        fontStyle: 'italic'
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        fontSize: '13px',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        fontSize: '16px',
                                        color: 'blue',
                                        fontWeight: 'italic',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <div className='row input-row select-container-user'>
                        <div className='col-md-12 selectContainerStyle'>
                            <label>Nhóm quyền:<i className='lable-i'>*</i></label>
                            <Select
                                value={selectedOptionGroup || []}
                                onChange={handleSelectChangeGroup}
                                options={optionsGroup}
                                menuPlacement="top"
                                placeholder="Chọn nhóm quyền..."
                                isMulti='true'
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        position: 'relative',
                                        zIndex: 1,
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        paddingRight: '10px',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontSize: '14px',
                                        fontStyle: 'italic'
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        fontSize: '13px',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        fontSize: '16px',
                                        color: 'blue',
                                        fontWeight: 'italic',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleSave()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleClose} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalEditMenuCon;