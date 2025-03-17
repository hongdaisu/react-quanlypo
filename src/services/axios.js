import axios from 'axios';
import { toast } from 'react-toastify';
// const instance = axios.create({
//     baseURL: process.env.REACT_APP_BACKEND_URL,
//     withCredentials: true
// });

const instance = axios.create({
    baseURL: window.location.protocol === 'https:'
        ? process.env.REACT_APP_BACKEND_URL_HTTPS // Sử dụng URL HTTPS
        : process.env.REACT_APP_BACKEND_URL, // Sử dụng URL HTTP
    withCredentials: true
});

instance.interceptors.response.use(function (response) {
    // Thrown error for request with OK status code
    const { data } = response;
    return response.data;
}, function (error) {
    const status = error && error.response && error.response.status || 500;
    switch (status) {
        // authentication (token related issues)
        case 401: {
            toast.error('Đăng nhập lỗi')
            // window.location.href = '/'
            // console.log('window.location.href ', window.location.href)
            return Promise.reject(error);
        }

        // forbidden (permission related issues)
        case 403: {
            toast.error('Tài khoản chưa được phân quyền')
            return Promise.reject(error);
        }

        // bad request
        case 400: {
            return Promise.reject(error);
        }

        // not found
        case 404: {
            return Promise.reject(error);
        }

        // conflict
        case 409: {
            return Promise.reject(error);
        }

        // unprocessable
        case 422: {
            return Promise.reject(error);
        }

        // generic api error (server related) unexpected
        default: {
            return Promise.reject(error);
        }

        // case 302: {
        //     localStorage.setItem('loginWarning', 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');
        //     window.location.href = 'http://qlpo.local/'
        //     //window.location.href = 'http://10.22.22.1:3004/'
        //     //window.location.href = 'http://dn-qlpo.fhmc.com/'
        //     // return Promise.reject(error);
        // }

        case 302: {
            localStorage.setItem('loginWarning', 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');

            const url = window.location.protocol === 'https:'
                ? process.env.REACT_APP_BACKEND_URL_HTTPS
                : process.env.REACT_APP_FONTEND_URL;

            window.location.href = url; // Sử dụng URL phù hợp
            // return Promise.reject(error);
        }

        // case 302: {
        //     localStorage.setItem('loginWarning', 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');

        //     // Sử dụng một toast hoặc modal để thông báo lỗi
        //     alert('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');

        //     // Trả về lỗi để không làm gián đoạn quá trình xử lý API
        //     return Promise.reject(error);
        // }


    }
    // return Promise.reject(error);
});

export default instance;
