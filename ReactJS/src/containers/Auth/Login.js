import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import "./Login.scss";
import { handleLoginApi } from "../../services/userService";
import { userLoginSuccess } from '../../store/actions/userActions';

const Login = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);

    const { isLoggedIn, userInfo, userLoginSuccess, push } = props;

    useEffect(() => {
        if (isLoggedIn && userInfo && userInfo.roleId) {
            let target = "/home";
            if (userInfo.roleId === "R1") target = "/system/user-redux";
            else if (userInfo.roleId === "R2") target = "/doctor/manage-schedule";
            if (window.location.pathname !== target) {
                push(target);
            }
        }
    }, [isLoggedIn, userInfo, push]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        if (!username || !password) {
            setLoginError("Vui lòng nhập đủ tài khoản và mật khẩu!");
            return;
        }
        try {
            const res = await handleLoginApi(username, password);
            if (res && res.errCode === 0 && res.user) {
                userLoginSuccess(res.user);
            } else {
                setLoginError(res?.message || "Sai tài khoản hoặc mật khẩu!");
            }
        } catch (err) {
            setLoginError("Lỗi kết nối server!");
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <div className="login-content">
                    <div className="text-login">Đăng nhập</div>
                    <form onSubmit={handleLogin}>
                        <div className="col-12 form-group login-input">
                            <label><i className="fas fa-user"></i> Tài khoản</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Tài khoản"
                            />
                        </div>
                        <div className="col-12 form-group login-input login-show-password">
                            <label><i className="fas fa-lock"></i> Mật khẩu</label>
                            <input
                                type={isShowPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                            />
                            <span onClick={() => setIsShowPassword(!isShowPassword)}>
                                <i className={isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                            </span>
                        </div>
                        {loginError && (
                            <div className="login-error" style={{ color: "red", textAlign: "center" }}>
                                {loginError}
                            </div>
                        )}
                        <button className="btn-login" type="submit">
                            Đăng nhập
                        </button>
                        <div className="col-12 text-center" style={{ margin: "8px 0" }}>
                            <span>Bạn chưa có tài khoản? </span>
                            <span
                                className="register-link"
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: 6 }}
                                onClick={() => push('/register')}
                            >Đăng ký</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo, 
});
const mapDispatchToProps = {
    userLoginSuccess,
    push
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);