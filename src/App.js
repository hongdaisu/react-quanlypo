
import { useEffect, useState, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import Cookies from 'js-cookie';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

// import User from "./components/System/User";
// import Login from "./components/Login/Login";
import { handleRefresh } from './redux/actions/userAction';
import Sidebar from './Sidebar';
import NavbarHeader from './NavbarHeader.jsx';
import { fetchAllMenuCon } from './services/menuService.js';

const App = () => {
  // const account = useSelector(state => state.user.account);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const authCookies = Cookies.get('auth');
  const dispatch = useDispatch();

  const [openedComponents, setOpenedComponents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [rowData, setRowData] = useState([]);
  const [tenmenucon, setTenMenuCon] = useState([]);

  //console.log('authCookies', authCookies)

  const handleMouseEnter = () => {
    setIsSidebarOpen(true); // Mở sidebar khi hover vào
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false); // Đóng sidebar khi không hover nữa
  };

  const Toggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  useEffect(() => {
    handleCloseAll();
  }, [authCookies])
  useEffect(() => {
    const handleSize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      }
    }
    window.addEventListener('resize', handleSize);
    if (authCookies === 'true') {
      dispatch(handleRefresh());
    }
    return () => {
      window.removeEventListener('resize', handleSize);
    }
  }, [])

  const onGridReadyMenuCon = useCallback(async () => {
    try {
      let response = await fetchAllMenuCon();
      //console.log('check data role App', response)
      if (response && response.errCode === 0) {
        setRowData(response.menu)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    //console.log('rowData App', rowData, linkMenu, openedComponents)
    let newOpenedComponents = openedComponents.map(component => {
      // Tìm trong rowdata với điều kiện link trùng khớp với component (bỏ dấu '/')
      const found = rowData.find(item => item.link === `/${component}`);

      // Nếu tìm thấy, trả về tenmenu_con, nếu không, giữ nguyên giá trị ban đầu
      return found ? found.tenmenu_con : component;
    });
    setTenMenuCon(newOpenedComponents);
    //console.log('newOpenedComponents ', newOpenedComponents);
  }, [rowData]);

  // Lắng nghe sự thay đổi của đường dẫn và thêm component mới vào danh sách
  useEffect(() => {
    //onGridReadyMenuCon();
    const currentPath = location.pathname;
    if (currentPath !== '/') {
      onGridReadyMenuCon();
    }
    //console.log('currentPath', currentPath)
    const componentName = currentPath.split('/')[1]; // Lấy tên component từ URL
    if (componentName && !openedComponents.includes(componentName)) {
      setOpenedComponents([...openedComponents, componentName]);
    }
  }, [location, openedComponents]);

  // Hàm xử lý khi click vào button để mở lại component
  const handleComponentClick = (component) => {
    navigate(`/${component}`);
  };

  const handleRemoveComponent = (component) => {
    const updatedComponents = openedComponents.filter((comp) => comp !== component);

    // Kiểm tra nếu component hiện tại đang mở bị xóa
    if (location.pathname.includes(component)) {
      // Nếu còn component khác trong danh sách thì điều hướng đến component đầu tiên
      if (updatedComponents.length > 0) {
        navigate(`/${updatedComponents[0]}`); // Điều hướng đến component đầu tiên còn lại
      } else {
        navigate('/'); // Nếu không còn component nào, điều hướng về trang chủ
      }
    }

    // Cập nhật danh sách các component đã mở
    setOpenedComponents(updatedComponents);
  };

  const handleCloseAll = () => {
    // Nếu danh sách openedComponents có ít nhất 1 component
    if (openedComponents.length > 0) {
      const firstComponent = openedComponents[0]; // Giữ lại component đầu tiên
      setOpenedComponents([firstComponent]);

      // Điều hướng đến component đầu tiên
      navigate(`/${firstComponent}`);
    }
  };

  return (
    <>
      <div className="d-flex">
        {authCookies !== undefined && (
          <div className={`sidebar-container ${isSidebarOpen ? '' : 'sidebar-hidden'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          </div>
        )}
        <div className="col overflow-auto">
          {/* <NavbarHeader Toggle={Toggle} isSidebarOpen={isSidebarOpen} /> */}
          <NavbarHeader Toggle={Toggle} isSidebarOpen={isSidebarOpen} handleCloseAll={handleCloseAll} />
          {/* Hiển thị các button tương ứng với các component đã mở */}
          {authCookies !== undefined && (
            <div className='row grid-container-tiepnhan'>
              <div className="row d-flex row-tiepnhan">
                <div className="col-md-12" style={{ width: '90%', minWidth: '90%' }}>
                  {openedComponents.map((component, index) => (
                    <div key={index} className="d-inline-block me-2 position-relative">
                      <button
                        className={`btn me-2 ${location.pathname.includes(component) ? 'btn-primary active-component' : 'btn-secondary'} btn-custom-height`}
                        onClick={() => handleComponentClick(component)}
                      >
                        <i style={{ fontSize: '13px', fontStyle: 'normal', paddingRight: '5px' }}>
                          {tenmenucon[index] ? tenmenucon[index] : component}
                        </i>
                        {/* <i style={{ fontSize: '14px' }}>{component}</i> */}
                      </button>
                      <span
                        className="close-icon"
                        onClick={() => handleRemoveComponent(component)}
                        style={{
                          position: 'absolute',
                          top: '1px',
                          right: '10px',
                          cursor: 'pointer',
                          color: 'white',
                        }}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
                {/* Nút Close All */}
                <div className="col-md-1 d-flex justify-content-end">
                  <button className="btn btn-danger btn-custom-height" onClick={handleCloseAll} >
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          <AppRoutes />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        Transition="flip"
      />
    </>
  );
}
export default App; 