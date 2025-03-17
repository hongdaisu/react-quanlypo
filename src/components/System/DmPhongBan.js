import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import './Grid.css';
import './PhongBan.scss';
import { fetchAllPhongBan, checkXoaPhongBan } from '../../services/phongbanServices';
import { getUrl } from '../../services/urlServices';
import { handleGetAction } from '../../services/actionButtonServices';
import ModalNewPhongBan from './ModalNewPhongBan';
import ModalEditPhongBan from './ModalEditPhongBan';
import { toast } from 'react-toastify';
import io from "socket.io-client";
import ClearableFloatingFilter from './CustomFloatingFilter';
import { Tooltip as ReactTooltip } from "react-tooltip";


const DmPhongBan = () => {
    // const { isSidebarOpen } = useSidebar();
    const [rowData, setRowData] = useState([]);
    const [showModalNewPhongBan, setShowModalNewPhongBan] = useState(false);
    const [showModalEditPhongBan, setShowModalEditPhongBan] = useState(false);
    const [dataEditPhongBan, setDataEditPhongBan] = useState({});
    const [containerStyle] = useState({ height: '10vh', width: '100%' });
    const [gridStyle] = useState({ height: '78vh', width: '100%' });
    const [actionNew, setActionNew] = useState('ADDPHONGBAN');
    const [actionEdit, setActionEdit] = useState('EDITPHONGBAN');
    const [actionDelete, setActionDelete] = useState('DELETEPHONGBAN');
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false);
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState({});
    const [socket, setSocket] = useState(null);
    const [socketEventReceived, setSocketEventReceived] = useState(false);
    const [urlView, setUrlView] = useState('');
    const [urlFetched, setUrlFetched] = useState(false);

    const handleClose = () => {
        setShowModalEditPhongBan(false);
        setShowModalNewPhongBan(false);
        setShowModalXacNhanXoa(false);
    }


    const handleNewPhongBan = async (user) => {
        try {
            let res = await handleGetAction(actionNew);
            //console.log('res', res)
            if (res && res.errCode === 0) {
                setShowModalNewPhongBan(true);
            }
        } catch (error) {
        }
    }

    const handleEditPhongBan = async (phongban) => {
        try {
            let res = await handleGetAction(actionEdit);
            if (res && res.errCode === 0) {
                setShowModalEditPhongBan(true);
                setDataEditPhongBan(phongban.data);
            }
        } catch (error) {

        }
    }

    const handleDeletePhongBan = async (phongban) => {
        // console.log('phongban', phongban.data.id)
        let id = (phongban.data.id)
        try {
            let res = await handleGetAction(actionDelete);
            if (res && res.errCode === 0) {
                let res = await checkXoaPhongBan(id);
                if (res && res.errCode === 0) {
                    const modifiedData = { ...phongban.data, Nhom: 'phongban' };
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
                    <button className='btn-edit' onClick={() => { handleEditPhongBan(params) }} data-tooltip-id="edit"><i className="fas fa-pencil-alt"></i></button>
                    <button className='btn-delete' onClick={() => { handleDeletePhongBan(params) }} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                </div>
        },
        {
            headerName: 'Tên phòng ban', field: 'TenPhongBan', lockPosition: true, width: 400, maxWidth: 400,
            cellRenderer: 'agGroupCellRenderer',
            // floatingFilterComponent: ClearableFloatingFilter,
            // floatingFilterComponentParams: { suppressFilterButton: true }
        },
        {
            headerName: 'Trưởng khoa', field: 'TruongKhoa', width: 300, maxWidth: 300,
            // floatingFilterComponent: ClearableFloatingFilter,
            // floatingFilterComponentParams: { suppressFilterButton: true }
        },
        { headerName: 'Điều dưỡng trưỡng', field: 'DieuDuongTruong', width: 250, maxWidth: 250, },
    ]);


    const [defaultColDef, setdefaultColDef] = useState(
        {
            sortable: true,
            suppressHorizontalScroll: true,
            floatingFilter: true,
            filter: 'agTextColumnFilter',
            floatingFilterComponentParams: {
                suppressFilterButton: true
            },
            floatingFilterComponent: ClearableFloatingFilter,
            suppressMenu: true,
            unSortIcon: true,
            resizable: true,
            minWidth: 500,
            flex: 1
        }
    );

    // useEffect(() => {
    //     console.log('Default column definition:', defaultColDef);
    //     console.log('Column definitions:', columnDefs);

    // }, []);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
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

            return () => {
                newSocket.disconnect();
            };
        }
    }, [urlFetched, urlView]);

    useEffect(() => {
        if (socket && !socketEventReceived) {
            socket.on("phong_ban_edited", (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllPhongBan();
                setSocketEventReceived(true);
            });

            socket.on("phong_ban_new", (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllPhongBan();
                setSocketEventReceived(true);
            });

            socket.on("phong_ban_delete", (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllPhongBan();
                setSocketEventReceived(true);
            });
        }
    }, [socket, socketEventReceived]);

    useEffect(() => {
        return () => {
            setSocketEventReceived(false);
        };
    }, []);

    useEffect(() => {
        if (socketEventReceived) {
            console.log('Socket event received');
        }
    }, [socketEventReceived]);

    useEffect(() => {
        getAllPhongBan()
    }, [])

    const getAllPhongBan = async () => {
        let response = await fetchAllPhongBan();
        if (response && response.errCode === 0) {
            setRowData(response.phongban)
        }
    }

    // useEffect(() => {
    //     ReactTooltip.rebuild();
    // }, [rowData]);

    // useEffect(() => {
    //     console.log("isSidebarOpen pb:", isSidebarOpen);
    // }, [isSidebarOpen]);

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
                        onClick={() => handleNewPhongBan()}
                    ><i className='button-new'>Thêm mới</i></button>
                </div>
                <div>
                    <ModalNewPhongBan
                        show={showModalNewPhongBan}
                        handleClose={handleClose}
                        getAllPhongBan={getAllPhongBan}
                        socket={socket}
                    />
                </div>
                <div>
                    <ModalEditPhongBan
                        show={showModalEditPhongBan}
                        dataEditPhongBan={dataEditPhongBan}
                        handleClose={handleClose}
                        getAllPhongBan={getAllPhongBan}
                        socket={socket}
                    />
                </div>
                <div>
                    <ModalXacNhanXoa
                        show={showModalXacNhanXoa}
                        dataXacNhanXoa={dataXacNhanXoa}
                        handleClose={handleClose}
                        getAllPhongBan={getAllPhongBan}
                        socket={socket}
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
export default DmPhongBan;