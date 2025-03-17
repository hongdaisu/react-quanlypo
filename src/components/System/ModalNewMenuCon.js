import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { newMenuConService, getAllSelectMenuCha, fetchAllGroup } from '../../services/menuService'
import Select from 'react-select';
import { toast } from 'react-toastify';

const ModalNewMenuCon = (props) => {
    const { show, handleClose, onGridReadyMenuCon, socket } = props;
    const [link, setLink] = useState('');
    const [tenmenu_con, setTenMenu_Con] = useState('');

    const [selectedOptionMenuCha, setSelectedOptionMenuCha] = useState([]);
    const [optionsMenuCha, setOptionsMenuCha] = useState([]);
    const [selectedOptionGroup, setSelectedOptionGroup] = useState([]);
    const [optionsGroup, setOptionsGroup] = useState([]);

    const [menucha, setMenuCha] = useState('');
    const [group, setGroup] = useState([]);

    //console.log('onGridReadyMenuCon', onGridReadyMenuCon())

    const newMenuCon = { link, tenmenu_con, menucha, group };
    const handleSaveMenuCon = async () => {
        try {
            let res = await newMenuConService(newMenuCon);
            if (res && res.errCode === 0) {
                socket.emit('create_menu_cha_server', { data: res });
                setTenMenu_Con('');
                setLink('');
                setMenuCha('');
                setGroup([]);
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {

        }
    }

    const handleSelectChangeMenuCha = (selectedOptionMenuCha) => {
        setSelectedOptionMenuCha(selectedOptionMenuCha);
        setMenuCha({ ...menucha, id: selectedOptionMenuCha.value });
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
        setGroup(selectedIds);
        //setGroup({ ...group, id: selectedOptionGroup.value });
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

    const handleCloseModal = () => {
        setTenMenu_Con('');
        setLink('');
        setMenuCha('');
        setGroup('');
        handleClose();
    }

    useEffect(() => {
        if (socket) {
            socket.on('create_menu_cha_client', (data) => {
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
        if (show) {
            onGridReadyMenuCon();
            handleSelectMenuCha();
            handleSelectGroup();
        } else {
            setSelectedOptionMenuCha(null);
            setSelectedOptionGroup(null);
        }
    }, [show])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Thêm Menu Con</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>Link<i className='lable-i'>*</i></label>
                        <input type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Tên menu<i className='lable-i'>*</i></label>
                        <input type="text"
                            value={tenmenu_con}
                            onChange={(e) => setTenMenu_Con(e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <div className='row input-row select-container-user'>
                        <div className='col-md-12 selectContainerStyle'>
                            <label>Menu cha:<i className='lable-i'>*</i></label>
                            <Select
                                value={selectedOptionMenuCha}
                                onChange={handleSelectChangeMenuCha}
                                options={optionsMenuCha}
                                menuPlacement="top"
                                placeholder="Chọn tên menu cha..."
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
                <Button onClick={() => handleSaveMenuCon()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalNewMenuCon