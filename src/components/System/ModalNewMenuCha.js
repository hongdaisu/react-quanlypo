import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { newMenuChaService } from '../../services/menuService'

import { toast } from 'react-toastify';

const ModalNewMenuCha = (props) => {
    const { show, handleClose, onGridReady, socket } = props;
    const [tenmenu_cha, setTenMenu_Cha] = useState('');

    const newMenuCha = { tenmenu_cha };
    const handleSaveMenuCha = async () => {
        try {
            let res = await newMenuChaService(newMenuCha);
            if (res && res.errCode === 0) {
                socket.emit('create_menu_cha_server', { data: res });
                setTenMenu_Cha('');
                //onGridReady();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.warning(res.errMessage)
            }
        } catch (e) {

        }
    }

    const handleCloseModal = () => {
        setTenMenu_Cha('');
        handleClose();
    }

    useEffect(() => {
        if (socket) {
            socket.on('create_menu_cha_client', (data) => {
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
        if (show) {
            onGridReady();
        }
    }, [])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Thêm Menu Cha</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>Tên menu</label>
                        <input type="text"
                            value={tenmenu_cha}
                            onChange={(e) => setTenMenu_Cha(e.target.value)}
                            className='form-control'
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleSaveMenuCha()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalNewMenuCha;