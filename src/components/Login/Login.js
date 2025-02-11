import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleLoginRedux } from '../../redux/actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import io from 'socket.io-client';
import { getUrl } from '../../services/urlServices';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const isLoading = useSelector(state => state.user.isLoading);
    const account = useSelector(state => state.user.account);
    const firstName = useSelector(state => state.user.account.firstName);
    const id = useSelector(state => state.user.account.id);
    const use_groupId = useSelector(state => state.user.account.use_groupId);
    const ma_groupId = useSelector(state => state.user.account.ma_groupId);
    const auth = useSelector(state => state.user.account.auth);
    const phongban_id = useSelector(state => state.user.account.phongban_id);
    const ky = useSelector(state => state.user.account.ky);

    const [socket, setSocket] = useState(null);
    const saveAccountToCookies = (firstName, id, auth, phongban_id, use_groupId, ma_groupId, ky) => {

        // Lưu các thông tin khác vào cookie
        Cookies.set('firstName', firstName, { expires: 7 });
        Cookies.set('phongban_id', phongban_id, { expires: 7 });
        Cookies.set('id', id, { expires: 7 });
        Cookies.set('auth', auth, { expires: 7 });
        Cookies.set('use_groupId', use_groupId, { expires: 7 });
        Cookies.set('ma_groupId', ma_groupId, { expires: 7 });
        Cookies.set('ky', ky, { expires: 7 });
    };

    // const handleLogin = async () => {
    //     try {
    //         if (!username) {
    //             toast.error('Vui lòng nhập user...')
    //             return;
    //         } else if (!password) {
    //             toast.error('Vui lòng nhập password...')
    //             return;
    //         }
    //         let url = await getUrl();

    //         const newSocket = io(url.url, {
    //             transports: ['websocket'] // Chỉ sử dụng WebSocket transport
    //         });
    //         newSocket.on('connect', () => {
    //             console.log('Connected to server socket.io');
    //         });
    //         newSocket.on('connect_error', (error) => {
    //             console.error('Failed to connect to server:', error);
    //         });
    //         setSocket(newSocket);

    //         dispatch(handleLoginRedux(username, password));
    //     } catch (error) {

    //     }
    // }

    const handleLogin = async (usernameInput = username, passwordInput = password, token = null) => {
        try {
            if (token) {
                // Đăng nhập bằng token
                //console.log('Đăng nhập bằng token hàm login')
                dispatch(handleLoginRedux(null, null, token));
            } else {
                if (!usernameInput) {
                    toast.error('Vui lòng nhập user...');
                    return;
                } else if (!passwordInput) {
                    toast.error('Vui lòng nhập password...');
                    return;
                }

                let url = await getUrl();

                const newSocket = io(url.url, {
                    transports: ['websocket']
                });
                newSocket.on('connect', () => {
                    console.log('Connected to server socket.io');
                });
                newSocket.on('connect_error', (error) => {
                    console.error('Failed to connect to server:', error);
                });
                setSocket(newSocket);

                // Đăng nhập bằng username và password
                dispatch(handleLoginRedux(usernameInput, passwordInput));
            }
        } catch (error) {
            console.error(error);
            toast.error('Đăng nhập thất bại, vui lòng thử lại.');
        }
    };

    const handleKeyDown = (event) => {
        // console.log('check event key', event.key)
        if (event.key === 'Enter') {
            handleLogin();
        }
    }

    useEffect(() => {
        const loginWarning = localStorage.getItem('loginWarning');
        if (loginWarning) {
            toast.warning(loginWarning);
            localStorage.removeItem('loginWarning');
        }
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);

        // Tìm tham số redirect
        const redirectParam = queryParams.get('redirect');
        if (redirectParam) {
            // Giải mã tham số redirect
            const decodedRedirect = decodeURIComponent(redirectParam);
            //console.log('Decoded redirect:', decodedRedirect);

            // Tìm token trong chuỗi đã giải mã
            const tokenMatch = decodedRedirect.match(/token=([^&]+)/);
            if (tokenMatch) {
                const token = tokenMatch[1];
                //console.log('Extracted token:', token);
                handleLogin(null, null, token);
            } else {
                console.log('Token not found in decoded redirect');
            }
        } else {
            console.log('Redirect parameter not found');
        }
    }, []);

    useEffect(() => {
        if (account && account.auth === true) {
            saveAccountToCookies(firstName, id, auth, phongban_id, use_groupId, ma_groupId, ky);

            if (account.ma_groupId === 'AD') {
                navigate("/po");
            }
            else if (account.ma_groupId === 'LD' || account.ma_groupId === 'PO' || account.ma_groupId === 'PR' || account.ma_groupId === 'HD') {
                navigate("/po");
            }
            else if (account.ma_groupId === 'NCC') {
                navigate("/ncc");
            }
        }
    }, [account]);

    // useEffect(() => {
    //     if (account && account.auth === true && account.ma_groupId === 'AD') {
    //         navigate("/user");
    //         saveAccountToCookies(firstName, id, auth, phongban_id, use_groupId, ma_groupId, ky);
    //     } else if (account && account.auth === true && account.ma_groupId === 'TPR') {
    //         navigate("/taoyeucau");
    //         saveAccountToCookies(firstName, id, auth, phongban_id, use_groupId, ma_groupId, ky);
    //     } else if (account && account.auth === true && account.ma_groupId === 'KPR') {
    //         const queryParams = new URLSearchParams(window.location.search);
    //         const id_yeucau = queryParams.get('id');
    //         saveAccountToCookies(firstName, id, auth, phongban_id, use_groupId, ma_groupId, ky);
    //         if (id_yeucau) {
    //             navigate("/kyyeucau", { state: { id_yeucau } });
    //         } else {
    //             // Nếu không có id và ky, điều hướng đến trang kyyeucau
    //             navigate("/kyyeucau");
    //         }
    //     } else if (account && account.auth === true && account.ma_groupId === 'TP') {
    //         const queryParams = new URLSearchParams(window.location.search);
    //         const id_yeucau = queryParams.get('id');
    //         saveAccountToCookies(firstName, id, auth, phongban_id, use_groupId, ma_groupId, ky);
    //         if (id_yeucau) {
    //             navigate("/kyyeucau", { state: { id_yeucau } });
    //         } else {
    //             // Nếu không có id và ky, điều hướng đến trang kyyeucau
    //             navigate("/kyyeucau");
    //         }
    //     }
    // }, [account])

    // console.log('account', account) style={{ backgroundImage: `url(/logohmdnnew.png)` }}

    return (
        <>
            <div className='login-background'>
                <div className='row'>
                    <div className='login-alert'>
                        <div className='col-12 thongbao1'>Thông báo</div>
                        <div className='col-12 thongbao2'>Sử dụng Tài khoản và Mật khẩu đăng nhập máy tính tại Hoàn Mỹ Đà Nẵng.</div>
                    </div>
                </div>
                <div className='row'>
                    <div className='login-container'>
                        <div className='login-content'>
                            <div className='col-12 text-login'>Login</div>
                            <div className='col-12 form-group login-input'>
                                <label>Username</label>
                                <input type="text" className='form-control'
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    onKeyDown={(event) => handleKeyDown(event)}
                                />
                            </div>
                            <div className='col-12 form-group login-input'>
                                <div className='custum-input-password'>
                                    <label>Password</label>
                                    <input type={isShowPassword === true ? 'text' : 'password'} className='form-control'
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        onKeyDown={(event) => handleKeyDown(event)}
                                    />
                                    <span>
                                        <i className={isShowPassword === true ? 'far fa-eye' : 'far fa-eye-slash'}
                                            onClick={() => setIsShowPassword(!isShowPassword)}
                                        ></i>
                                    </span>
                                </div>
                            </div>
                            <div className='col-12'>
                                <button className='btn-login'
                                    onClick={() => handleLogin()}
                                >
                                    <i className={isLoading === true ? 'fa fa-spinner fa-spin' : ''}></i>
                                    &nbsp;Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Login;