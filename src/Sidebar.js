
import { React, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { UserOutlined, SolutionOutlined, CaretRightOutlined, CaretDownOutlined, BarsOutlined, LeftOutlined, DownOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { getGroup_Id } from './services/sideBarServices';
import './Sidebar.scss';
import { set } from 'lodash';

// const Sidebar = (props) => {
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [isLoadingGroupId, setIsLoadingGroupId] = useState(true);
    const [maGroup, setMaGroup] = useState('');

    const user = useSelector(state => state.user.account);
    const ma_groupId = useSelector(state => state.user.account.ma_groupId);
    const Group_Id = useSelector(state => state.user.account.use_groupId);
    const NhomQuyen = Cookies.get('ma_groupId');

    const [menucha, setMenuCha] = useState(['']);
    const [menuConGroup, setMenuConGroup] = useState(['']);
    const [openMenu, setOpenMenu] = useState(['']);
    const dropdownRefs = useRef({});

    //const [openMenu, setOpenMenu] = useState(null);
    const location = useLocation();

    //console.log('Sidebar', isSidebarOpen)

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
                    //console.log('menuChaMap', menuChaMap)
                    // Tạo danh sách các menu cha duy nhất
                    const menuCha = [...new Set(data_menu_con.map(item => item.menu_cha_id))].map(id => ({
                        id,
                        tenmenu_cha: menuChaMap[id] || 'Không xác định'
                    }));
                    //console.log('menuCha', menuCha)

                    // Nhóm các menu con theo menu cha
                    const menuConGrouped = data_menu_con.reduce((acc, item) => {
                        if (!acc[item.menu_cha_id]) {
                            acc[item.menu_cha_id] = [];
                        }
                        acc[item.menu_cha_id].push(item);
                        return acc;
                    }, {});
                    //console.log('menuConGrouped', menuConGrouped)

                    setMenuCha(menuCha);
                    setMenuConGroup(menuConGrouped);
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
        // Kiểm tra menu con nào active dựa trên đường dẫn hiện tại
        const currentPath = location.pathname;
        // console.log('currentPath', currentPath)
        // Duyệt qua các menu cha để tìm menu cha có menu con khớp với đường dẫn hiện tại
        const foundMenuChaId = Object.keys(menuConGroup).find(menuChaId => {
            // Đảm bảo rằng menuConGroup[menuChaId] là một mảng trước khi sử dụng some
            return Array.isArray(menuConGroup[menuChaId]) &&
                menuConGroup[menuChaId].some(menuCon => menuCon.link === currentPath);
        });
        //console.log('foundMenuChaId', foundMenuChaId)
        // Nếu tìm thấy menu cha tương ứng, mở nó
        if (foundMenuChaId) {
            setOpenMenu(parseInt(foundMenuChaId));
        }
    }, [location, menuConGroup]);


    const handleDropdownToggle = (menuId) => {
        setIsSidebarOpen(true);
        setOpenMenu(prevMenu => (prevMenu === menuId ? null : menuId));
    };

    // // Mở menu với ID = 1 khi sidebar được mở
    // useEffect(() => {
    //     if (isSidebarOpen && menucha.length > 0) {
    //         setOpenMenu(1);
    //     }
    // }, [isSidebarOpen, menucha]);


    return (
        <>{user && user.auth === true &&
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'} d-flex justify-content-between flex-column bg-dark text-white py-3 ps-1 pe-4 vh-100`}>
                <div>
                    <div className={`image-container ${isSidebarOpen ? 'open' : 'closed'}`}>
                        <img src='/logohmdnnew.png' alt='description' className='full-width-image' />
                        <hr className='text-white mt-2'></hr>
                    </div>
                    <div className="sidebar">
                        <ul className='nav nav-pills flex-column mt-1 text-white'>
                            {menucha.map(menu => (
                                <div key={menu.id} className="sidebar-item">
                                    <a className="nav-link p-2 text-white d-flex align-items-center" onClick={() => handleDropdownToggle(menu.id)}>
                                        <i className={`align-items-center ${(openMenu === menu.id && isSidebarOpen) ? 'active' : ''} me-3 fs-6 d-flex`}>
                                            {menu.id === 1 ? <SolutionOutlined /> : <BarsOutlined />}
                                        </i>
                                        <span className={`align-items-center ${(openMenu === menu.id && isSidebarOpen) ? 'active' : ''} fs-6 d-flex`}>
                                            {menu.tenmenu_cha}
                                            {openMenu === menu.id ? (
                                                <i className="d-block icon-hover"><DownOutlined /></i>
                                            ) : (
                                                <i className="d-block icon-hover"><LeftOutlined /></i>
                                            )}
                                        </span>
                                    </a>
                                    {openMenu === menu.id && (
                                        <div className={`dropdown-content ${(openMenu === menu.id && isSidebarOpen) ? 'open' : ''} d-flex`}>
                                            <ul>
                                                {menuConGroup[menu.id] && menuConGroup[menu.id].map(subItem => (
                                                    <li key={subItem.id}>
                                                        <NavLink to={subItem.link} className="nav-link me-1 d-flex align-items-center">
                                                            <span className='d-flex align-items-center'>
                                                                <i className='me-1 d-flex align-items-center'><CaretRightOutlined /></i>
                                                                <span className='d-flex align-items-center'>{subItem.tenmenu_con}</span>
                                                            </span>
                                                        </NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <hr className='text-white'></hr>
                    <div className='nav-item p-6'>
                        <a href='' className='p-1 text-decoration-none text-white'>
                            <i className='bi bi-person-circle me-3 fs-6'></i>
                        </a>
                    </div>
                </div>
            </div >
        }
        </>
    );
}
export default Sidebar; 