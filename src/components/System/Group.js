import { useState, useEffect } from 'react';
import { AgGridReact, useCheckboxSelection } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Grid.css';
import './GroupRole.scss'
import { fetchAllGroup } from '../../services/grouproleService';
import ModalEditGroup from './ModalEditGroup';
import ModalNewGroup from './ModalNewGroup';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import { Button } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import ClearableFloatingFilter from './CustomFloatingFilter';
import { Tooltip as ReactTooltip } from "react-tooltip";

const Group = (props) => {
    const { sendDataToParent } = props;
    const [rowData, setRowData] = useState([]);
    const [showModalEditGroup, setShowModalEditGroup] = useState(false);
    const [showModalNewGroup, setShowModalNewGroup] = useState(false);
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false);
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState({});
    // const [checkboxGroup, setcheckboxGroup] = useState([]);
    const [dataEditGroup, setDataEditGroup] = useState({});

    // console.log('sendDataToParent', checkboxGroup)
    const handleClose = () => {
        setShowModalEditGroup(false);
        setShowModalNewGroup(false);
        setShowModalXacNhanXoa(false);
    }

    const handleEditGroup = async (user) => {
        setShowModalEditGroup(true);
        setDataEditGroup(user.data);
    }

    const handleDeleteGroup = async (user) => {
        setShowModalXacNhanXoa(true);
        setDataXacNhanXoa(user.data);
    }

    const handleNewGroup = async () => {
        setShowModalNewGroup(true);
    }

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Action', field: '', pinned: 'left', width: 70, maxWidth: 70,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) =>
                <div className="custom-action-cell">
                    <button className='btn-edit' onClick={() => { handleEditGroup(params) }} data-tooltip-id="edit"><i className="fas fa-pencil-alt"></i></button>
                    <button className='btn-delete' onClick={() => { handleDeleteGroup(params) }} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                </div>
        },
        // { headerName: '', headerCheckboxSelection: false, checkboxSelection: true, width: 'auto' }, // Cột checkbox
        {
            headerName: ' ', field: '', lockPosition: true, checkboxSelection: true, minWidth: 40,
            cellRenderer: 'agGroupCellRenderer',
            filter: false,
            unSortIcon: false,
        },
        { headerName: 'Mô tả', field: 'MoTa', width: 170, maxWidth: 170, },
        { headerName: 'Mã group', field: 'MaGroup', width: 120, maxWidth: 120, },
        { headerName: 'Group', field: 'Group', width: 170, maxWidth: 170, },
        // { headerName: 'Nhóm', field: 'Nhom' },
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
            minWidth: 200,
            flex: 1
        }
    );

    useEffect(() => {
        getAllGroup()
    }, [])

    // const sendDataToParent = () => {
    //     // onSelectionChanged()
    // }

    const onSelectionChanged = (event) => {
        let dataGroup = event.api.getSelectedRows()
        if (dataGroup.length === 1) {
            sendDataToParent({ ...dataGroup, checkbox: true })
        } else {
            sendDataToParent({ checkbox: false });
        }

        // this.props.checkboxGroup(this.state);//truyền data từ modal về lại view
    }

    const getAllGroup = async () => {
        let response = await fetchAllGroup();
        //console.log('getAllGroup', response)
        if (response && response.errCode === 0) {
            setRowData(response.group)
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
            {/* <div className="users-container grid-container">
                <div className='container'>
                    <div className='row'> */}
            <div className='row grid-container'>
                <div className='col-12'>
                    <div className="row d-flex input-row-phanquyen">
                        <div className="col-md-2 d-flex">
                            <button
                                type="button"
                                className="btn btn-primary px-1 button-import me-2"
                                onClick={handleNewGroup}
                            >
                                <i className='button-new'>Thêm mới</i>
                            </button>
                        </div>
                    </div>
                </div>
                {/* <div className='mx-1'>
                    <button className='btn btn-primary px-1 full-button'
                        onClick={() => handleNewGroup()}
                    ><i className='button-new'>Thêm mới</i></button>
                </div> */}
                <div>
                    <ModalEditGroup
                        show={showModalEditGroup}
                        dataEditGroup={dataEditGroup}
                        handleClose={handleClose}
                        getAllGroup={getAllGroup}
                    />
                </div>
                <div>
                    <ModalNewGroup
                        show={showModalNewGroup}
                        handleClose={handleClose}
                        getAllGroup={getAllGroup}
                    />
                </div>
                <div>
                    <ModalXacNhanXoa
                        show={showModalXacNhanXoa}
                        dataXacNhanXoa={dataXacNhanXoa}
                        handleClose={handleClose}
                        getAllGroup={getAllGroup}
                    />
                </div>
                <div className="ag-theme-alpine container" id='myGrid' style={{ height: '78vh', width: '100%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        onSelectionChanged={onSelectionChanged}
                        paginationPageSize='20'
                    />
                </div>
            </div>
            {/* </div >
            </div > */}
        </>
    )
}

export default Group;