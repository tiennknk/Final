import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./PatientMenu.scss";

const PatientMenu = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const history = useHistory();

    const handleLogout = () => {
        localStorage.clear();
        history.push("/home");
        window.location.reload();
    };

    return (
        <div className="patient-menu-bar">
            <div className="menu-left">
                <div className="dropdown">
                    <span>Hồ sơ</span>
                    <div className="dropdown-content">
                        <Link to="/patient/profile">Thông tin cá nhân</Link>
                        <Link to="/patient/history">Lịch sử khám</Link>
                    </div>
                </div>
            </div>
            <div className="menu-right">
                <span>Xin chào, {userInfo?.lastName || ""}!</span>
                <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
            </div>
        </div>
    );
};

export default PatientMenu;