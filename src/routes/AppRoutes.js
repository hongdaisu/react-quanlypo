//import { Routes, Route } from "react-router-dom";
//import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import User from "../components/System/User";
import DmTaiSan from "../components/System/DmTaiSan";
import Login from "../components/Login/Login";
import { useSelector } from 'react-redux';
import DmPhongBan from "../components/System/DmPhongBan";
import DmNhanVien from "../components/System/DmNhanVien";
import Role from "../components/System/Role";
import Menu from "../components/System/Menu";
import PrivateRoute from "./PrivateRoute";
import DanhSachPO from "../components/System/DanhSachPO";
import DanhSachPR from "../components/System/DanhSachPR";
import BaoCao from "../components/System/BaoCao";
import HopDong from "../components/System/HopDong";
import NhapNhaCungCap from "../components/System/NhapNhaCungCap";
import CheckNhapNCC from "../components/System/CheckNhapNCC";
import KiemKeTaiSan from "../components/System/KiemKeTaiSan";
// import { handleRefresh } from '../redux/actions/userAction';
const AppRoutes = () => {
    const user = useSelector(state => state.user.account);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user && user.auth) {
            // Kiểm tra xem có URL chuyển hướng không
            const queryParams = new URLSearchParams(location.search);
            const redirectUrl = queryParams.get('redirect');

            if (redirectUrl) {
                navigate(redirectUrl);
            }
        }
    }, [user, navigate, location]);
    return (
        <>
            <Routes>
                <Route path="/" exact element={<Login />} />
                <Route
                    path="/user"
                    element={<PrivateRoute> <User /> </PrivateRoute>}
                />
                <Route
                    path="/dmts"
                    element={<PrivateRoute> <DmTaiSan /> </PrivateRoute>}
                />
                <Route
                    path="/phongban"
                    element={<PrivateRoute><DmPhongBan /></PrivateRoute>}
                />
                <Route
                    path="/nhanvien"
                    element={<PrivateRoute><DmNhanVien /></PrivateRoute>}
                />
                <Route
                    path="/phanquyen"
                    element={<PrivateRoute><Role /></PrivateRoute>}
                />
                <Route
                    path="/menu"
                    element={<PrivateRoute><Menu /></PrivateRoute>}
                />
                <Route
                    path="/po"
                    element={<PrivateRoute><DanhSachPO /></PrivateRoute>}
                />
                <Route
                    path="/pr"
                    element={<PrivateRoute><DanhSachPR /></PrivateRoute>}
                />
                <Route
                    path="/baocao"
                    element={<PrivateRoute><BaoCao /></PrivateRoute>}
                />
                <Route
                    path="/hd"
                    element={<PrivateRoute><HopDong /></PrivateRoute>}
                />
                <Route
                    path="/ncc"
                    element={<PrivateRoute><NhapNhaCungCap /></PrivateRoute>}
                />
                <Route
                    path="/checkct"
                    element={<PrivateRoute><CheckNhapNCC /></PrivateRoute>}
                />
                <Route
                    path="/kkts"
                    element={<PrivateRoute><KiemKeTaiSan /></PrivateRoute>}
                />
            </Routes >
        </>
    )
}
export default AppRoutes;