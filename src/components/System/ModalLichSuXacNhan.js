import { useEffect, useState, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Grid.css';
import { toast } from 'react-toastify';

const ModalLichSuXacNhan = (props) => {
    const { show, socket, handleClose, dataLichSuXacNhan, handleCloseLichSuXacNhan, onRowClick } = props;
    const [rowData, setRowData] = useState([]);
    const gridApiRef = useRef(null);
    //console.log('dataLichSuXacNhan', dataLichSuXacNhan)

    const handleCloseModal = () => {
        //setIsLoading(false);
        handleCloseLichSuXacNhan();
        //handleClose();
    }

    //console.log('dataLichSuXacNhan.data', dataLichSuXacNhan.data)

    const onGridReady = (params) => {
        gridApiRef.current = params.api; // Lưu gridApi vào gridApiRef
    };

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Khoa phòng kiểm kê',
            field: 'KhoaPhongSuDung',
            width: 300,
            maxWidth: 300,
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal' },
        },
        {
            headerName: 'Năm kiểm kê',
            field: 'NamKiemKe',
            //headerClass: 'header-wrap',
            width: 130,
            maxWidth: 130,
        },
        {
            headerName: 'Lần kiểm kê',
            field: 'LanKiemKe',
            //headerClass: 'header-wrap',
            width: 120,
            maxWidth: 120,
        },
        {
            headerName: 'Khoa quản lý',
            field: 'KhoaQuanLy',
            width: 160,
            maxWidth: 160,
            //headerClass: 'header-wrap',
        },
        {
            headerName: 'Ngày xác nhận',
            field: 'NgayXacNhanKiemKe',
            width: 170,
            maxWidth: 170,
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
            headerName: 'Người kiểm kê',
            field: 'NguoiKiemKe',
            width: 200,
            maxWidth: 200,
        },
        // {
        //     headerName: 'Trạng thái',
        //     field: 'TrangThai',
        //     width: 120,
        //     maxWidth: 120,
        // },
    ]);

    const rowClassRules = {
        // 'row-green': (params) => {
        //     return params.data.TrangThai === 'Đã xác nhận';
        // },
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

    // // cuộn dữ liệu khi quét mã tài sản
    // const onFirstDataRendered = () => {
    //     const KhoTaiSan_Id = sessionStorage.getItem('KhoTaiSan_Id');
    //     if (KhoTaiSan_Id) {
    //         const KhoTaiSan_Id_Int = parseInt(KhoTaiSan_Id, 10);
    //         //const index = rowData.findIndex(row => row.KhoDuoc_Id === KhoTaiSan_Id);
    //         const index = rowData.findIndex(row => parseInt(row.KhoDuoc_Id, 10) === KhoTaiSan_Id_Int);
    //         console.log('index', index)
    //         if (index !== -1 && gridApiRef.current) {
    //             const node = gridApiRef.current.getDisplayedRowAtIndex(index);
    //             gridApiRef.current.ensureNodeVisible(node, 'middle');
    //         }
    //     }
    // };

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
            setRowData(dataLichSuXacNhan.dataxacnhan)
        } else {

        }
    }, [show])
    return (
        <Modal show={show}
            className={'modal-user-container'}
            size='xl'
        >
            <ModalHeader>Lịch sử xác nhận kiểm kê</ModalHeader>
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
                            //onFirstDataRendered={onFirstDataRendered}
                            onRowClicked={(event) => {
                                const rowData = event.data;
                                // if (rowData.XacNhanKiemKe === 1) {
                                //     toast.warning('Đã xác nhận kiểm kê hoàn tất. Không thể chọn')
                                //     return;
                                // }
                                // //console.log('dataLichSuXacNhan.KhoTaiSan_Id:', dataLichSuXacNhan.KhoTaiSan_Id);
                                // //console.log('rowData.KhoDuoc_Id:', rowData.KhoDuoc_Id);
                                // // Kiểm tra điều kiện KhoTaiSan_Id khác với KhoDuoc_Id
                                // if (parseInt(dataLichSuXacNhan.KhoTaiSan_Id, 10) !== parseInt(rowData.KhoDuoc_Id, 10)) {
                                //     toast.warning('Vui lòng chọn đúng phòng ban muốn kiểm kê')
                                //     return;
                                // }
                                if (onRowClick) {
                                    onRowClick(rowData); // Gửi dữ liệu về component cha
                                }
                            }}
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

export default ModalLichSuXacNhan;