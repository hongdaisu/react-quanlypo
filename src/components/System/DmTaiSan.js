import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import ModalXacNhanXoa from './ModalXacNhanXoa';
import './Grid.css';
import './PhongBan.scss';

import { fetchAllTaiSan, checkXoaTaiSan } from '../../services/importService';
import { getUrl } from '../../services/urlServices';
import { handleGetAction } from '../../services/actionButtonServices';
import ModalEditTs from './ModalEditTs';
import ModalNewTS from './ModalNewTS';
import { toast } from 'react-toastify';
import io from "socket.io-client";
import ClearableFloatingFilter from './CustomFloatingFilter';
import { Tooltip as ReactTooltip } from "react-tooltip";


const Dm_TaiSan = () => {
    // const { isSidebarOpen } = useSidebar();
    const [rowData, setRowData] = useState([]);
    const [showModalEditTS, setShowModalEditTS] = useState(false);
    const [showModalNewTS, setShowModalNewTS] = useState(false);
    const [dataEditTS, setDataEditTS] = useState({});

    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false);
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState({});

    const [containerStyle] = useState({ height: '10vh', width: '100%' });
    const [gridStyle] = useState({ height: '78vh', width: '100%' });

    const [actionNew, setActionNew] = useState('NEWTS');
    const [actionEdit, setActionEdit] = useState('EDITTS');
    const [actionDelete, setActionDelete] = useState('DELETETS');
    const [socket, setSocket] = useState(null);
    const [socketEventReceived, setSocketEventReceived] = useState(false);
    const [urlView, setUrlView] = useState('');
    const [urlFetched, setUrlFetched] = useState(false);

    //console.log('rowData', rowData)

    const handleClose = () => {
        setShowModalEditTS(false);
        setShowModalNewTS(false);
        setShowModalXacNhanXoa(false);
    }

    const handleCloseXoaTS = () => {
        setShowModalXacNhanXoa(false);
    }

    const handleNewTS = async (user) => {
        try {
            let res = await handleGetAction(actionNew);
            if (res && res.errCode === 0) {
                setShowModalNewTS(true);
            }
        } catch (error) {
        }
    }


    const handleEditTS = async (data) => {
        //let User_Id = user.data.User_Id
        try {
            let res = await handleGetAction(actionEdit);
            //console.log('res.data.data', data.data)
            if (res && res.errCode === 0) {
                setShowModalEditTS(true);
                setDataEditTS(data.data);
            }
        } catch (error) {
        }
    }

    const handleDeleteTS = async (data) => {
        let Duoc_Id = (data.data.Duoc_Id)
        try {
            let res = await handleGetAction(actionDelete);
            if (res && res.errCode === 0) {
                //console.log('data', data)
                let res = await checkXoaTaiSan(Duoc_Id);
                if (res && res.errCode === 0) {
                    const modifiedData = { ...data.data, Nhom: 'xoats' };
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
                    <button className='btn-edit' onClick={() => { handleEditTS(params) }} data-tooltip-id="edit"><i className="fas fa-pencil-alt"></i></button>
                    <button className='btn-delete' onClick={() => { handleDeleteTS(params) }} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                </div>
        },
        {
            headerName: 'STT',
            field: 'STT',
            pinned: 'left',
            width: 80,
            maxWidth: 80,
        },
        {
            headerName: 'Mã tài sản',
            field: 'MaTaiSan',
            pinned: 'left',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'ID',
            field: 'Duoc_Id',
            width: 80,
            maxWidth: 80,
        },
        {
            headerName: 'Mã tài sản New',
            headerClass: 'header-wrap',
            field: 'MaTaiSanNew',
            //pinned: 'left',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Tên tài sản',
            field: 'TenHang',
            width: 190,
            maxWidth: 190,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'ĐVT',
            field: 'TenDonViTinh',
            width: 100,
            maxWidth: 100,
        },
        {
            headerName: 'Model',
            field: 'Model',
            width: 140,
            maxWidth: 140,
        },
        {
            headerName: 'Serial',
            field: 'Serial',
            width: 140,
            maxWidth: 140,
        },
        {
            headerName: 'Phân Loại',
            field: 'PhanLoai',
            width: 170,
            maxWidth: 170,
        },
        {
            headerName: 'Thời gian mua',
            field: 'ThoiGianMua',
            headerClass: 'header-wrap',
            width: 110,
            maxWidth: 110,
            valueFormatter: (params) => {
                // params.value là giá trị của ô
                if (params.value === null) {
                    return ''; // Trả về chuỗi rỗng nếu NgayCongVan là null
                }

                const date = new Date(params.value);
                const formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                return formattedDate;
            },
        },
        {
            headerName: 'Thời gian tính khấu hao',
            field: 'ThoiGianTinhKhauHao',
            headerClass: 'header-wrap',
            width: 110,
            maxWidth: 110,
            valueFormatter: (params) => {
                // params.value là giá trị của ô
                if (params.value === null) {
                    return ''; // Trả về chuỗi rỗng nếu NgayCongVan là null
                }

                const date = new Date(params.value);
                const formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                return formattedDate;
            },
        },
        {
            headerName: 'Thời gian khấu hao',
            field: 'ThoiGianKhauHao',
            width: 110,
            maxWidth: 110,
            headerClass: 'header-wrap',
        },
        {
            headerName: 'Thời gian bảo hành',
            field: 'ThoiGianBaoHanh',
            width: 110,
            maxWidth: 110,
            headerClass: 'header-wrap',
        },
        {
            headerName: 'Bệnh viện',
            field: 'TenBenhVien',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Hãng sản xuất',
            headerClass: 'header-wrap',
            field: 'HangSanXuat',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Book',
            field: 'Book',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Account',
            field: 'Account',
            width: 110,
            maxWidth: 110,
        },
        {
            headerName: 'SubAccount',
            field: 'SubAccount',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'BudgetOwner',
            field: 'BudgetOwner',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Budget',
            field: 'Budget',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Invoice',
            field: 'Invoice',
            width: 170,
            maxWidth: 170,
        },
        {
            headerName: 'Categories',
            field: 'Categories',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Loai',
            field: 'Loai',
            width: 170,
            maxWidth: 170,
        },
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
                getAllTaiSan();
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
        getAllTaiSan()
    }, [])

    const getAllTaiSan = async () => {
        let response = await fetchAllTaiSan();
        if (response && response.errCode === 0) {
            setRowData(response.data)
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
                <div className="ag-theme-alpine container" id='myGrid' style={gridStyle}>
                    <div className=' btn-new-add'>
                        <button className='btn btn-primary px-1 full-button'
                            onClick={() => handleNewTS()}
                        ><i className='button-new'>Thêm mới</i></button>
                    </div>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize='20'
                    />
                </div>
                {/* </div> */}
                <div>
                    <ModalEditTs
                        show={showModalEditTS}
                        dataEditTS={dataEditTS}
                        handleClose={handleClose}
                        getAllTaiSan={getAllTaiSan}
                        socket={socket}
                    />
                </div>
                <div>
                    <ModalNewTS
                        show={showModalNewTS}
                        handleClose={handleClose}
                        getAllTaiSan={getAllTaiSan}
                        socket={socket}
                    />
                </div>
                <div>
                    <ModalXacNhanXoa
                        show={showModalXacNhanXoa}
                        dataXacNhanXoa={dataXacNhanXoa}
                        handleCloseXoaTS={handleCloseXoaTS}
                        handleClose={handleClose}
                        onGridReady={getAllTaiSan}
                        socket={socket}
                    />
                </div>
            </div>
        </>
    )
}
export default Dm_TaiSan;