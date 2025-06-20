import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBars } from "react-icons/fa";
import "./PatientMenu.scss";

const PatientMenu = () => {
    const userInfo = useSelector(state => state.user.userInfo);
    const history = useHistory();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        history.push("/home");
        window.location.reload();
    };

    return (
        <div className="patient-menu-bar">
            <div className="menu-left">
                <div 
                    className="dropdown"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <button className="btn-bars" aria-label="Menu">
                        <FaBars size={22}/>
                    </button>
                    {showDropdown && (
                        <div className="dropdown-content">
                            <Link to="/">Trang chủ</Link>
                        </div>
                    )}
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