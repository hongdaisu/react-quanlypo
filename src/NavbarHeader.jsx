import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, LoginOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { handleLogoutRedux } from './redux/actions/userAction'
import Cookies from 'js-cookie';
import './NavbarHeader.scss';

const NavbarHeader = (props) => {
    const user = useSelector(state => state.user.account);
    const { Toggle, handleCloseAll } = props;
    const { isSidebarOpen } = props;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const removeAccountCookies = () => {
        Cookies.remove('firstName');
        Cookies.remove('phongban_id');
        Cookies.remove('id');
        Cookies.remove('auth');
        Cookies.remove('use_groupId');
        Cookies.remove('ma_groupId');
        // const cookiesToRemove = Object.keys(Cookies.get());
        // cookiesToRemove.forEach(cookie => {
        //     if (cookie.startsWith('jwt_') || cookie === 'jwt_parts_count') {
        //         Cookies.remove(cookie);
        //     }
        // });
    };


    // const handleLogout = () => {
    //     // console.log('user', user)
    //     dispatch(handleLogoutRedux());
    //     // Gọi hàm handleCloseAll để xóa hết các component đã mở
    //     handleCloseAll();
    //     //navigate('http://dn-qlpo.fhmc.com/', { replace: true });
    //     navigate('http://qlpo.local/', { replace: true });
    // }

    const handleLogout = () => {
        dispatch(handleLogoutRedux());
        handleCloseAll();

        // Kiểm tra môi trường và điều kiện để sử dụng URL phù hợp
        const url = window.location.protocol === 'https:'
            ? process.env.REACT_APP_BACKEND_URL_HTTPS
            : process.env.REACT_APP_BACKEND_URL;

        navigate(url, { replace: true });
    }

    // useEffect(() => {
    //     if (user && user.auth === false) {
    //         removeAccountCookies();
    //         navigate("/");
    //         // toast.success('Thoát tài khoản thành công...')
    //         // removeAccountCookies();
    //     }
    // }, [user])

    useEffect(() => {
        if (user && user.auth === false) {
            removeAccountCookies();
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    // console.log('check user', user)

    return (
        <>{user && user.auth === true &&
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ height: '5%' }}>
                <div className="container-fluid d-flex align-items-center">
                    <a className="navbar-brand " onClick={Toggle}>
                        {isSidebarOpen ? (
                            <i className="d-block icon-hover"><MenuFoldOutlined /></i>
                        ) : (
                            <i className="d-block icon-hover"><MenuUnfoldOutlined /></i>
                        )}
                    </a>
                    <div className="col-11 login-menu">
                        <span>Xin chào, {user && user.auth ? user.firstName : ''} !</span>
                    </div>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <span className='p-1 text-white d-flex align-items-center'>
                                <i onClick={() => handleLogout()} className='me-3 fs-6 d-flex align-items-center icon-hover'><LoginOutlined /></i>
                            </span>
                        </ul>
                    </div>
                </div>
            </nav>
        }
        </>
    );
}
export default NavbarHeader;

