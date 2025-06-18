import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const HomePage = () => <div>Trang chủ</div>;

const Home = (props) => {
    const { isLoggedIn, userInfo, location } = props;
    let linkToRedirect = "/home";
    if (isLoggedIn && userInfo && userInfo.roleId) {
        if (userInfo.roleId === "R1") linkToRedirect = "/system/user-manage";
        else if (userInfo.roleId === "R2") linkToRedirect = "/doctor";
        else if (userInfo.roleId === "R3") linkToRedirect = "/home";
    }
    if (isLoggedIn && userInfo && userInfo.roleId && location.pathname !== linkToRedirect) {
        return <Redirect to={linkToRedirect} />;
    }
    if (!isLoggedIn) return <Redirect to="/login" />;
    return <HomePage />;
};

const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
});
export default connect(mapStateToProps)(Home);