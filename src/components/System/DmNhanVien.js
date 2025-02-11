import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import './Grid.css';
import './PhongBan.scss';
import { fetchAllNhanVien, checkXoaNhanVien } from '../../services/nhanvienServices';
import { handleGetAction } from '../../services/actionButtonServices';
import ModalNewNhanVien from './ModalNewNhanVien';
import ModalEditNhanVien from './ModalEditNhanVien';
import { getUrl } from '../../services/urlServices';
import { toast } from 'react-toastify';
import io from "socket.io-client";
import ClearableFloatingFilter from './CustomFloatingFilter';
import { Tooltip as ReactTooltip } from "react-tooltip";

const DmNhanVien = () => {

    const [rowData, setRowData] = useState([]);
    const [showModalNewNhanVien, setShowModalNewNhanVien] = useState(false);
    const [showModalEditNhanVien, setShowModalEditNhanVien] = useState(false);
    const [dataEditNhanVien, setDataEditNhanVien] = useState({});
    const [containerStyle] = useState({ height: '10vh', width: '100%' });
    const [gridStyle] = useState({ height: '78vh', width: '100%' });
    const [actionNew, setActionNew] = useState('ADDNHANVIEN');
    const [actionEdit, setActionEdit] = useState('EDITNHANVIEN');
    const [actionDelete, setActionDelete] = useState('DELETENHANVIEN');
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false);
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState({});
    const [socket, setSocket] = useState(null);
    const [socketEventReceived, setSocketEventReceived] = useState(false);
    const [urlView, setUrlView] = useState('');
    const [urlFetched, setUrlFetched] = useState(false);


    const handleClose = () => {
        setShowModalNewNhanVien(false);
        setShowModalEditNhanVien(false);
        setShowModalXacNhanXoa(false);
    }

    const handleNewNhanVien = async (user) => {
        try {
            let res = await handleGetAction(actionNew);
            if (res && res.errCode === 0) {
                setShowModalNewNhanVien(true);
            }
        } catch (error) {
        }
    }

    const handleEditNhanVien = async (nhanvien) => {
        try {
            let res = await handleGetAction(actionEdit);
            if (res && res.errCode === 0) {
                setShowModalEditNhanVien(true);
                setDataEditNhanVien(nhanvien.data);
            }
        } catch (error) {
        }
    }

    const handleDeleteNhanVien = async (nhanvien) => {
        let id = (nhanvien.data.id)
        try {
            let res = await handleGetAction(actionDelete);
            if (res && res.errCode === 0) {
                let res = await checkXoaNhanVien(id);
                if (res && res.errCode === 0) {
                    const modifiedData = { ...nhanvien.data, Nhom: 'nhanvien' };
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
                    <button className='btn-edit' onClick={() => { handleEditNhanVien(params) }} data-tooltip-id="edit"><i className="fas fa-pencil-alt"></i></button>
                    <button className='btn-delete' onClick={() => { handleDeleteNhanVien(params) }} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                </div>
        },
        {
            headerName: 'Tên nhân viên', field: 'TenNhanVien', lockPosition: true, width: 250, maxWidth: 250,
            cellRenderer: 'agGroupCellRenderer'
        },
        { headerName: 'Email', field: 'Email', width: 250, maxWidth: 250 },
        { headerName: 'Phòng ban', field: 'TenPhongBan', width: 300, maxWidth: 300 },
        { headerName: 'Trạng thái', field: 'TrangThai', width: 150, maxWidth: 150 },
        { headerName: 'Nhận công văn', field: 'CheckGui', width: 150, maxWidth: 150 },
        { headerName: 'Mapping', field: 'NhanVien_Mapping', width: 150, maxWidth: 150 },
        // { headerName: 'Duyệt công văn', field: 'DuyetCongVan' },
        // { headerName: 'STT', field: 'STT' },
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
            socket.on("nhanvien_edited", (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllNhanVien();
                setSocketEventReceived(true);
            });

            socket.on("nhanvien_new", (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllNhanVien();
                setSocketEventReceived(true);
            });

            socket.on("nhanvien_delete", (data) => {
                // console.log("Phòng ban đã được sửa đổi:", data);
                getAllNhanVien();
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
        getAllNhanVien()
    }, [])

    const getAllNhanVien = async () => {
        let response = await fetchAllNhanVien();
        if (response && response.errCode === 0) {
            setRowData(response.nhanvien)
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
                <div className=' btn-new'>
                    <button className='btn btn-primary px-1 full-button'
                        onClick={() => handleNewNhanVien()}
                    ><i className='button-new'>Thêm mới</i></button>
                </div>
                <div>
                    <ModalNewNhanVien
                        show={showModalNewNhanVien}
                        handleClose={handleClose}
                        getAllNhanVien={getAllNhanVien}
                        socket={socket}
                    />
                </div>
                <div>
                    <ModalEditNhanVien
                        show={showModalEditNhanVien}
                        dataEditNhanVien={dataEditNhanVien}
                        handleClose={handleClose}
                        getAllNhanVien={getAllNhanVien}
                        socket={socket}
                    />
                </div>
                <div>
                    <ModalXacNhanXoa
                        show={showModalXacNhanXoa}
                        dataXacNhanXoa={dataXacNhanXoa}
                        handleClose={handleClose}
                        getAllNhanVien={getAllNhanVien}
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
export default DmNhanVien;