import React, { useState } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { createNewUserService } from "../../services/userService";
import "./Login.scss";

const Register = (props) => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phonenumber: "",
        address: "",
        gender: "M",
    });
    const [errMessage, setErrMessage] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);

    const { isLoggedIn, userInfo, dispatch } = props;

    if (isLoggedIn && userInfo) {
        if (userInfo.roleId === "R1") {
            dispatch(push("/system/user-manage"));
            return null;
        }
        if (userInfo.roleId === "R2") {
            dispatch(push("/doctor"));
            return null;
        }
        dispatch(push("/home"));
        return null;
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const checkValidateInput = () => {
        const required = ["email", "password", "firstName", "lastName", "phonenumber", "address"];
        for (let f of required) {
            if (!form[f]) {
                setErrMessage(`Vui lòng nhập ${f === "phonenumber" ? "số điện thoại" : f === "firstName" ? "tên" : f === "lastName" ? "họ" : f}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMessage("");
        if (!checkValidateInput()) return;
        try {
            const res = await createNewUserService({ ...form, roleId: "R3", positionId: "P0" });
            if (res && res.data && res.data.errCode === 0) {
                setErrMessage("Đăng ký thành công! Vui lòng đăng nhập.");
                setTimeout(() => dispatch(push('/login')), 1200);
            } else {
                setErrMessage(res?.data?.errMessage || res?.data?.message || "Đăng ký thất bại!");
            }
        } catch (e) {
            setErrMessage("Lỗi kết nối backend!");
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <div className="login-content">
                    <div className="text-login">ĐĂNG KÝ</div>
                    <form onSubmit={handleSubmit}>
                        <div className="col-12 form-group login-input">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Mật khẩu</label>
                            <div className="login-show-password">
                                <input
                                    type={isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu"
                                />
                                <span onClick={() => setIsShowPassword(!isShowPassword)}>
                                    <i className={isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </span>
                            </div>
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Họ</label>
                            <input
                                type="text"
                                className="form-control"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Nhập họ"
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Tên</label>
                            <input
                                type="text"
                                className="form-control"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="Nhập tên"
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                className="form-control"
                                name="phonenumber"
                                value={form.phonenumber}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Địa chỉ</label>
                            <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Giới tính</label>
                            <select
                                className="form-control"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="M">Nam</option>
                                <option value="F">Nữ</option>
                                <option value="O">Khác</option>
                            </select>
                        </div>
                        <div className="col-12" style={{ color: "red", minHeight: 24 }}>
                            {errMessage}
                        </div>
                        <div className="col-12">
                            <button className="btn-login" type="submit">Đăng ký</button>
                        </div>
                        <div className="col-12 text-center mt-3">
                            <span>Bạn đã có tài khoản? </span>
                            <span
                                className="forgot-password"
                                onClick={() => dispatch(push('/login'))}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >Đăng nhập</span>
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
export default connect(mapStateToProps)(Register);