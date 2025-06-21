import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import _ from "lodash";
import ProfileDoctor from '../Doctor/ProfileDoctor';
import DatePicker from "../../../components/Input/DatePicker";
import * as actions from "../../../store/actions";
import Select from 'react-select';
import { toast } from "react-toastify";
import { postBookAppointment } from "../../../services/userService";
import moment from "moment";

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingFor: 'me',
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            selectedGender: '',
            doctorId: '',
            gender: '',
            timeType: '',
            genderArr: [],
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        // Gọi setFormByBookingFor khi đã có genderArr ở componentDidUpdate
        console.log('[BookingModal][componentDidMount] userInfo:', this.props.userInfo);
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
        // Khi genders thay đổi, build lại genderArr và set mặc định
        if (prevProps.genders !== this.props.genders) {
            const genderArr = this.buildDataGender(this.props.genders);
            this.setState({ genderArr }, () => {
                this.setFormByBookingFor(this.state.bookingFor);
            });
        }
        // Nếu info user hoặc chế độ đặt cho ai thay đổi thì cũng set lại form (nếu genderArr đã có)
        if (
            (prevProps.userInfo !== this.props.userInfo ||
            prevState.bookingFor !== this.state.bookingFor)
            && this.state.genderArr.length > 0
        ) {
            this.setFormByBookingFor(this.state.bookingFor);
            console.log('[BookingModal][componentDidUpdate] userInfo changed:', this.props.userInfo);
        }
    }

    setFormByBookingFor = (type) => {
        if (type === 'me' && this.props.userInfo) {
            // Ghép họ tên nếu có both firstName, lastName
            const fullName = [
                this.props.userInfo.firstName,
                this.props.userInfo.lastName
            ].filter(Boolean).join(' ').trim();

            // Lấy đúng trường phonenumber và address (giống DB)
            const phoneNumber = this.props.userInfo.phonenumber || this.props.userInfo.phoneNumber || '';
            const address = this.props.userInfo.address || '';
            // Chọn đúng object gender cho react-select
            let genderOption = '';
            if (this.state.genderArr.length > 0 && this.props.userInfo.gender) {
                genderOption =
                    this.state.genderArr.find(g => g.value === this.props.userInfo.gender) || '';
            }
            this.setState({
                fullName,
                phoneNumber,
                email: this.props.userInfo.email || '',
                address,
                selectedGender: genderOption,
            });
        } else if (type === 'other') {
            this.setState({
                fullName: '',
                phoneNumber: '',
                email: '',
                address: '',
                selectedGender: '',
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
    }

    buildTimeBooking = (dataTime) => {
        if (!dataTime || _.isEmpty(dataTime)) return '';
        let time = dataTime.timeTypeData ? dataTime.timeTypeData.valueVi : '';
        let date = dataTime.date
            ? moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
            : '';
        return `${time} - ${date}`;
    }

    buildDoctorName = (dataTime) => {
        if (!dataTime || _.isEmpty(dataTime)) return '';
        let doctorName = dataTime.doctorData
            ? `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            : '';
        return doctorName;
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = value;
        this.setState({
            ...stateCopy
        });
        console.log(`[BookingModal][handleOnChangeInput] ${id}:`, value);
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption,
        });
        console.log('[BookingModal][handleChangeSelect] selectedGender:', selectedOption);
    }

    handleBookingForChange = (event) => {
        const value = event.target.value;
        console.log('[BookingModal][handleBookingForChange] bookingFor:', value);
        this.setState({ bookingFor: value }, () => {
            this.setFormByBookingFor(value);
        });
    }

    handleComfirmBooking = async () => {
        let { dataTime, specialtyId: propSpecialtyId, clinicId: propClinicId, doctor } = this.props;
        let timeString = this.buildTimeBooking(dataTime);
        let doctorName = this.buildDoctorName(dataTime);

        let specialtyId = dataTime?.specialtyId
            || dataTime?.doctorData?.specialtyId
            || propSpecialtyId
            || doctor?.specialtyId;
        let clinicId = dataTime?.clinicId
            || dataTime?.doctorData?.clinicId
            || propClinicId
            || doctor?.clinicId;

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
            bookingFor: this.state.bookingFor
        };

        console.log('[BookingModal][handleComfirmBooking] reqData:', reqData);

        let res = await postBookAppointment(reqData);

        console.log('[BookingModal][handleComfirmBooking] API response:', res);

        if (res && res.errCode === 0) {
            toast.success('Đặt lịch khám thành công!');
            this.props.closeBookingModal();
        } else {
            toast.error(res && res.errMessage ? res.errMessage : 'Đặt lịch khám thất bại!');
        }
    }

    render() {
        let doctorId = '';
        let { isOpenModalBooking, closeBookingModal, dataTime } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
        }
        const { bookingFor } = this.state;
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
                        <div className="row mb-2">
                            <div className="col-12">
                                <label>
                                    <input
                                        type="radio"
                                        value="me"
                                        checked={bookingFor === 'me'}
                                        onChange={this.handleBookingForChange}
                                        style={{ marginRight: 4 }}
                                    /> Đặt cho mình
                                </label>
                                <label style={{ marginLeft: 20 }}>
                                    <input
                                        type="radio"
                                        value="other"
                                        checked={bookingFor === 'other'}
                                        onChange={this.handleBookingForChange}
                                        style={{ marginRight: 4 }}
                                    /> Đặt cho người khác
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Họ tên</label>
                                <input
                                    className="form-control"
                                    value={this.state.fullName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                    placeholder="Nhập họ tên"
                                    disabled={bookingFor === 'me'}
                                />
                            </div>
                            <div className="col-6 form-group" >
                                <label>Số điện thoại</label>
                                <input
                                    className="form-control"
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                    placeholder="Nhập số điện thoại"
                                    disabled={bookingFor === 'me'}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Giới tính</label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genderArr}
                                    placeholder="Chọn giới tính"
                                    isDisabled={bookingFor === 'me'}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ email</label>
                                <input
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    placeholder="Nhập địa chỉ email"
                                    disabled={bookingFor === 'me'}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ liên hệ</label>
                                <input
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    placeholder="Nhập địa chỉ liên hệ"
                                    disabled={bookingFor === 'me'}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Lý do khám</label>
                                <input
                                    className="form-control"
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                    placeholder="Nhập lý do khám"
                                />
                            </div>
                            <div className="booking-modal-footer">
                                <button className="btn btn-primary" onClick={() => this.handleComfirmBooking()}>
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
        genders: state.admin.genders,
        userInfo: state.user.userInfo,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);