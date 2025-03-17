import { useEffect, useState, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Grid.css';
import { toast } from 'react-toastify';

const ModalCheckDongBo = (props) => {
    const { show, socket, handleClose, dataCheckDongBo, handleCloseCheckDongBo } = props;
    const [rowData, setRowData] = useState([]);
    const gridApiRef = useRef(null);
    //console.log('dataCheckDongBo', dataCheckDongBo.LanKiemKe)

    const handleCloseModal = () => {
        //setIsLoading(false);
        handleCloseCheckDongBo();
        //handleClose();
    }

    //console.log('dataCheckDongBo.data', dataCheckDongBo.data)

    const onGridReady = (params) => {
        gridApiRef.current = params.api; // Lưu gridApi vào gridApiRef
    };

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Khoa phòng kiểm kê',
            field: 'KhoaPhongSuDung',
            width: 400,
            maxWidth: 400,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Lần kiểm kê',
            field: 'LanKiemKe',
            //headerClass: 'header-wrap',
            width: 150,
            maxWidth: 150,
        },
        {
            headerName: 'Khoa quản lý',
            field: 'KhoaQuanLy',
            width: 150,
            maxWidth: 150,
            //headerClass: 'header-wrap',
        },
        {
            headerName: 'Trạng thái',
            field: 'TrangThai',
            width: 200,
            maxWidth: 200,
        },
        {
            headerName: 'Xác nhận kiểm kê',
            field: 'XacNhanKiemKe',
            width: 200,
            maxWidth: 200,
            valueFormatter: (params) => {
                const value = params.value;
                if (value === 1) {
                    return 'Đã xác nhận';
                } else if (value === null || value === undefined) {
                    return 'Chưa xác nhận';
                } else if (value === 0) {
                    return '';
                }
                return value; // Trường hợp khác, trả về giá trị gốc.
            },
        },
    ]);

    const rowClassRules = {
        'row-green': (params) => {
            return params.data.DaDongBo === 1;
        },
    };

    const gridOptions = {
        rowClassRules: rowClassRules,
    }

    const [defaultColDef, setdefaultColDef] = useState(
        {
            sortable: true,
            suppressHorizontalScroll: true,
            floatingFilter: true,
            filter: 'agTextColumnFilter',
            floatingFilterComponentParams: { suppressFilterButton: true },
            //floatingFilterComponent: ClearableFloatingFilter,
            suppressMenu: true,
            unSortIcon: true,
            resizable: true,
            minWidth: 500,
            flex: 1
        }
    );

    useEffect(() => {
        if (socket) {

        }
        return () => {
            if (socket) {
                socket.off('huyxacnhan_kiemke_client');
            }
        };
    }, [socket]);

    useEffect(() => {
        if (show) {
            setRowData(dataCheckDongBo.data)
        } else {

        }
    }, [show])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='xl'
        >
            <ModalHeader>Tình trạng đồng bộ</ModalHeader>
            <ModalBody>
                <div className='row grid-container-modal'>
                    <div className="ag-theme-alpine" id='myGrid' style={{ height: '78vh', width: '100%' }}
                    >
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady}
                            pagination={true}
                            paginationPageSize='1000'
                            gridOptions={gridOptions}
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={handleCloseModal} className='px-2 closebtn'>
                    <i className='button-save'>Close</i></Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalCheckDongBo;