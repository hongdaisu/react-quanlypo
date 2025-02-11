// import { useState, useEffect } from 'react';
import React, { StrictMode, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import './Grid.css';
import './PdfView.scss';
import './PO.scss';
import { toast } from 'react-toastify';
import io from "socket.io-client";
import { getUrl } from '../../services/urlServices';
import { Tooltip as ReactTooltip } from "react-tooltip";
import ClearableFloatingFilter from './CustomFloatingFilter';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import { handleGetAction } from '../../services/actionButtonServices';
import { set } from "lodash";
import * as XLSX from 'xlsx';
import { checkChungTuHopDong } from '../../services/importService'
import ModalXacNhanXoa from './ModalXacNhanXoa';

const ModalLogCTHD = (props) => {
    const { show, handleClose, rowDataLog, onFetchAllCT } = props;
    const [rowData, setRowData] = useState([]);
    const [socket, setSocket] = useState(null);
    const [socketEventReceived, setSocketEventReceived] = useState(false);
    const [urlView, setUrlView] = useState('');
    const [urlFetched, setUrlFetched] = useState(false);
    const Ky = parseInt(Cookies.get('ky'), 10);
    const UserId = Cookies.get('id');
    const tenuser = Cookies.get('firstName');
    const PhongBanId = Cookies.get('phongban_id');
    const NhomQuyen = Cookies.get('ma_groupId');
    const [showModalXacNhanXoa, setShowModalXacNhanXoa] = useState(false)
    const [dataXacNhanXoa, setDataXacNhanXoa] = useState([]);

    const [actionCheckLogCTHD, setActionChekLogCTHD] = useState('XOALOGCTHD');

    // const handleClose = () => {
    //     setShowModalLog(false);
    // }

    const handleCloseXoaChungTuHopDong = () => {
        setShowModalXacNhanXoa(false);
    }

    const handleXoaLogCTHD = async (data) => {
        let machungtu = (data.data.machungtu)
        let sopo = (data.data.sopo)
        try {
            let res_action = await handleGetAction(actionCheckLogCTHD);
            if (res_action && res_action.errCode === 0) {
                let checkchungtu = await checkChungTuHopDong(machungtu);
                if (checkchungtu && checkchungtu.errCode === 0) {
                    const modifiedData = { machungtu: machungtu, sopo: sopo, Nhom: 'xoacthd' };
                    setDataXacNhanXoa(modifiedData);
                    setShowModalXacNhanXoa(true);
                } else {
                    toast.warning(checkchungtu.errMessage)
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Action',
            field: '',
            pinned: 'left',
            width: 70,
            maxWidth: 70,
            lockPosition: true,
            filter: false,
            unSortIcon: false,
            cellRenderer: (params) => {
                if (params.data) {
                    return (
                        <div className="btn-action-modal">
                            <button className='btn-delete' onClick={() => handleXoaLogCTHD(params)} data-tooltip-id="delete"><i className="fas fa-trash"></i></button>
                        </div>
                    );
                }
                return null;
            }
        },
        {
            headerName: 'Mã chứng từ',
            field: 'machungtu',
            width: 150,
            maxWidth: 150,
            pinned: 'left',
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Mã tài sản',
            field: 'mataisan',
            width: 120,
            maxWidth: 120,
        },
        {
            headerName: 'Tên tài sản',
            field: 'tentaisan',
            width: 240,
            maxWidth: 240,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'SL',
            field: 'soluongnhap',
            width: 80,
            maxWidth: 80,
        },
        {
            headerName: 'Đơn giá',
            field: 'dongianhap',
            width: 100,
            maxWidth: 100,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'VAT',
            field: 'vatnhap',
            headerClass: 'header-wrap',
            width: 80,
            maxWidth: 80,
        },
        {
            headerName: 'Đơn giá vat',
            field: 'dongianhapvat',
            headerClass: 'header-wrap',
            width: 100,
            maxWidth: 100,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Ngày HĐ',
            field: 'ngayhieuluc',
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
            cellStyle: { backgroundColor: '#d9faf8' },
        },
        {
            headerName: 'Đơn giá HĐ',
            field: 'dongiahd',
            headerClass: 'header-wrap',
            width: 100,
            maxWidth: 100,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: { backgroundColor: '#d9faf8' },
        },
        {
            headerName: 'VAT HĐ',
            field: 'vathd',
            headerClass: 'header-wrap',
            width: 80,
            maxWidth: 80,
            cellStyle: { backgroundColor: '#d9faf8' },
        },
        {
            headerName: 'Đơn giá vat HĐ',
            field: 'dongiahdvat',
            headerClass: 'header-wrap',
            width: 100,
            maxWidth: 100,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: { backgroundColor: '#d9faf8' },
        },
        {
            headerName: 'Chênh lệch giá HĐ',
            field: 'dongianhap_check',
            headerClass: 'header-wrap',
            width: 110,
            maxWidth: 110,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                const value = params.value;
                if (value === null || value === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (value > 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (value <= 0) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Chênh lệch giá vat HĐ',
            field: 'dongianhapvat_check',
            headerClass: 'header-wrap',
            width: 110,
            maxWidth: 110,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                const value = params.value;
                if (value === null || value === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (value > 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (value <= 0) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Check hiệu lực',
            field: 'hieuluc_check',
            headerClass: 'header-wrap',
            width: 130,
            maxWidth: 130,
            cellStyle: params => {
                const value = params.value;
                if (value === null || value === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (value === 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (value === 1) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            },
            valueFormatter: params => {
                const value = params.value;
                if (value === 1) {
                    return 'Còn hiệu lực';
                } else if (value === 0) {
                    return 'Hết hiệu lực';
                }
                return '';
            }
        },
        {
            headerName: 'Thành tiền',
            field: 'thanhtiennhap',
            width: 120,
            maxWidth: 120,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Thành tiền vat',
            field: 'thanhtiennhapvat',
            headerClass: 'header-wrap',
            width: 120,
            maxWidth: 120,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Ngày chứng từ',
            field: 'ngaychungtu',
            width: 140,
            maxWidth: 140,
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
            headerName: 'Kho nhập',
            field: 'khonhap',
            width: 200,
            maxWidth: 200,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Người nhập',
            field: 'nguoinhap',
            width: 200,
            maxWidth: 200,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Nhà cung cấp',
            field: 'tennhacungcap',
            width: 200,
            maxWidth: 200,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Người kiểm tra',
            field: 'nguoikiemtra',
            width: 200,
            maxWidth: 200,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Ngày kiểm tra',
            field: 'ngaykiemtra',
            width: 140,
            maxWidth: 140,
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
    ]);
    const rowClassRules = {
        'row-pink': (params) => {
            return params.data.id_data_hd === 0;
        },
    };
    const gridOptions = {
        rowClassRules: rowClassRules,
    };


    const [defaultColDef] = useState({
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
        flex: 1,
    });

    const [gridStyle] = useState({ height: '78vh', width: '100%' });


    useEffect(() => {
        try {
            const fetchUrlView = async () => {
                try {
                    let res = await getUrl();
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

    useEffect(() => {
        if (socket && !socketEventReceived) {

            // socket.on("hd_new_client", (data) => {
            //     setLoadAllHD(true);
            //     //onFetchAllPR();
            //     setSocketEventReceived(true);
            // });

            // socket.on("getchungtu_client", (data) => {
            //     setLoadOneHD(true)
            //     //onFetchOnePR();
            //     setSocketEventReceived(true);
            // });

            // socket.on("edit_mataisan_client", (data) => {
            //     setLoadAllHD(true);
            //     setSocketEventReceived(true);
            // });
        }
    }, [socket, socketEventReceived]);

    useEffect(() => {
        if (show) {
            setRowData([...rowDataLog]);
        }
    }, [show, rowDataLog])
    return (
        <>
            <Modal show={show}
                className={'modal-congvan-container'}
                size='xl'
            >
                <ModalHeader>Log check chứng từ và HĐ</ModalHeader>
                <ModalBody>
                    <div className='row grid-container'>
                        <div className="ag-theme-alpine container" id='myGrid' style={gridStyle}>
                            <AgGridReact
                                rowData={rowData}
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                gridOptions={gridOptions}
                                pagination={true}
                                paginationPageSize='20'
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="primary" onClick={() => handleSaveEditCongVanDi()} className='btn btn-primary px-2'>
                    <i className='button-save'>Save</i></Button> */}
                    <Button onClick={handleClose} className='px-2 closebtn'>
                        <i className='button-save'>Close</i></Button>
                </ModalFooter>
            </Modal>
            <div>
                <ModalXacNhanXoa
                    show={showModalXacNhanXoa}
                    dataXacNhanXoa={dataXacNhanXoa}
                    handleClose={handleClose}
                    onGridReady={onFetchAllCT}
                    handleCloseXoaChungTuHopDong={handleCloseXoaChungTuHopDong}
                    socket={socket}
                />
            </div>
        </>
    )
};

export default ModalLogCTHD;