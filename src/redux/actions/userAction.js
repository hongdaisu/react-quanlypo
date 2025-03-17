import { handleLoginApi, fetchLogOutApi, handleLoginTokenApi } from '../../services/userServices';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export const FETCH_USER_LOGIN = 'FETCH_USER_LOGIN';
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_REFRESH = 'USER_REFRESH';

export const handleLoginRedux = (username, password, token) => {
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_USER_LOGIN });

        let res;
        if (token) {
            // Đăng nhập bằng token
            //console.log('Đăng nhập bằng token hàm handleLoginRedux')
            res = await handleLoginTokenApi(token);
        } else {
            // Đăng nhập bằng username và password
            res = await handleLoginApi(username, password);
            //console.log('Đăng nhập bằng username', res)
        }

        if (res && res.errCode !== 0) {
            toast.error(res.message);
            dispatch({ type: FETCH_USER_ERROR });
        } else {
            dispatch({
                type: FETCH_USER_SUCCESS,
                data: {
                    username: username,
                    password: password,
                    phongban_id: res.user.phongban_id,
                    id: res.user.id,
                    use_groupId: res.user.use_groupId,
                    firstName: res.user.firstName,
                    auth: true,
                    ma_groupId: res.user.ma_groupId,
                    ky: res.user.ky
                }
            });
        }
    };
};

export const handleLoginRedux_bak = (username, password) => {
    // console.log('check username', username, password)
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_USER_LOGIN });

        let res = await handleLoginApi(username, password);
        // console.log('check res', res.token)
        if (res && res.errCode !== 0) {
            toast.error(res.message)
            dispatch({
                type: FETCH_USER_ERROR
            });
        } else {
            dispatch({
                type: FETCH_USER_SUCCESS,
                data: {
                    username: username, password: password, phongban_id: res.user.phongban_id,
                    // username: username, phongban_id: res.user.phongban_id,
                    id: res.user.id, use_groupId: res.user.use_groupId, firstName: res.user.firstName, auth: true,
                    ma_groupId: res.user.ma_groupId, //, jwt: res.token
                    ky: res.user.ky
                }
            });
        }
    }
}

// export const handleLogoutRedux = () => {
//     return (dispatch, getState) => {
//         dispatch({
//             type: USER_LOGOUT
//         });
//     }
// }

export const handleLogoutRedux = () => {
    return async (dispatch, getState) => {
        try {
            let response = await fetchLogOutApi();

            if (response && response.errCode === 0) {
                dispatch({
                    type: USER_LOGOUT
                });
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
};


export const handleRefresh = () => {
    const getAccountFromCookies = () => {
        const id = Cookies.get('id');
        const firstName = Cookies.get('firstName');
        const phongban_id = Cookies.get('phongban_id');
        const use_groupId = Cookies.get('use_groupId');
        const ma_groupId = Cookies.get('ma_groupId');
        const ky = Cookies.get('ky');
        return { id, firstName, phongban_id, use_groupId, ma_groupId, ky };
    };
    let firstName = getAccountFromCookies()
    return (dispatch, getState) => {
        dispatch({
            type: USER_REFRESH,
            data: {
                firstName: firstName,
                id: firstName.id,
                phongban_id: firstName.phongban_id,
                use_groupId: firstName.use_groupId,
                ma_groupId: firstName.ma_groupId,
                ky: firstName.ky
            }
        });
    }
}

// export const handleRefresh = () => {
//     return (dispatch, getState) => {
//         const id = Cookies.get('id');
//         const firstName = Cookies.get('firstName');
//         const phongban_id = Cookies.get('phongban_id');

//         dispatch({
//             type: USER_REFRESH,
//             data: {
//                 id,
//                 firstName,
//                 phongban_id
//             }
//         });
//     }
// }



