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
import { checkChungTuPO } from '../../services/importService'
import ModalXacNhanXoa from './ModalXacNhanXoa';

const ModalCheckChungTu = (props) => {
    const { show, handleClose, rowDataLogCheck } = props;
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

    // const handleClose = () => {
    //     setShowModalLog(false);
    // }



    const [columnDefs, setColumnDefs] = useState([
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
            headerName: 'Mã TS',
            field: 'mataisan',
            width: 100,
            maxWidth: 100,
            editable: true,
            pinned: 'left',
        },
        {
            headerName: 'Tên tài sản',
            field: 'tentaisan',
            width: 250,
            maxWidth: 250,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'ĐVT',
            field: 'donvitinh',
            width: 85,
            maxWidth: 85,
        },
        {
            headerName: 'SL',
            field: 'soluongct',
            width: 80,
            maxWidth: 80,
        },
        {
            headerName: 'Đơn giá',
            field: 'dongiact',
            width: 110,
            maxWidth: 110,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Thành tiền',
            headerClass: 'header-wrap',
            field: 'thanhtiennhap',
            width: 110,
            maxWidth: 110,
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
            width: 80,
            maxWidth: 80,
        },
        {
            headerName: 'Đơn giá vat',
            headerClass: 'header-wrap',
            field: 'dongianhapvat',
            width: 110,
            maxWidth: 110,
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
            headerClass: 'header-wrap',
            field: 'thanhtiennhapvat',
            width: 110,
            maxWidth: 110,
            editable: true,
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
        },
        {
            headerName: 'Chênh lệch SL PO',
            field: 'soluongnhap',
            width: 100,
            maxWidth: 100,
            headerClass: 'header-wrap',
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
            headerName: 'Check SL PO Lần 2',
            field: 'soluongnhapcheck',
            width: 110,
            maxWidth: 110,
            headerClass: 'header-wrap',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                //const value = params.value;
                const checkValue = params.data.check_soluongnhap;
                if (checkValue === null || checkValue === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (checkValue === 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (checkValue === 1) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Chênh lệch giá PO',
            field: 'dongianhap',
            width: 100,
            maxWidth: 100,
            headerClass: 'header-wrap',
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
                } else if (value === 0) {
                    return { backgroundColor: 'green', color: 'white' };
                } else if (value < 0) {
                    return { backgroundColor: 'red', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Check giá PO Lần 2',
            field: 'dongianhapcheck',
            width: 110,
            maxWidth: 110,
            headerClass: 'header-wrap',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                //const value = params.value;
                const checkValue = params.data.check_dongianhap;
                if (checkValue === null || checkValue === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (checkValue === 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (checkValue === 1) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Chênh lệch giá Vat PO',
            field: 'dongiavatnhap',
            width: 100,
            maxWidth: 100,
            headerClass: 'header-wrap',
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
                } else if (value === 0) {
                    return { backgroundColor: 'green', color: 'white' };
                } else if (value < 0) {
                    return { backgroundColor: 'red', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Check giá Vat PO Lần 2',
            field: 'dongiavatnhapcheck',
            width: 110,
            maxWidth: 110,
            headerClass: 'header-wrap',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                //const value = params.value;
                const checkValue = params.data.check_dongianhapvat;
                if (checkValue === null || checkValue === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (checkValue === 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (checkValue === 1) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Chênh lệch giá HĐ',
            field: 'dongiahd_check',
            headerClass: 'header-wrap',
            width: 100,
            maxWidth: 100,
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
            headerName: 'Check giá HĐ Lần 2',
            field: 'dongiahdcheck',
            width: 110,
            maxWidth: 110,
            headerClass: 'header-wrap',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                //const value = params.value;
                const checkValue = params.data.check_dongianhap;
                if (checkValue === null || checkValue === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (checkValue === 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (checkValue === 1) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Chênh lệch giá vat HĐ',
            field: 'dongiavathd_check',
            headerClass: 'header-wrap',
            width: 100,
            maxWidth: 100,
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
            headerName: 'Check giá vat HĐ Lần 2',
            field: 'dongiavahdcheck',
            width: 110,
            maxWidth: 110,
            headerClass: 'header-wrap',
            valueFormatter: (params) => {
                if (params.value) {
                    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(params.value);
                }
                return params.value;
            },
            cellStyle: params => {
                //const value = params.value;
                const checkValue = params.data.check_dongianhapvat;
                if (checkValue === null || checkValue === undefined) {
                    return { backgroundColor: 'white', color: 'white' };
                } else if (checkValue === 0) {
                    return { backgroundColor: 'red', color: 'white' };
                } else if (checkValue === 1) {
                    return { backgroundColor: 'green', color: 'white' };
                }
                return {};
            }
        },
        {
            headerName: 'Check hiệu lực HĐ',
            field: 'hieuluc_check',
            headerClass: 'header-wrap',
            width: 110,
            maxWidth: 110,
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
            headerName: 'Ngày PO',
            field: 'ngaypo',
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
            headerName: 'Số PO',
            field: 'sopo',
            width: 150,
            maxWidth: 150,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Số PR',
            field: 'sopr',
            width: 150,
            maxWidth: 150,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'RN/Công văn',
            field: 'rn',
            width: 160,
            maxWidth: 160,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Số HĐ',
            field: 'sohopdong',
            width: 160,
            maxWidth: 160,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Ngày hiệu lực HĐ',
            headerClass: 'header-wrap',
            field: 'ngayhopdong',
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
            headerName: 'Ngày kết thúc HĐ',
            headerClass: 'header-wrap',
            field: 'ngayketthuc',
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
            width: 220,
            maxWidth: 220,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Ngày đồng bộ',
            field: 'ngaytao',
            width: 150,
            maxWidth: 150,
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
            return params.data.checkmataisan === 1;
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
        }
    }, [socket, socketEventReceived]);

    useEffect(() => {
        if (show) {
            setRowData([...rowDataLogCheck]);
        }
    }, [show, rowDataLogCheck])
    return (
        <>
            <Modal show={show}
                className={'modal-congvan-container'}
                size='xl'
            >
                <ModalHeader>Log Kiểm Tra</ModalHeader>
                <ModalBody>
                    <div className='row grid-container-modal'>
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
        </>
    )
};

export default ModalCheckChungTu;