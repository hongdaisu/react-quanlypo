import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { editMenuChaService } from '../../services/menuService'

import { toast } from 'react-toastify';

const ModalEditMenuCha = (props) => {
    const { show, handleClose, dataEditMenuCha, onGridReady, socket } = props;
    const [editedData, setEditedData] = useState({ ...dataEditMenuCha });

    //console.log('editedData', editedData)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // console.log('editedData', editedData)
        try {
            let res = await editMenuChaService(editedData);
            if (res && res.errCode === 0) {
                socket.emit('edit_menu_cha_server', { data: res });
                //onGridReady()
                handleClose()
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {

        }

    }

    useEffect(() => {
        if (socket) {
            socket.on('edit_menu_cha_client', (data) => {
                //console.log('Socket event received');
                if (typeof onGridReady === 'function') {
                    //console.log('Calling onGridReady from socket event');
                    setTimeout(() => {
                        onGridReady();
                    }, 200);
                } else {
                    console.warn('onGridReady is not a function');
                }
            });
        }
        return () => {
            if (socket) {
                socket.off('create_menu_cha_client');
            }
        };
    }, [socket, onGridReady]);

    useEffect(() => {
        // console.log('dataEditMenuCha', dataEditMenuCha)
        if (show) {
            setEditedData({ ...dataEditMenuCha });
            onGridReady();
        }
    }, [dataEditMenuCha])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Sửa menu</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>Tên menu cha</label>
                        <input type="text"
                            name="tenmenu_cha"
                            value={editedData.tenmenu_cha} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
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

export default ModalEditMenuCha;