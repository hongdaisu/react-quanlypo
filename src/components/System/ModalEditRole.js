import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { editRoleService } from '../../services/grouproleService'

import { toast } from 'react-toastify';

const ModalEditRole = (props) => {
    const { show, handleClose, dataEditRole, getAllRole } = props;
    const [editedData, setEditedData] = useState({ ...dataEditRole });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveGroup = async () => {
        // console.log('editedData', editedData)
        try {
            let res = await editRoleService(editedData);
            if (res && res.errCode === 0) {
                getAllRole()
                handleClose()
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {

        }

    }

    useEffect(() => {
        if (show) {
            setEditedData({ ...dataEditRole });
            getAllRole();
        }
    }, [dataEditRole])
    // console.log('dataEditRole', dataEditRole)
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Sửa Role</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>URL</label>
                        <input type="text"
                            name="url"
                            value={editedData.url} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Chức năng</label>
                        <input type="text"
                            name="action"
                            value={editedData.action} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                    <div className='input-container max-w'>
                        <label>Mô tả</label>
                        <input type="text"
                            name="MoTa"
                            value={editedData.MoTa} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => handleSaveGroup()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleClose} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalEditRole;