import React, { Component } from "react";
import { connect } from "react-redux";
import { postVerifyBookingAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";
import "./VerifyEmail.scss";

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
        };
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            const urlParams = new URLSearchParams(this.props.location.search);
            const doctorId = urlParams.get('doctorId');
            const token = urlParams.get('token');
            let res = await postVerifyBookingAppointment({
                doctorId,
                token,
            });

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode,
                });
            } else {
                this.setState({
                    statusVerify: false,
                    errCode: res.errCode || -1,
                });
            }
        }
    }

    render() {
        let { statusVerify, errCode } = this.state;
        return (
            <>
                <HomeHeader />
                <div className="verify-email-container">
                    <div className="verify-email-content">
                        {statusVerify === true && errCode === 0 ? (
                            <div className="success-message">
                                <h2>Xác nhận lịch hẹn thành công!</h2>
                                <p>Cảm ơn bạn đã đặt lịch hẹn với bác sĩ.</p>
                            </div>
                        ) : (
                            <div className="error-message">
                                <h2>Lỗi xác nhận lịch hẹn</h2>
                                {errCode === 1 && <p>Thông tin không đầy đủ. Vui lòng thử lại.</p>}
                                {errCode === 2 && <p>Lịch hẹn đã được xác nhận hoặc không tồn tại.</p>}
                                {errCode === -1 && <p>Đã xảy ra lỗi. Vui lòng thử lại sau.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => { return {}; };
const mapDispatchToProps = (dispatch) => { return {}; };

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);