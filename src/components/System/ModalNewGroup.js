import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { newGroupService } from '../../services/grouproleService'

import { toast } from 'react-toastify';

const ModalNewGroup = (props) => {
    const { show, handleClose, getAllGroup } = props;
    const [group, setGroup] = useState('');
    const [mota, setMoTa] = useState('');
    const [maGroup, setMaGroup] = useState('');

    const newUser = { group, mota, maGroup };
    const handleSaveGroup = async () => {
        try {
            let res = await newGroupService(newUser);
            if (res && res.errCode === 0) {
                setGroup('');
                setMoTa('');
                setMaGroup('');
                getAllGroup();
                handleClose();
                toast.success(res.errMessage)
            } else {
                toast.error(res.errMessage)
            }
        } catch (e) {

        }

    }

    const handleCloseModal = () => {
        setGroup('');
        setMoTa('');
        setMaGroup('');
        handleClose();
    }

    useEffect(() => {
        if (show) {
            getAllGroup();
        }
    }, [])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='lg'
        >
            <ModalHeader>Thêm Group</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container max-w'>
                        <label>Tên group</label>
                        <input type="text"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
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
                    <div className='input-container max-w'>
                        <label>Mã group</label>
                        <input type="text"
                            value={maGroup}
                            onChange={(e) => setMaGroup(e.target.value)}
                            className='form-control'
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleSaveGroup()} className='btn btn-primary px-2 savebtn'>
                    <i className='button-save'>Save</i></Button>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalNewGroup;