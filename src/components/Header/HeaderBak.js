import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { handleLogoutRedux } from '../../redux/actions/userAction'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import './Header.scss';
const HeaderBak = () => {

    const user = useSelector(state => state.user.account);

    // console.log('check user header', user)
    // const storedFirstName = Cookies.get('firstName');
    // const storedAuth = JSON.parse(Cookies.get('auth'));

    // console.log('storedFirstName', storedFirstName)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const removeAccountCookies = () => {
        Cookies.remove('firstName');
        Cookies.remove('jwt'); // Nếu cookie có tên là 'jwt'
        Cookies.remove('auth'); // Nếu cookie có tên là 'auth'
    };


    const handleLogout = () => {
        dispatch(handleLogoutRedux());
    }

    useEffect(() => {
        if (user && user.auth === false) {
            navigate("/");
            // toast.success('Thoát tài khoản thành công...')
            removeAccountCookies();
        }
    }, [user])
    return (
        <>
            {user && user.auth === true &&
                <div className="header-container">
                    < Navbar expand="lg" className="bg-body-tertiary" >
                        <Container>
                            {/* <Navbar.Brand href="#home"></Navbar.Brand> */}
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    {/* <NavLink to="/" className="nav-link" exact>Home</NavLink> */}
                                    {/* <NavLink to="phongban" className="nav-link">Phòng ban</NavLink> */}
                                    <NavDropdown title="Danh mục" id="basic-nav-dropdown">
                                        <NavDropdown.Item as={NavLink} to="phongban" className="nav-link">
                                            Phòng ban
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="user" className="nav-link">
                                            Tài khoản
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/phanquyen" className="nav-link">
                                            Phân quyền
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                    <NavDropdown title="Quản lý công văn" id="basic-nav-dropdown">
                                        <NavDropdown.Item as={NavLink} to="/action3">
                                            Duyệt công văn
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/action3">
                                            Công văn đến
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/action3">
                                            Công văn đi
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                                <Nav>
                                    <div className="btn btn-logout" >
                                        <div>
                                            <span className='welcom'>Xin chào, {user && user.auth ? user.firstName : ''} !</span>
                                        </div>
                                        <div>
                                            <NavDropdown className="fas fa-user-circle" id="basic-nav-dropdown">
                                                <NavDropdown.Item onClick={() => handleLogout()}>
                                                    Logout
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                        </div>
                                    </div>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar >
                </div >
            }
        </>
    );
}

export default HeaderBak;