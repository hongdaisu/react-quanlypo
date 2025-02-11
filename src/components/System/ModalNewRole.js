import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { newRoleService } from '../../services/grouproleService'
import { toast } from 'react-toastify';

const ModalNewRole = (props) => {
    const { show, handleClose, getAllRole } = props;
    const [url, setURL] = useState('');
    const [action, setAction] = useState('');
    const [mota, setMoTa] = useState('');
    // const [nhom, setNhom] = useState('role');

    const newRole = { url, action, mota };
    const handleSaveRole = async () => {
        try {
            let res = await newRoleService(newRole);
            if (res && res.errCode === 0) {
                setURL('');
                setAction('');
                setMoTa('');
                getAllRole();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {

        }

    }

    const handleCloseModal = () => {
        setURL('');
        setAction('');
        setMoTa('');
        handleClose();
    }

    useEffect(() => {
        if (show) {
            getAllRole();
        }
    }, [])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Thêm Role</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>URL</label>
                        <input type="text"
                            value={url}
                            onChange={(e) => setURL(e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Action</label>
                        <input type="text"
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Mô tả</label>
                        <input type="text"
                            value={mota}
                            onChange={(e) => setMoTa(e.target.value)}
                            className='form-control'
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleSaveRole()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalNewRole;