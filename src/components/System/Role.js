import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Grid.css';
import './GroupRole.scss'
import { fetchAllRole, checkGroupRole, getAllGroupRole, newRoleGroupService, deleteRoleGroupService } from '../../services/grouproleService';
import ModalEditRole from './ModalEditRole';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import ModalNewRole from './ModalNewRole';
import Group from './Group';
import { toast } from 'react-toastify';
import { compareObjects, convertDifferencesToObject } from './functionData';
import Cookies from 'js-cookie';
import ClearableFloatingFilter from './CustomFloatingFilter';
import { Tooltip as ReactTooltip } from "react-tooltip";

const Role = (props) => {

    const [rowData, setRowData] = useState([]);
    const [showModalNewRole, setShowModalNewRole] = useState(false);
    const [showModalEditRole, setShowModalEditRole] = useState(false);
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false);
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState({});
    const [dataEditRole, setDataEditRole] = useState({});
    const [rowDataCopy, setRowDataCopy] = useState([]);

    const [dataFromChild, setDataFromChild] = useState(null);
    // console.log('rowData', rowData)
    const use_groupId = Cookies.get('use_groupId');
    const handleClose = () => {
        setShowModalEditRole(false);
        setShowModalNewRole(false);
        setShowModalXacNhanXoa(false);
    }

    const handleEditRole = async (user) => {
        setShowModalEditRole(true);
        setDataEditRole(user.data);
    }

    const handleDeleteRole = async (user) => {
        setShowModalXacNhanXoa(true);
        setDataXacNhanXoa(user.data);
    }

    const handleNewRole = async () => {
        setShowModalNewRole(true);
    }

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Action', field: '', pinned: 'left', width: 70, maxWidth: 70,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) =>
                <div className="custom-action-cell">
                    <button className='btn-edit' onClick={() => { handleEditRole(params) }} data-tooltip-id="edit"><i className="fas fa-pencil-alt"></i></button>
                    <button className='btn-delete' onClick={() => { handleDeleteRole(params) }} data-tooltip-id="delete" ><i className="fas fa-trash"></i></button>
                </div>
        },
        {
            filter: false, unSortIcon: false, field: 'ischeck', lockPosition: true, minWidth: 40,
            cellRenderer: (params) => (
                <input type="checkbox" checked={params.value === 1}
                    onChange={(e) => handleCheckboxChange(e, params.data.id)}
                />
            ),
        },
        {
            headerName: 'URL', field: 'url', lockPosition: true, minWidth: 180,
            cellRenderer: 'agGroupCellRenderer'
        },
        { headerName: 'Chức năng', field: 'action', minWidth: 120 },
        { headerName: 'Mô tả', field: 'MoTa' },
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
            minWidth: 500,
            flex: 1
        }
    );

    useEffect(() => {
        getAllRole()
    }, [])

    const handleSaveRole = async () => {
        // console.log('dataFromChild', dataFromChild)

        try {
            if (dataFromChild) {
                // console.log('dataFromChild.checkbox', dataFromChild.checkbox)
                if (dataFromChild.checkbox === true) {

                    const valuesArray = Object.values(dataFromChild);
                    let groupId = valuesArray.reduce((obj, value) => {
                        obj[value.id] = value;
                        return obj;
                    });
                    let checkgroup = await checkGroupRole(groupId);
                    let allrole = await getAllGroupRole(groupId);
                    let newAllrole = allrole.grouprole;
                    // console.log('newAllrole', newAllrole)

                    const dataGroupRole = newAllrole.filter(row => row.ischeck === 1);
                    // console.log('dataGroupRole', dataGroupRole)
                    const objectdataGroupRole = {};
                    dataGroupRole.forEach((value, index) => {
                        objectdataGroupRole[index] = {
                            groupId: value.groupId,
                            roleId: value.roleId,
                        };
                    });
                    const dataRole = rowData.filter(item => item.ischeck === 1);
                    const uniqueIds = new Set();
                    // remove objects trùng
                    const uniqueObjects = dataRole.filter(item => {
                        if (!uniqueIds.has(item.id)) {
                            uniqueIds.add(item.id);
                            return true;
                        }
                        return false;
                    });

                    const objectFromIndex = {};
                    uniqueObjects.forEach((value, index) => {
                        objectFromIndex[index] = {
                            groupId: groupId.id,
                            roleId: value.id,
                        };
                    });

                    // so sánh object nào lớn hơn.
                    // const deepCompare = compareObjects(objectdataGroupRole, objectFromIndex);
                    // so sánh giống nhau
                    const isEqual = compareObjects(objectdataGroupRole, objectFromIndex);
                    // Tìm sự khác biệt
                    const differences = compareObjects(objectdataGroupRole, objectFromIndex, { findDifferences: true });
                    const differencesremove = compareObjects(objectdataGroupRole, objectFromIndex, { findDifferencesremove: true });

                    const convertedObject = convertDifferencesToObject(differencesremove);
                    if (checkgroup.checkgrouprole.length === 0) {
                        // console.log('chưa có nhóm quyền a')
                        if (dataRole.length === 0) {
                            toast.warning('Bạn chưa chọn quyền')
                        } else {
                            // console.log('objectFromIndex', objectFromIndex)
                            let res = await newRoleGroupService(objectFromIndex);
                            if (res && res.errCode === 0) {
                                toast.success(res.errMessage)
                            } else {
                                toast.error(res.errMessage)
                            }
                        }
                    } else {

                        if (dataRole.length === 0) {
                            // console.log('chưa có nhóm quyền b')
                            // console.log('dataRole.length', dataRole.length)
                            if (objectdataGroupRole) {
                                const resultObject = Object.fromEntries(
                                    Object.entries(differences).map(([key, value]) => [key, value.oldValue])
                                );
                                let res = await deleteRoleGroupService(resultObject);
                                if (res && res.errCode === 0) {
                                    toast.success(res.errMessage)
                                } else {
                                    toast.error(res.errMessage)
                                }
                            } else {
                                toast.warning('Bạn chưa chọn quyền')
                            }
                        } else {
                            // console.log(' có nhóm quyền')
                            // console.log('dataRole.length', dataRole.length)
                            if (isEqual.isEqual === true) {
                                toast.warning('Bạn chưa chọn quyền cần cập nhập')
                            } else {
                                if (isEqual.deepCompare === 'objA') {
                                    // console.log('bỏ bớt phân quyền')
                                    const differencesremove = compareObjects(objectdataGroupRole, objectFromIndex, { findDifferencesremove: true });
                                    // console.log('differencesremove', differencesremove)
                                    const resultObject = Object.fromEntries(
                                        Object.entries(differencesremove).map(([key, value]) => [key, value.oldValue])
                                    );
                                    // console.log('resultObject', resultObject)
                                    let res = await deleteRoleGroupService(resultObject);
                                    if (res && res.errCode === 0) {
                                        toast.success(res.errMessage)
                                    } else {
                                        toast.error(res.errMessage)
                                    }
                                } else {
                                    // console.log('thêm phân quyền')
                                    let res = await newRoleGroupService(convertedObject);
                                    if (res && res.errCode === 0) {
                                        toast.success(res.errMessage)
                                    } else {
                                        toast.error(res.errMessage)
                                    }
                                }
                            }
                        }
                    }
                } else {
                    toast.warning('Bạn chưa chọn nhóm quyền')
                }
            } else {
                toast.warning('Bạn chưa chọn nhóm quyền')
            }
        } catch (e) {
            console.log(e)
        }
    }

    // const handleCheckboxChange = (e, id) => {
    //     const checked = e.target.checked;
    //     let a = e.target.checked;
    //     console.log('checked role:', a);

    //     setRowData(prevData =>
    //         prevData.map(row => {
    //             if (row.id === id) {
    //                 return { ...row, ischeck: checked ? 1 : 0 };
    //             }
    //             return row;
    //         })
    //     );
    // };

    const handleCheckboxChange = (e, id) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của checkbox
        const checked = e.target.checked;
        // console.log('checked role:', checked);

        setRowData(prevData =>
            prevData.map(row => {
                if (row.id === id) {
                    return { ...row, ischeck: checked ? 1 : 0 };
                }
                return row;
            })
        );

    };

    const receiveDataFromChild = async (data) => {
        setDataFromChild(data);
        try {
            if (data.checkbox === true) {
                const valuesArray = Object.values(data);
                let groupId = valuesArray.reduce((obj, value) => {
                    obj[value.id] = value;
                    return obj;
                });
                let checkgroup = await checkGroupRole(groupId);
                let allrole = await getAllGroupRole(groupId);

                // console.log('data.checkbox', data.checkbox)
                //console.log('checkgroup.checkgrouprole.length', checkgroup, checkgroup.checkgrouprole)
                // console.log('allrole.grouprole.length', allrole.grouprole.length)

                if (checkgroup.checkgrouprole.length !== 0) {
                    if (allrole.grouprole.length !== 0) {
                        let grouprole = allrole.grouprole.map((_val, index) => ({
                            ischeck: _val.ischeck,
                            groupId: _val.groupId,
                            roleId: _val.roleId,
                        }));
                        // console.log('grouprole', grouprole)
                        if (allrole && allrole.errCode === 0) {

                            // setRowData((prevData) => {
                            //     return prevData.map((row, index) => {
                            //         return {
                            //             ...row,
                            //             ischeck: grouprole[index]?.ischeck ?? row.ischeck,
                            //             groupId: grouprole[index]?.groupId ?? row.groupId,
                            //             roleId: grouprole[index]?.roleId ?? row.roleId,
                            //         };
                            //     });
                            // });

                            setRowData((prevData) => {
                                return prevData.map((row) => {
                                    const matchedRole = grouprole.find((role) => role.roleId === row.id);
                                    if (matchedRole) {
                                        return {
                                            ...row,
                                            ischeck: matchedRole.ischeck,
                                            groupId: matchedRole.groupId,
                                            roleId: matchedRole.roleId,
                                        };
                                    } else {
                                        return row;
                                    }
                                });
                            });

                            // console.log('rowData', rowData)
                        }
                    } else {
                        getAllRole()
                    }
                } else {
                    // setRowData((prevData) => {
                    //     return prevData.map((row, index) => {
                    //         return {
                    //             ...row,
                    //             groupId: groupId.id,
                    //         };
                    //     });
                    // });
                    getAllRole()
                    if (allrole.grouprole.length !== 0) {
                        let grouprole = rowData.map((_val, index) => ({
                            ischeck: _val.ischeck,
                            groupId: _val.groupId,
                            roleId: _val.roleId,
                        }));
                        // console.log('check chưa có quyền', grouprole)
                        if (allrole && allrole.errCode === 0) {
                            // setRowData((prevData) => {
                            //     return prevData.map((row, index) => {
                            //         return {
                            //             ...row,
                            //             ischeck: grouprole[index]?.ischeck ?? row.ischeck,
                            //             groupId: grouprole[index]?.groupId ?? row.groupId,
                            //             roleId: grouprole[index]?.roleId ?? row.roleId,
                            //         };
                            //     });
                            // });
                            setRowData((prevData) => {
                                return prevData.map((row) => {
                                    const matchedRole = grouprole.find((role) => role.roleId === row.id);
                                    if (matchedRole) {
                                        return {
                                            ...row,
                                            ischeck: matchedRole.ischeck,
                                            groupId: matchedRole.groupId,
                                            roleId: matchedRole.roleId,
                                        };
                                    } else {
                                        return row;
                                    }
                                });
                            });
                        }
                    } else {
                        getAllRole()
                    }
                }
            } else {
                getAllRole()
            }
        } catch (e) {
            console.log(e)
        }
    };

    const getAllRole = async () => {
        try {
            let response = await fetchAllRole();
            // console.log('check data role', response)
            if (response && response.errCode === 0) {
                setRowData(response.role)
                // console.log('useEffect', rowData)
            }
        } catch (e) {
            console.log(e);
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
            {/* <div className="users-container">
                <div className='container container-top'>
                    <div className='row'> */}
            <div className='row grid-container'>
                <div className='col-6'>
                    <div className="row d-flex input-row-phanquyen">
                        <div className="col-md-2 d-flex">
                            <button
                                type="button"
                                className="btn btn-primary px-1 button-import me-2"
                                onClick={handleNewRole}
                            >
                                <i className='button-new'>Thêm mới</i>
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary px-1 button-import ms-auto"
                                onClick={handleSaveRole}
                            >
                                <i className='button-new'>Lưu</i>
                            </button>
                        </div>
                    </div>
                    {/* <div className="row d-flex input-row-dongbo">
                        <div className='mx-1 btn-role'>
                            <button className='btn btn-primary px-1 full-button'
                                onClick={() => handleNewRole()}
                            ><i className='button-new'>Thêm mới</i></button>
                            <button className='btn btn-primary px-4 full-button'
                                onClick={() => handleSaveRole()}
                            ><i className='button-new'>Lưu</i></button>
                        </div>
                    </div> */}
                    <div>
                        <ModalNewRole
                            show={showModalNewRole}
                            handleClose={handleClose}
                            getAllRole={getAllRole}
                        />
                    </div>
                    <div>
                        <ModalEditRole
                            show={showModalEditRole}
                            dataEditRole={dataEditRole}
                            handleClose={handleClose}
                            getAllRole={getAllRole}
                        />
                    </div>
                    <div>
                        <ModalXacNhanXoa
                            show={showModalXacNhanXoa}
                            dataXacNhanXoa={dataXacNhanXoa}
                            handleClose={handleClose}
                            getAllRole={getAllRole}
                        />
                    </div>
                    <div className="ag-theme-alpine" id='myGrid' style={{ height: '78vh', width: '100%' }}
                    >
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            pagination={true}
                            paginationPageSize='20'
                        />
                    </div>
                </div>
                <div className='col-6'>
                    <Group
                        sendDataToParent={receiveDataFromChild}
                    />
                </div>
            </div>
            {/* </div >
            </div > */}
        </>
    )
}

export default Role;