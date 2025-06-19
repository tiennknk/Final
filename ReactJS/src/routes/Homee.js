import React from "react";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";

const HomePage = () => <div>Trang chủ</div>;

const Home = (props) => {
    const { isLoggedIn, userInfo } = props;
    const location = useLocation();

    // Thêm log để debug
    console.log("Home.js DEBUG:", {
        isLoggedIn,
        userInfo,
        pathname: location.pathname,
    });

    // Nếu chưa login, về trang login
    if (!isLoggedIn) return <Redirect to="/login" />;
    // Nếu là admin, luôn về /system/user-manage (dù vào từ đâu)
    if (userInfo && userInfo.roleId === "R1" && location.pathname !== "/system/user-manage") {
        return <Redirect to="/system/user-manage" />;
    }
    // Nếu là doctor
    if (userInfo && userInfo.roleId === "R2" && location.pathname !== "/doctor") {
        return <Redirect to="/doctor" />;
    }
    // Nếu là user thường, đúng trang /home thì render
    return <HomePage />;
};

const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
});
export default connect(mapStateToProps)(Home);