import React, {Component} from "react";
import {connect} from "react-redux";
import "./BookingModal.scss";
import {Modal} from "reactstrap";
import _ from "lodash";
import ProfileDoctor from '../Doctor/ProfileDoctor';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
        // Any initialization logic can go here
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        let doctorId = '';
        let {isOpenModalBooking, closeBookingModal, dataTime} = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
        }
        return (
            <Modal
                isOpen={isOpenModalBooking}
                className={"booking-modal-container"}
                size="lg"
                centered
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">Thông tin đặt lịch khám</span>
                        <span className="right" onClick={closeBookingModal}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-info">
                            <ProfileDoctor
                                doctorId={doctorId}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Họ tên</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập họ tên"
                                />
                            </div>
                            <div className="col-6 form-group" >
                                <label>Số điện thoại</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Giới tính</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập giới tính"
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ email</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập địa chỉ email"
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ liên hệ</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập địa chỉ liên hệ"
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Lý do khám</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập lý do khám"
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Đặt cho ai</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập tên người đặt"
                                />
                            </div>
                            <div className="booking-modal-footer">
                                <button className="btn btn-primary" onClick={closeBookingModal}>
                                    Xác nhận
                                </button>
                                <button className="btn btn-secondary" onClick={closeBookingModal}>
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);