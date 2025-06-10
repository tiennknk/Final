import React, {Component} from "react";
import {connect} from "react-redux";
import "./BookingModal.scss";
import {Modal} from "reactstrap";
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
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            gender: '',
            timeType: '',
            genderArr: [],
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
    }
    
    buildDataGender = (data) => {
        let result = [];
        if (data && data.length > 0) {
            data.map((item) => {
                let object = {};
                object.label = item.valueVi;
                object.value = item.keyMap;
                result.push(object);
                return null;
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

    async componentDidUpdate(prevProps, prevState, snapshot) {
        // Khi dataTime thay đổi, cập nhật doctorId và timeType
        if (prevProps.dataTime !== this.props.dataTime) {
            let {dataTime} = this.props;
            if (dataTime && !_.isEmpty(dataTime)) {
                let doctorId = dataTime.doctorId;
                let timeType = dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType,
                });
            }
        }
        // Khi genders thay đổi, cập nhật lại state.genderArr (chỉ tiếng Việt)
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                genderArr: this.buildDataGender(this.props.genders),
            });
        }
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        let stateCopy = {...this.state};
        stateCopy[id] = value;
        this.setState({
            ...stateCopy
        });
    }

    handleaOnchangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        });
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption,
        });
    }

    handleComfirmBooking = async () => {
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);
        let res = await postBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            timeString: timeString,
            doctorName: doctorName,
        });

        if (res && res.errCode === 0) {
            toast.success('Đặt lịch khám thành công!');
            this.props.closeBookingModal();
        }
        else {
            toast.error('Đặt lịch khám thất bại!');
        }
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
                                isShowDescription={false}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Họ tên</label>
                                <input
                                    className="form-control"
                                    value={this.state.fullName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                    placeholder="Nhập họ tên"
                                />
                            </div>
                            <div className="col-6 form-group" >
                                <label>Số điện thoại</label>
                                <input
                                    className="form-control"
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Giới tính</label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genderArr}
                                    placeholder="Chọn giới tính"
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ email</label>
                                <input
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    placeholder="Nhập địa chỉ email"
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Địa chỉ liên hệ</label>
                                <input
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    placeholder="Nhập địa chỉ liên hệ"
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
                            <div className="col-6 form-group">
                                <label>Ngày sinh</label>
                                <DatePicker
                                    className="form-control"
                                    value={this.state.birthday}
                                    onChange={this.handleaOnchangeDatePicker}
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
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);