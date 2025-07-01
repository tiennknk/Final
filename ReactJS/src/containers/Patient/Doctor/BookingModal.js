import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import _ from "lodash";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import * as actions from "../../../store/actions";
import Select from "react-select";
import { toast } from "react-toastify";
import { postBookAppointment } from "../../../services/userService";
import moment from "moment";
import axios from "axios";

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingFor: "me",
            fullName: "",
            phoneNumber: "",
            email: "",
            address: "",
            reason: "",
            selectedGender: "",
            doctorId: "",
            genderArr: [],
            timeType: "",
            paymentMethod: "QR_BANK", // Mặc định QR_BANK
            qrUrl: "",
            addInfo: "",
            price: "",
            accountName: "",
            accountNumber: "",
            bank: "",
            bookingCode: "",
            showQR: false,
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.dataTime !== this.props.dataTime) {
            let { dataTime } = this.props;
            if (dataTime && !_.isEmpty(dataTime)) {
                let doctorId = dataTime.doctorId;
                let timeType = dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType,
                });
            }
        }
        if (prevProps.genders !== this.props.genders) {
            const genderArr = this.buildDataGender(this.props.genders);
            this.setState({ genderArr }, () => {
                this.setFormByBookingFor(this.state.bookingFor);
            });
        }
        if (
            (prevProps.userInfo !== this.props.userInfo ||
                prevState.bookingFor !== this.state.bookingFor) &&
            this.state.genderArr.length > 0
        ) {
            this.setFormByBookingFor(this.state.bookingFor);
        }
    }

    setFormByBookingFor = (type) => {
        if (type === "me" && this.props.userInfo) {
            const fullName = [
                this.props.userInfo.firstName,
                this.props.userInfo.lastName,
            ]
                .filter(Boolean)
                .join(" ")
                .trim();
            const phoneNumber =
                this.props.userInfo.phonenumber ||
                this.props.userInfo.phoneNumber ||
                "";
            const address = this.props.userInfo.address || "";
            let genderOption = "";
            if (
                this.state.genderArr.length > 0 &&
                this.props.userInfo.gender
            ) {
                genderOption =
                    this.state.genderArr.find(
                        (g) => g.value === this.props.userInfo.gender
                    ) || "";
            }
            this.setState({
                fullName,
                phoneNumber,
                email: this.props.userInfo.email || "",
                address,
                selectedGender: genderOption,
            });
        } else if (type === "other") {
            this.setState({
                fullName: "",
                phoneNumber: "",
                email: "",
                address: "",
                selectedGender: "",
            });
        }
    };

    buildDataGender = (data) => {
        let result = [];
        if (data && data.length > 0) {
            data.forEach((item) => {
                let object = {};
                object.label = item.valueVi;
                object.value = item.keyMap;
                result.push(object);
            });
        }
        return result;
    };

    buildTimeBooking = (dataTime) => {
        if (!dataTime || _.isEmpty(dataTime)) return "";
        let time = dataTime.timeTypeData ? dataTime.timeTypeData.valueVi : "";
        let date = dataTime.date
            ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
            : "";
        return `${time} - ${date}`;
    };

    buildDoctorName = (dataTime) => {
        if (!dataTime || _.isEmpty(dataTime)) return "";
        let doctorName = dataTime.doctorData
            ? `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            : "";
        return doctorName;
    };

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = value;
        this.setState({
            ...stateCopy,
        });
    };

    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption,
        });
    };

    handleBookingForChange = (event) => {
        const value = event.target.value;
        this.setState({ bookingFor: value }, () => {
            this.setFormByBookingFor(value);
        });
    };

    handlePaymentMethodChange = (event) => {
        this.setState({ paymentMethod: event.target.value });
    };

    handleComfirmBooking = async () => {
        console.log("[BookingModal] props.clinicId:", this.props.clinicId);
        console.log("[BookingModal] props.specialtyId:", this.props.specialtyId);
        let {
            dataTime,
            specialtyId: propSpecialtyId,
            clinicId: propClinicId,
            doctor,
        } = this.props;
        let timeString = this.buildTimeBooking(dataTime);
        let doctorName = this.buildDoctorName(dataTime);

        let specialtyId =
            dataTime?.specialtyId ||
            dataTime?.doctorData?.specialtyId ||
            propSpecialtyId ||
            doctor?.specialtyId;
        let clinicId =
            dataTime?.clinicId ||
            dataTime?.doctorData?.clinicId ||
            propClinicId ||
            doctor?.clinicId;

        let reqData = {
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            selectedGender: this.state.selectedGender?.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            timeString: timeString,
            doctorName: doctorName,
            specialtyId,
            clinicId,
            bookingFor: this.state.bookingFor,
            paymentMethod: this.state.paymentMethod, // QR_BANK hoặc CASH
        };

        console.log("[BookingModal] reqData gửi đi:", reqData);

        // Debug log
        console.log("[BookingModal][handleComfirmBooking] reqData:", reqData);

        let res = await postBookAppointment(reqData);

        // Debug log
        console.log("[BookingModal][handleComfirmBooking] response:", res);

        if (res && res.errCode === 0) {
            if (
                this.state.paymentMethod === "QR_BANK" &&
                res.paymentType === "vietqr" &&
                res.qrUrl
            ) {
                this.setState({
                    qrUrl: res.qrUrl,
                    addInfo: res.addInfo,
                    price: res.price,
                    accountName: res.accountName,
                    accountNumber: res.accountNumber,
                    bank: res.bank,
                    bookingCode: res.bookingCode,
                    showQR: true,
                });
            } else {
                toast.success(
                    "Đặt lịch khám thành công! Vui lòng kiểm tra email."
                );
                this.props.closeBookingModal();
            }
        } else {
            toast.error(
                res && res.errMessage
                    ? res.errMessage
                    : "Đặt lịch khám thất bại!"
            );
        }
    };

    handleConfirmTransfer = async () => {
        const token = localStorage.getItem("token");
        // Debug log
        console.log("[BookingModal][handleConfirmTransfer] bookingCode:", this.state.bookingCode);
        try {
            let res = await axios.post(
                "/api/patient-confirm-payment",
                { bookingCode: this.state.bookingCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Debug log
            console.log("[BookingModal][handleConfirmTransfer] response:", res);
            if (res.data && res.data.errCode === 0) {
                toast.success(
                    "Đã xác nhận chuyển khoản! Vui lòng chờ xác nhận từ phòng khám."
                );
                this.setState({ showQR: false });
                this.props.closeBookingModal();
            } else {
                toast.error(res.data.errMessage || "Có lỗi, vui lòng thử lại!");
            }
        } catch (error) {
            console.log("[BookingModal][handleConfirmTransfer] error:", error);
            toast.error("Có lỗi khi xác nhận chuyển khoản!");
        }
    };

    render() {
        let doctorId = "";
        let { isOpenModalBooking, closeBookingModal, dataTime } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
        }
        const { bookingFor } = this.state;

        if (this.state.showQR) {
            return (
                <Modal
                    isOpen={isOpenModalBooking}
                    className={"booking-modal-container"}
                    centered
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header">
                            <span className="left">Thanh toán chuyển khoản</span>
                            <span className="right" onClick={closeBookingModal}>
                                <i className="fas fa-times"></i>
                            </span>
                        </div>
                        <div className="booking-modal-body text-center">
                            <h5>Quét mã QR để chuyển khoản</h5>
                            <img
                                src={this.state.qrUrl}
                                alt="QR chuyển khoản MB Bank"
                                style={{ maxWidth: 300 }}
                            />
                            <p>
                                <b>Số tiền:</b> {this.state.price} VNĐ
                            </p>
                            <p>
                                <b>Số tài khoản nhận:</b> {this.state.accountNumber} ({this.state.accountName} - {this.state.bank})
                            </p>
                            <p>
                                <b>Nội dung chuyển khoản:</b> <span style={{ color: "red" }}>{this.state.addInfo}</span>
                            </p>
                            <button
                                className="btn btn-success"
                                onClick={this.handleConfirmTransfer}
                            >
                                Tôi đã chuyển khoản
                            </button>
                        </div>
                    </div>
                </Modal>
            );
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
                                isShowDescription={false}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        {/* Chọn đặt cho ai */}
                        <div className="row mb-3">
                            <div className="col-12 booking-for-group">
                                <label className="section-label">Đặt cho ai?</label>
                                <div className="btn-group-toggle" data-toggle="buttons">
                                    <label className={`btn btn-booking-for ${bookingFor === "me" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            value="me"
                                            checked={bookingFor === "me"}
                                            onChange={this.handleBookingForChange}
                                        /> Đặt cho mình
                                    </label>
                                    <label className={`btn btn-booking-for ${bookingFor === "other" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            value="other"
                                            checked={bookingFor === "other"}
                                            onChange={this.handleBookingForChange}
                                        /> Đặt cho người khác
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* Chọn phương thức thanh toán */}
                        <div className="row mb-3">
                            <div className="col-12 payment-method-group">
                                <label className="section-label">Phương thức thanh toán</label>
                                <div className="btn-group-toggle" data-toggle="buttons">
                                    <label className={`btn btn-payment-method ${this.state.paymentMethod === "QR_BANK" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            id="payment_qr"
                                            name="paymentMethod"
                                            value="QR_BANK"
                                            checked={this.state.paymentMethod === "QR_BANK"}
                                            onChange={this.handlePaymentMethodChange}
                                        /> Chuyển khoản ngân hàng (QR)
                                    </label>
                                    <label className={`btn btn-payment-method ${this.state.paymentMethod === "CASH" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            id="payment_cash"
                                            name="paymentMethod"
                                            value="CASH"
                                            checked={this.state.paymentMethod === "CASH"}
                                            onChange={this.handlePaymentMethodChange}
                                        /> Tiền mặt tại phòng khám
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* ... các input khác giữ nguyên ... */}
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Họ tên</label>
                                <input
                                    className="form-control"
                                    value={this.state.fullName}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "fullName"
                                        )
                                    }
                                    placeholder="Nhập họ tên"
                                    disabled={bookingFor === "me"}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Số điện thoại</label>
                                <input
                                    className="form-control"
                                    value={this.state.phoneNumber}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "phoneNumber"
                                        )
                                    }
                                    placeholder="Nhập số điện thoại"
                                    disabled={bookingFor === "me"}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Giới tính</label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genderArr}
                                    placeholder="Chọn giới tính"
                                    isDisabled={bookingFor === "me"}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ email</label>
                                <input
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "email"
                                        )
                                    }
                                    placeholder="Nhập địa chỉ email"
                                    disabled={bookingFor === "me"}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ liên hệ</label>
                                <input
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "address"
                                        )
                                    }
                                    placeholder="Nhập địa chỉ liên hệ"
                                    disabled={bookingFor === "me"}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Lý do khám</label>
                                <input
                                    className="form-control"
                                    value={this.state.reason}
                                    onChange={(event) =>
                                        this.handleOnChangeInput(
                                            event,
                                            "reason"
                                        )
                                    }
                                    placeholder="Nhập lý do khám"
                                />
                            </div>
                            <div className="booking-modal-footer">
                                <button
                                    className="btn btn-primary"
                                    onClick={this.handleComfirmBooking}
                                >
                                    Xác nhận
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={closeBookingModal}
                                >
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
        genders: state.admin.genders,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BookingModal);