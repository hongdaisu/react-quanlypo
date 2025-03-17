import { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Grid.css';
import './GroupRole.scss'
import { fetchAllMenuCon, fetchAllMenuCha, getDataNhomQuyen, getDataMenuCha } from '../../services/menuService';
import ModalEditRole from './ModalEditRole';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import ModalNewMenuCha from './ModalNewMenuCha';
import ModalEditMenuCha from './ModalEditMenuCha';
import ModalEditMenuCon from './ModalEditMenuCon';
import { toast } from 'react-toastify';
import { compareObjects, convertDifferencesToObject } from './functionData';
import Cookies from 'js-cookie';
import ClearableFloatingFilter from './CustomFloatingFilter';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { handleGetAction } from '../../services/actionButtonServices';
import { getUrl } from '../../services/urlServices';
import io from "socket.io-client";
import ModalNewMenuCon from './ModalNewMenuCon';
const Menu = (props) => {

    const [rowData, setRowData] = useState([]);
    const [rowDataCha, setRowDataCha] = useState([]);
    const [showModalNewMenuCha, setShowModalNewMenuCha] = useState(false);
    const [showModalNewMenuCon, setShowModalNewMenuCon] = useState(false);
    const [showModalEditMenuCha, setShowModalEditMenuCha] = useState(false);
    const [showModalEditMenuCon, setShowModalEditMenuCon] = useState(false);
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false);
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState({});
    const [dataEditMenuCha, setDataEditMenuCha] = useState({});
    const [dataEditMenuCon, setDataEditMenuCon] = useState({});
    const [rowDataCopy, setRowDataCopy] = useState([]);
    const [dataFromChild, setDataFromChild] = useState(null);

    const [actionNewMenuCha, setActionNewMenuCha] = useState('ADD_MENU_CHA');
    const [actionDeleteMenuCha, setActionDeleteMenuCha] = useState('DELETE_MENU_CHA');
    const [actionEditMenuCha, setActionEditMenuCha] = useState('EDIT_MENU_CHA');

    const [actionNewMenuCon, setActionNewMenuCon] = useState('ADD_MENU_CON');
    const [actionDeleteMenuCon, setActionDeleteMenuCon] = useState('DELETE_MENU_CON');
    const [actionEditMenuCon, setActionEditMenuCon] = useState('EDIT_MENU_CON');
    const [dataNhomQuyen, setDataNhomQuyen] = useState({});
    const [dataMenuCha, setDataMenuCha] = useState({});

    const [socket, setSocket] = useState(null);
    const [socketEventReceived, setSocketEventReceived] = useState(false);
    const [urlView, setUrlView] = useState('');
    const [urlFetched, setUrlFetched] = useState(false);

    //console.log('rowDataCha', rowDataCha)
    const use_groupId = Cookies.get('use_groupId');
    const handleClose = () => {
        setShowModalEditMenuCha(false);
        setShowModalEditMenuCon(false);
        setShowModalNewMenuCha(false);
        setShowModalNewMenuCon(false)
        setShowModalXacNhanXoa(false);
    }

    const handleEditMenuCha = async (user) => {
        try {
            let res_action = await handleGetAction(actionEditMenuCha);
            if (res_action && res_action.errCode === 0) {
                setShowModalEditMenuCha(true);
                setDataEditMenuCha(user.data);
            }
        } catch (e) {
            console.error('Lỗi:', e);
        }
    }

    const handleEditMenuCon = async (user) => {
        try {
            let res_action = await handleGetAction(actionEditMenuCon);

            let id = (user.data.id)
            let data_group = await getDataNhomQuyen(id);
            let data_menucha = await getDataMenuCha(id);
            //console.log('data_group', data_group)
            if (res_action && res_action.errCode === 0) {
                setDataNhomQuyen(data_group);
                setDataMenuCha(data_menucha);
                setShowModalEditMenuCon(true);
                setDataEditMenuCon(user.data);
            }
        } catch (e) {
            console.error('Lỗi:', e);
        }
    }

    const handleDeleteMenuCha = async (user) => {
        try {
            let res_action = await handleGetAction(actionDeleteMenuCha);
            if (res_action && res_action.errCode === 0) {
                const modifiedData = { ...user.data, Nhom: 'xoamenucha' };
                setShowModalXacNhanXoa(true);
                setDataXacNhanXoa(modifiedData);
            }
        } catch (e) {
            console.error('Lỗi:', e);
        }
    }

    const handleDeleteMenuCon = async (user) => {
        try {
            let res_action = await handleGetAction(actionDeleteMenuCon);
            if (res_action && res_action.errCode === 0) {
                const modifiedData = { ...user.data, Nhom: 'xoamenucon' };
                setShowModalXacNhanXoa(true);
                setDataXacNhanXoa(modifiedData);
            }
        } catch (e) {
            console.error('Lỗi:', e);
        }
    }

    const handleNewMenuCha = async () => {
        try {
            let res_action = await handleGetAction(actionNewMenuCha);
            if (res_action && res_action.errCode === 0) {
                setShowModalNewMenuCha(true);
            }
        } catch (e) {
            console.error('Lỗi:', e);
        }
    }

    const handleNewMenuCon = async () => {
        try {
            let res_action = await handleGetAction(actionNewMenuCon);
            if (res_action && res_action.errCode === 0) {
                setShowModalNewMenuCon(true);
            }
        } catch (e) {
            console.error('Lỗi:', e);
        }
    }

    // MENU CON
    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Action', field: '', pinned: 'left', width: 70, maxWidth: 70,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) =>
                <div className="custom-action-cell">
                    <button className='btn-edit-menu' onClick={() => { handleEditMenuCon(params) }} data-tooltip-id="edit"><i className="fas fa-pencil-alt"></i></button>
                    <button className='btn-delete' onClick={() => { handleDeleteMenuCon(params) }} data-tooltip-id="delete" ><i className="fas fa-trash"></i></button>
                </div>
        },
        {
            headerName: 'Link', field: 'link', lockPosition: true, minWidth: 180, maxWidth: 180,
            cellRenderer: 'agGroupCellRenderer'
        },
        { headerName: 'Tên menu con', field: 'tenmenu_con', minWidth: 180, maxWidth: 180 },
        { headerName: 'Menu cha', field: 'tenmenu_cha', minWidth: 120, maxWidth: 120 },
        { headerName: 'Group', field: 'tengroup', minWidth: 500, maxWidth: 500 },
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

    // MENU CHA
    const [columnDefs_Cha, setColumnDefs_Cha] = useState([
        {
            headerName: 'Action', field: '', pinned: 'left', width: 70, maxWidth: 70,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) =>
                <div className="custom-action-cell">
                    <button className='btn-edit-menu' onClick={() => { handleEditMenuCha(params) }} data-tooltip-id="edit"><i className="fas fa-pencil-alt"></i></button>
                    <button className='btn-delete' onClick={() => { handleDeleteMenuCha(params) }} data-tooltip-id="delete" ><i className="fas fa-trash"></i></button>
                </div>
        },
        {
            headerName: 'Tên menu cha', field: 'tenmenu_cha', lockPosition: true, minWidth: 180,
            cellRenderer: 'agGroupCellRenderer'
        },
    ]);

    const [defaultColDef_Cha, setdefaultColDef_Cha] = useState(
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
        try {
            const fetchUrlView = async () => {
                try {
                    // let res = await getUrl();
                    // setUrlView(res.data.url);
                    let res = await getUrl();
                    // console.log('res url', res)
                    if (res && res.errCode === 0) {
                        setUrlView(res.url);
                        setUrlFetched(true);
                    } else {

                    }
                } catch (error) {
                    console.error('Error fetching URL_VIEW:', error);
                }
            };

            fetchUrlView();
        } catch (error) {
            console.error('Error fetching URL_VIEW:', error);
        }
    }, []);

    useEffect(() => {
        try {
            if (urlFetched) {
                // console.log('res urlView', urlView)
                const newSocket = io(urlView, {
                    transports: ['websocket']
                });
                newSocket.on('connect', () => {
                    console.log('Connected to server socket.io');
                });
                newSocket.on('connect_error', (error) => {
                    console.error('Failed to connect to server:', error);
                });
                setSocket(newSocket);

                // return () => {
                //     newSocket.disconnect();
                // };
            }
        } catch (error) {
            console.error('Error fetching URL_VIEW:', error);
        }
    }, [urlFetched, urlView]);

    useEffect(() => {
        try {
            return () => {
                setSocketEventReceived(false);
            };
        } catch (error) {
            console.error('Error fetching URL_VIEW:', error);
        }
    }, []);

    // const getAllMenu = async () => {
    //     try {
    //         let response = await fetchAllMenu();
    //         console.log('check data role', response)
    //         if (response && response.errCode === 0) {
    //             setRowData(response.menu)
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    // const getAllMenuCha = async () => {
    //     try {
    //         let response = await fetchAllMenuCha();
    //         console.log('check data cha role', response)
    //         if (response && response.errCode === 0) {
    //             setRowDataCha(response.menu_cha)
    //             // console.log('useEffect', rowData)
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    const onGridReadyMenuCon = useCallback(async () => {
        try {
            let response = await fetchAllMenuCon();
            //console.log('check data role', response)
            if (response && response.errCode === 0) {
                setRowData(response.menu)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    const onGridReady = useCallback(async () => {
        try {
            //console.log('Sau khi click onGridReady', rowData, buttonThanhToan);
            let response = await fetchAllMenuCha();
            //console.log('check data cha role', response)
            if (response && response.errCode === 0) {
                setRowDataCha(response.menu_cha)
                // console.log('useEffect', rowData)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    useEffect(() => {
        try {
            onGridReadyMenuCon();
            onGridReady();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [onGridReady, onGridReadyMenuCon]);

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
            {/* <div className="users-container"> */}
            <div className='row grid-container'>
                {/* <div className='container container-top'> */}
                {/* <div className='row'> */}
                <div className='col-4' style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    {/* <div className='mx-1 btn-role'> */}
                    {/* <div className="col-md-2 d-flex">
                            <button className='btn btn-primary px-1 button-import me-2'
                                onClick={() => handleNewMenuCha()}
                            ><i className='button-new'>Thêm mới</i></button>
                        </div> */}
                    <div className="row d-flex input-row-phanquyen">
                        <div className="col-md-2 d-flex">
                            <button
                                type="button"
                                className="btn btn-primary px-1 button-import me-2"
                                onClick={handleNewMenuCha}
                            >
                                <i className='button-new'>Thêm mới</i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <ModalNewMenuCha
                            show={showModalNewMenuCha}
                            handleClose={handleClose}
                            onGridReady={onGridReady}
                            socket={socket}
                        />
                    </div>
                    <div>
                        <ModalEditMenuCha
                            show={showModalEditMenuCha}
                            dataEditMenuCha={dataEditMenuCha}
                            handleClose={handleClose}
                            onGridReady={onGridReady}
                            socket={socket}
                        />
                    </div>
                    <div>
                        <ModalXacNhanXoa
                            show={showModalXacNhanXoa}
                            dataXacNhanXoa={dataXacNhanXoa}
                            handleClose={handleClose}
                            onGridReady={onGridReady}
                            socket={socket}
                        />
                    </div>
                    <div style={{ flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                        <div className="ag-theme-alpine" id="myGrid" style={{ flexGrow: 1, width: "100%", minHeight: 0 }}>
                            <AgGridReact
                                rowData={rowDataCha}
                                columnDefs={columnDefs_Cha}
                                defaultColDef={defaultColDef_Cha}
                                pagination={true}
                                paginationPageSize='20'
                            />
                        </div>
                    </div>
                    {/* <div className="ag-theme-alpine" id='myGrid' style={{ height: '78vh', width: '100%' }}
                    >
                        <AgGridReact
                            rowData={rowDataCha}
                            columnDefs={columnDefs_Cha}
                            defaultColDef={defaultColDef_Cha}
                            pagination={true}
                            paginationPageSize='20'
                        />
                    </div> */}
                </div>
                <div className='col-8' style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div className="row d-flex input-row-phanquyen">
                        <div className='col-md-2 d-flex'>
                            <button className='btn btn-primary px-1 button-import me-2'
                                onClick={() => handleNewMenuCon()}
                            ><i className='button-new'>Thêm mới</i></button>
                        </div>
                    </div>
                    <div>
                        <ModalNewMenuCon
                            show={showModalNewMenuCon}
                            handleClose={handleClose}
                            onGridReadyMenuCon={onGridReadyMenuCon}
                            socket={socket}
                        />
                    </div>
                    <div>
                        <ModalXacNhanXoa
                            show={showModalXacNhanXoa}
                            dataXacNhanXoa={dataXacNhanXoa}
                            handleClose={handleClose}
                            onGridReadyMenuCon={onGridReadyMenuCon}
                            socket={socket}
                        />
                    </div>
                    <div>
                        <ModalEditMenuCon
                            show={showModalEditMenuCon}
                            dataEditMenuCon={dataEditMenuCon}
                            handleClose={handleClose}
                            onGridReadyMenuCon={onGridReadyMenuCon}
                            dataNhomQuyen={dataNhomQuyen}
                            dataMenuCha={dataMenuCha}
                            socket={socket}
                        />
                    </div>
                    <div style={{ flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                        <div className="ag-theme-alpine" id="myGrid" style={{ flexGrow: 1, width: "100%", minHeight: 0 }}>
                            <AgGridReact
                                rowData={rowData}
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                pagination={true}
                                paginationPageSize='20'
                            />
                        </div>
                    </div>
                    {/* <div className="ag-theme-alpine" id='myGrid' style={{ height: '78vh', width: '100%' }}
                    >
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            pagination={true}
                            paginationPageSize='20'
                        />
                    </div> */}

                </div>
                {/* </div> */}
                {/* </div > */}
            </div >
        </>
    )
}

export default Menu;