import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import './Grid.css';
import './User.scss';
import './PdfView.scss';
import { fetchAllUsers, checkXoaUser } from '../../services/userServices';
import { handleGetAction } from '../../services/actionButtonServices';
// import { fetchPhongBanId } from '../../services/phongbanServices';
import ModalEditUser from './ModalEditUser';
import ModalNewUser from './ModalNewUser';
import '../Header/Header.scss';
import { toast } from 'react-toastify';
import ClearableFloatingFilter from './CustomFloatingFilter';
import { Tooltip as ReactTooltip } from "react-tooltip";

const User = (props) => {

    const [rowData, setRowData] = useState([]);
    const [showModalNewUser, setShowModalNewUser] = useState(false);
    const [showModalEditUser, setShowModalEditUser] = useState(false);
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false);
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState({});
    const [dataEditUser, setDataEditUser] = useState({});
    const [containerStyle] = useState({ height: '10vh', width: '100%' });
    const [gridStyle] = useState({ height: '78vh', width: '100%' });
    const [actionEdit, setActionEdit] = useState('EDITUSER');
    const [actionNew, setActionNew] = useState('ADDUSER');
    const [actionDelete, setActionDelete] = useState('DELETEUSER');
    const [imageUrlData, setImageUrl] = useState(null);

    const handleClose = () => {
        setShowModalEditUser(false);
        setShowModalNewUser(false);
        setShowModalXacNhanXoa(false);
    }

    const handleNewUser = async (user) => {
        try {
            let res = await handleGetAction(actionNew);
            if (res && res.errCode === 0) {
                setShowModalNewUser(true);
            }
        } catch (error) {
        }
    }

    const handleEditUser = async (user) => {
        let User_Id = user.data.User_Id
        try {
            let res = await handleGetAction(actionEdit, User_Id);
            console.log('res.imageUrl', res)
            if (res && res.errCode === 0) {
                setShowModalEditUser(true);
                setDataEditUser(user.data);
                setImageUrl(res.imageUrl);
            }
        } catch (error) {
        }
    }

    // const handleEditUser = async (user) => {
    //     let User_Id = user.data.User_Id;
    //     try {
    //         let res = await handleGetAction(actionEdit, User_Id);
    //         if (res && res.errCode === 0) {
    //             // Thêm URL hình ảnh vào dữ liệu người dùng
    //             const userDataWithImage = {
    //                 ...user.data,
    //                 imageUrl: res.fileUrl // Gắn URL file vào dữ liệu người dùng
    //             };

    //             setShowModalEditUser(true);
    //             setDataEditUser(userDataWithImage); // Set dữ liệu người dùng bao gồm cả URL file
    //         }
    //     } catch (error) {
    //         console.error('Error editing user:', error);
    //     }
    // };

    const handleDeleteUser = async (user) => {
        // console.log('user', user.data.id)
        let id = (user.data.User_Id)
        // console.log('user', id)
        try {

            let res = await handleGetAction(actionDelete);
            if (res && res.errCode === 0) {
                let res = await checkXoaUser(id);
                if (res && res.errCode === 0) {
                    const modifiedData = { ...user.data, Nhom: 'user' };
                    setShowModalXacNhanXoa(true);
                    setDataXacNhanXoa(modifiedData);
                } else {
                    setShowModalXacNhanXoa(false);
                    toast.warning(res.errMessage)
                }
            }
        } catch (e) {
            console.log(e);
        }
    }



    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Action', field: '', pinned: 'left', width: 70, maxWidth: 70,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) =>
                <div className="custom-action-cell">
                    <button className='btn-edit' onClick={() => { handleEditUser(params) }} data-tooltip-id="edit"><i className="fas fa-pencil-alt"></i></button>
                    <button className='btn-delete' onClick={() => { handleDeleteUser(params) }} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                </div>
        },
        {
            headerName: 'User', field: 'account', lockPosition: true, width: 150, maxWidth: 150,
            cellRenderer: 'agGroupCellRenderer', cellClass: 'left-align-cell'
        },
        { headerName: 'Tên nhân viên', field: 'firstName', minWidth: 200 },
        { headerName: 'Group', field: 'MoTa', minWidth: 200 },
        // { headerName: 'Giới tinh', field: 'gender', minWidth: 100 },
        { headerName: 'Phòng ban', field: 'TenPhongBan', minWidth: 300 },
        { headerName: 'Chữ ký', field: 'HinhAnh', minWidth: 120 },
        { headerName: 'Tạm ngưng', field: 'TamNgung', minWidth: 120 },
        { headerName: 'Sử dụng', field: 'sudung', minWidth: 120 },
    ]);

    const [defaultColDef, setdefaultColDef] = useState(
        {
            sortable: true,
            suppressHorizontalScroll: true,
            floatingFilter: true,
            filter: 'agTextColumnFilter',
            floatingFilterComponentParams: { suppressFilterButton: true },
            floatingFilterComponent: ClearableFloatingFilter,
            suppressMenu: true,
            unSortIcon: true,
            resizable: true,
            minWidth: 300,
            flex: 1
        }
    );

    useEffect(() => {
        getAllUsers()
    }, [])


    const getAllUsers = async () => {
        let response = await fetchAllUsers();
        if (response && response.errCode === 0) {
            setRowData(response.users)
        }
    }
    return (
        <>

            <ReactTooltip
                id="edit"
                place="top-end"
                variant="info"
                content="Sửa"
            />
            <ReactTooltip
                id="delete"
                place="top-start"
                variant="info"
                content="Xóa"
            />
            <div className='row grid-container'>
                <div className='btn-new'>
                    <button className='btn btn-primary px-1 full-button'
                        onClick={() => handleNewUser()}
                    ><i className='button-new'>Thêm mới</i></button>
                </div>
                <div>
                    <ModalNewUser
                        show={showModalNewUser}
                        handleClose={handleClose}
                        getAllUsers={getAllUsers}
                    />
                </div>
                <div>
                    <ModalEditUser
                        show={showModalEditUser}
                        dataEditUser={dataEditUser}
                        handleClose={handleClose}
                        getAllUsers={getAllUsers}
                        imageUrlData={imageUrlData}
                    />
                </div>
                <div>
                    <ModalXacNhanXoa
                        show={showModalXacNhanXoa}
                        dataXacNhanXoa={dataXacNhanXoa}
                        handleClose={handleClose}
                        getAllUsers={getAllUsers}
                    />
                </div>
                {/* <div className="ag-theme-alpine container" id='myGrid' style={containerStyle}> */}
                <div className="ag-theme-alpine container" id='myGrid' style={gridStyle}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize='20'
                    />
                </div>
                {/* </div> */}
            </div>
        </>
    )
}
export default User;