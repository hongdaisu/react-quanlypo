// import { Routes, Route } from "react-router-dom";
// import Login from "../components/Login/Login";
// import { useSelector } from 'react-redux';
// const PrivateRoute = (props) => {
//     return (
//         <>
//             {props.children}
//         </>
//     )
// }

// export default PrivateRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = (props) => {
    const user = useSelector(state => state.user.account);
    const location = useLocation();

    if (!user || !user.auth) {
        // Lưu trữ URL gốc trước khi chuyển hướng
        const redirectUrl = `${location.pathname}${location.search}`;
        return <Navigate to={`/?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
    }

    return props.children;
};

export default PrivateRoute;
