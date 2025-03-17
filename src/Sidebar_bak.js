
import { React, useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined, SolutionOutlined, CaretRightOutlined, CaretDownOutlined, BarsOutlined, LeftOutlined, DownOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { getGroup_Id, getMaGroup, getMenu } from './services/sideBarServices';
import './Sidebar.scss';
import { set } from 'lodash';

// const Sidebar = (props) => {
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [active, setActive] = useState(1);
    const [isDropdownOpenDanhMuc, setDropdownOpenDanhMuc] = useState(false);
    const [isDropdownOpenYeuCau, setDropdownOpenYeuCau] = useState(false);

    const [isGroupId, setIsGroupId] = useState('');
    const [isLoadingGroupId, setIsLoadingGroupId] = useState(true);

    const [maGroup, setMaGroup] = useState('');

    const user = useSelector(state => state.user.account);
    const ma_groupId = useSelector(state => state.user.account.ma_groupId);
    const Group_Id = useSelector(state => state.user.account.use_groupId);
    const NhomQuyen = Cookies.get('ma_groupId');
    const [isInGroupAD, setIsInGroupAD] = useState(false);
    const [isInGroupUser, setIsInGroupUser] = useState(false);
    const [menu, setMenu] = useState(['']);


    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await getGroup_Id(Group_Id);
                //console.log('response', response.menu)
                if (response && response.errCode === 0 && response.groupid) {
                    let data_menu_con = response.menu_con;
                    let data_menu_cha = response.menu_cha;
                    const menuChaMap = data_menu_cha.reduce((acc, { id, tenmenu_cha }) => {
                        acc[id] = tenmenu_cha;
                        return acc;
                    }, {});
                    console.log('menuChaMap', menuChaMap)
                    // Tạo danh sách các menu cha duy nhất
                    const menuCha = [...new Set(data_menu_con.map(item => item.menu_cha_id))].map(id => ({
                        id,
                        tenmenu_cha: menuChaMap[id] || 'Không xác định'
                    }));
                    console.log('menuCha', menuCha)

                    // Nhóm các menu con theo menu cha
                    const menuConGrouped = data_menu_con.reduce((acc, item) => {
                        if (!acc[item.menu_cha_id]) {
                            acc[item.menu_cha_id] = [];
                        }
                        acc[item.menu_cha_id].push(item);
                        return acc;
                    }, {});
                    console.log('menuConGrouped', menuConGrouped)

                    setMenu(data_menu_con);
                    setMaGroup(response.groupid.MaGroup);
                    setIsLoadingGroupId(false);
                } else {
                    console.error('Invalid response or missing groupid');
                }
            } catch (error) {
                console.error('Error fetching group ID:', error);
            }
        };

        fetchData();
    }, [Group_Id]);


    useEffect(() => {
        const fetchMaGroup = async () => {
            try {
                let response = await getMaGroup();
                if (response && response.errCode === 0) {
                    //console.log('magroup', response.magroup)
                    const AD = response.magroup.some(group => group.MaGroup === NhomQuyen && group.Group === 'Admin');
                    const USER = response.magroup.some(group => group.MaGroup === NhomQuyen && group.Group !== 'Admin');
                    setIsInGroupAD(AD);
                    setIsInGroupUser(USER);
                    //console.log('isInGroup', isInGroupAD, isInGroup)
                } else {
                    console.error('Invalid response or missing groupid');
                }
            } catch (error) {
                console.error('Error fetching group ID:', error);
            }
        };

        fetchMaGroup();
    }, [NhomQuyen]);

    useEffect(() => {
        // // console.log('isLoadingGroupId', isLoadingGroupId);  setDropdownOpenDanhMuc(false);
        // console.log('maGroup', isInGroupAD, isInGroup);
        // if (!isLoadingGroupId) { // Kiểm tra nếu đã hoàn thành fetchGroup_Id chưa
        //     if (maGroup === 'AD') {
        //         setDropdownOpenYeuCau(true);
        //         setDropdownOpenDanhMuc(false);
        //     } else if (maGroup === 'TN' || maGroup === 'KTTH' || maGroup === 'TP' || maGroup === 'LD') {
        //         setDropdownOpenYeuCau(true);
        //         setDropdownOpenDanhMuc(false);
        //     }
        // }
        if (!isLoadingGroupId) { // Kiểm tra nếu đã hoàn thành fetchGroup_Id chưa
            if (isInGroupAD === true) {
                setDropdownOpenYeuCau(true);
                setDropdownOpenDanhMuc(false);
            } else if (isInGroupUser === true) {
                setDropdownOpenYeuCau(true);
                setDropdownOpenDanhMuc(false);
            }
        }
    }, [isLoadingGroupId, maGroup]);

    const handleDropdownToggleDanhMuc = () => {
        // Kiểm tra nếu sidebar đang được mở rộng, thì đóng nó và không mở dropdown
        if (isSidebarOpen) {
            setIsSidebarOpen(true);
            setDropdownOpenYeuCau(false);
            setDropdownOpenDanhMuc(true);
        } else {

            setIsSidebarOpen(true);
            setDropdownOpenYeuCau(false);
            setDropdownOpenDanhMuc(true);
        }
    };

    const handleDropdownToggleYeuCau = () => {
        // Kiểm tra nếu sidebar đang được mở rộng, thì đóng nó và không mở dropdown
        //console.log('handleDropdownToggleYeuCau')
        if (isSidebarOpen) {
            setIsSidebarOpen(true);
            setDropdownOpenDanhMuc(false);
            setDropdownOpenYeuCau(true);
        } else {
            // Nếu sidebar đang được thu gọn, thì mở rộng nó và không mở dropdown
            setIsSidebarOpen(true);
            setDropdownOpenDanhMuc(false);
            setDropdownOpenYeuCau(true);
        }
    };

    return (
        <>{user && user.auth === true &&
            // <div className='sidebar d-flex justify-content-between flex-column bg-dark text-white py-3 ps-1 pe-4 vh-100'>
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'} d-flex justify-content-between flex-column bg-dark text-white py-3 ps-1 pe-4 vh-100`}>
                <div>
                    {/* <div className='image-container'> */}
                    <div className={`image-container ${isSidebarOpen ? 'open' : 'closed'}`}>
                        <img src='/logohmdnnew.png' alt='description' className='full-width-image' />
                        <hr className='text-white mt-2'></hr>
                    </div>
                    <div className="sidebar">
                        <ul className='nav nav-pills flex-column mt-1 text-white'>
                            <div className="sidebar-item" onClick={handleDropdownToggleYeuCau}>
                                <a className="nav-link p-2 text-white d-flex align-items-center">
                                    <i className={`align-items-center ${(isDropdownOpenYeuCau && isSidebarOpen) ? 'active' : ''} me-3 fs-6 d-flex`}><SolutionOutlined /></i>
                                    <span className={`align-items-center ${(isDropdownOpenYeuCau && isSidebarOpen) ? 'active' : ''} fs-6 d-flex`}>QUẢN LÝ
                                        {isDropdownOpenYeuCau && isSidebarOpen ? (
                                            <i className="d-block icon-hover"><DownOutlined /></i>
                                        ) : (
                                            <i className="d-block icon-hover">< LeftOutlined /></i>
                                        )}
                                    </span>
                                </a>
                            </div>
                            <div className={`dropdown-content ${(isDropdownOpenYeuCau && isSidebarOpen) ? 'open' : ''} d-flex`}>
                                <ul>
                                    {(maGroup === 'AD' || maGroup === 'TP' || maGroup === 'TN' || maGroup === 'LD' || maGroup === 'KTTH') && (
                                        <li><NavLink to="/danhsachthutien" exact="true" className="nav-link me-1 d-flex align-items-center">
                                            <span className='d-flex align-items-center'>
                                                <i className='me-1 d-flex align-items-center'><CaretRightOutlined /></i>
                                                <span className='d-flex align-items-center'>Danh sách bệnh nhân</span>
                                            </span>
                                        </NavLink>
                                        </li>
                                    )}
                                    {(maGroup === 'AD' || maGroup === 'TP' || maGroup === 'KTTH') && (
                                        <li><NavLink to="/dongiadichvu" className="nav-link me-1 d-flex align-items-center">
                                            <span className='d-flex align-items-center'>
                                                <i className='me-1 d-flex align-items-center'><CaretRightOutlined /></i>
                                                <span className='d-flex align-items-center'>Đơn giá dịch vụ</span>
                                            </span>
                                        </NavLink>
                                        </li>
                                    )}
                                    {(maGroup === 'AD' || maGroup === 'TP' || maGroup === 'TN' || maGroup === 'LD' || maGroup === 'KTTH') && (
                                        <li><NavLink to="/baocao" className="nav-link me-1 d-flex align-items-center">
                                            <span className='d-flex align-items-center'>
                                                <i className='me-1 d-flex align-items-center'><CaretRightOutlined /></i>
                                                <span className='d-flex align-items-center'>Báo cáo</span>
                                            </span>
                                        </NavLink>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </ul>
                        {maGroup === 'AD' && (
                            <ul className='nav nav-pills flex-column mt-1 text-white'>
                                <div className="sidebar-item" onClick={handleDropdownToggleDanhMuc}>
                                    <a className="nav-link p-2 text-white d-flex align-items-center">
                                        <i className={`align-items-center ${(isDropdownOpenDanhMuc && isSidebarOpen) ? 'active' : ''} me-3 fs-6 d-flex`}><BarsOutlined /></i>
                                        <span className={`align-items-center ${(isDropdownOpenDanhMuc && isSidebarOpen) ? 'active' : ''} fs-6 d-flex`}>DANH MỤC
                                            {isDropdownOpenDanhMuc && isSidebarOpen ? (
                                                <i className="d-block icon-hover"><DownOutlined /></i>
                                            ) : (
                                                <i className="d-block icon-hover">< LeftOutlined /></i>
                                            )}
                                        </span>
                                    </a>
                                </div>
                                <div className={`dropdown-content ${(isDropdownOpenDanhMuc && isSidebarOpen) ? 'open' : ''} d-flex`}>
                                    <ul>
                                        <li><NavLink to="/phongban" exact="true" className="nav-link me-1 d-flex align-items-center">
                                            <span className='d-flex align-items-center'>
                                                <i className='me-1 d-flex align-items-center'><CaretRightOutlined /></i>
                                                <span className='d-flex align-items-center'>Phòng ban</span>
                                            </span>
                                        </NavLink>
                                        </li>
                                        <li><NavLink to="/nhanvien" exact="true" className="nav-link me-1 d-flex align-items-center">
                                            <span className='d-flex align-items-center'>
                                                <i className='me-1 d-flex align-items-center'><CaretRightOutlined /></i>
                                                <span className='d-flex align-items-center'>Nhân viên</span>
                                            </span>
                                        </NavLink>
                                        </li>
                                        <li><NavLink to="/user" className="nav-link me-1 d-flex align-items-center">
                                            <span className='d-flex align-items-center'>
                                                <i className='me-1 d-flex align-items-center'><CaretRightOutlined /></i>
                                                <span className='d-flex align-items-center'>User</span>
                                            </span>
                                        </NavLink>
                                        </li>
                                        <li><NavLink to="/phanquyen" className="nav-link me-1 d-flex align-items-center">
                                            <span className='d-flex align-items-center'>
                                                <i className='me-1 d-flex align-items-center'><CaretRightOutlined /></i>
                                                <span className='d-flex align-items-center'>Phân quyền</span>
                                            </span>
                                        </NavLink>
                                        </li>
                                    </ul>
                                </div>

                            </ul>
                        )
                        }
                    </div>
                </div>
                <div>
                    <hr className='text-white'></hr>
                    <div className='nav-item p-6'>
                        <a href='' className='p-1 text-decoration-none text-white'>
                            <i className='bi bi-person-circle me-3 fs-6'></i>
                            {/* <span className='fs-4'><strong>User</strong></span> */}
                        </a>
                    </div>
                </div>
            </div >
        }
        </>
    );
}
export default Sidebar; 