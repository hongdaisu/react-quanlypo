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
const Header = () => {

    const user = useSelector(state => state.user.account);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
    const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);

    const handleMouseEnter = () => {
        setIsDropdownOpen(true);
    };

    // const handleMouseLeave = () => {
    //     // Sử dụng setTimeout để trì hoãn việc đặt isDropdownOpen thành false
    //     setTimeout(() => {
    //         setIsDropdownOpen(false);
    //     }, 1000); // 1000 milliseconds (1 second)
    // };

    const handleMouseLeave = () => {
        setIsDropdownOpen(false);

    };

    const handleMouseEnter1 = () => {
        setIsDropdownOpen1(true);
    };

    const handleMouseLeave1 = () => {
        setIsDropdownOpen1(false);
    };

    const handleMouseEnter2 = () => {
        setIsDropdownOpen2(true);
    };

    const handleMouseLeave2 = () => {
        setIsDropdownOpen2(false);
    };


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

    // useEffect(() => {
    //     // Xóa timeout khi component unmount hoặc khi isDropdownOpen thay đổi
    //     return () => {
    //         clearTimeout();
    //     };
    // }, [isDropdownOpen]);

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
                                    <div>
                                        <NavDropdown className='header-menu' title="Danh mục" id="basic-nav-dropdown"
                                            show={isDropdownOpen}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <NavDropdown.Item as={NavLink} to="phongban" className="nav-link"
                                                show={isDropdownOpen}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <div class="test-container">
                                                    <i class="fa fa-caret-right faicon"></i>
                                                    <span class="test-text">Phòng ban</span>
                                                </div>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={NavLink} to="user" className="nav-link"
                                                show={isDropdownOpen}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <div class="test-container">
                                                    <i class="fa fa-caret-right faicon"></i>
                                                    <span class="test-text">Tài khoản</span>
                                                </div>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={NavLink} to="/phanquyen" className="nav-link"
                                                show={isDropdownOpen}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <div class="test-container">
                                                    <i class="fa fa-caret-right faicon"></i>
                                                    <span class="test-text">Phân quyền</span>
                                                </div>
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </div>
                                    <NavDropdown title="Quản lý công văn" id="basic-nav-dropdown"
                                        show={isDropdownOpen1}
                                        onMouseEnter={handleMouseEnter1}
                                        onMouseLeave={handleMouseLeave1}
                                    >
                                        <NavDropdown.Item as={NavLink} to="/action3"
                                            show={isDropdownOpen1}
                                            onMouseEnter={handleMouseEnter1}
                                        >
                                            Duyệt công văn
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/action3"
                                            show={isDropdownOpen1}
                                            onMouseEnter={handleMouseEnter1}
                                        >
                                            Công văn đến
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/action3"
                                            show={isDropdownOpen1}
                                            onMouseEnter={handleMouseEnter1}
                                        >
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
                                            <NavDropdown className="fas fa-user-circle" id="basic-nav-dropdown"
                                                show={isDropdownOpen2}
                                                onMouseEnter={handleMouseEnter2}
                                                onMouseLeave={handleMouseLeave2}
                                            >
                                                <NavDropdown.Item onClick={() => handleLogout()}
                                                    show={isDropdownOpen2}
                                                    onMouseEnter={handleMouseEnter2}
                                                >
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

export default Header;