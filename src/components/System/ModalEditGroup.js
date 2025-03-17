import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { editGroupService } from '../../services/grouproleService'

import { toast } from 'react-toastify';

const ModalEditGroup = (props) => {
    const { show, handleClose, dataEditGroup, getAllGroup } = props;
    const [editedData, setEditedData] = useState({ ...dataEditGroup });

    //console.log('editedData', editedData)

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
            let res = await editGroupService(editedData);
            if (res && res.errCode === 0) {
                getAllGroup()
                handleClose()
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {

        }

    }

    useEffect(() => {
        // console.log('dataEditGroup', dataEditGroup)
        if (show) {
            setEditedData({ ...dataEditGroup });
            getAllGroup();
        }
    }, [dataEditGroup])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Sửa Group</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>Tên group</label>
                        <input type="text"
                            name="Group"
                            value={editedData.Group} onChange={handleInputChange}
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
                    <div className='input-container max-w'>
                        <label>Mã group</label>
                        <input type="text"
                            name="MaGroup"
                            value={editedData.MaGroup} onChange={handleInputChange}
                            className='form-control'
                            autocomplete="off"
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleSaveGroup()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleClose} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalEditGroup;