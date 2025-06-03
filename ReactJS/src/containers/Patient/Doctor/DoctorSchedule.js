import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from "moment";
import "moment/locale/vi";
import { getScheduleByDate } from "../../../services/userService";
import localization from "../../../utils/Localization";
import BookingModal from "./BookingModal";

moment.locale("vi");

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            selectedDate: null,
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
        };
    }

    componentDidMount = async () => {
        let allDays = this.setarrDays();
        this.setState({ allDays, selectedDate: allDays[0]?.value || null });
        if (this.props.doctorIdFromParent && allDays.length > 0) {
            await this.fetchAvailableTime(this.props.doctorIdFromParent, allDays[0].value);
        }
    };

    componentDidUpdate = async (prevProps) => {
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let allDays = this.setarrDays();
            this.setState({ allDays, selectedDate: allDays[0]?.value || null });
            if (this.props.doctorIdFromParent && allDays.length > 0) {
                await this.fetchAvailableTime(this.props.doctorIdFromParent, allDays[0].value);
            }
        }
    };

    setarrDays = () => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let currentDate = moment().add(i, "days").startOf("day").valueOf();
            let label = moment(currentDate).format("dddd - DD/MM");
            allDays.push({
                label: this.capitalizeFirstLetter(label),
                value: currentDate,
            });
        }
        return allDays;
    };

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    handleOnChangeSelect = async (event) => {
        let date = event.value || event.target.value;
        this.setState({ selectedDate: date });
        await this.fetchAvailableTime(this.props.doctorIdFromParent, date);
    };

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time,
        });
    };

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false,
        });
    };

    fetchAvailableTime = async (doctorId, date) => {
        let res = await getScheduleByDate(doctorId, date);
        if (res && res.errCode === 0) {
            this.setState({
                allAvailableTime: res.data ? res.data : [],
            });
        } else {
            this.setState({ allAvailableTime: [] });
        }
    };

    render() {
        let { allDays, allAvailableTime, selectedDate, isOpenModalBooking, dataScheduleTimeModal } = this.state;

        return (
            <>
            <div className="doctor-schedule-container">
                <div className="all-schedule">
                    <select value={selectedDate || ''} onChange={this.handleOnChangeSelect}>
                        {allDays && allDays.length > 0 &&
                            allDays.map((item, index) => (
                                <option key={index} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="all-available-time">
                    <div className="text-calendar">
                        <span>{localization.patient.schedule}</span>
                    </div>
                    <div className="time-content">
                        {allAvailableTime && allAvailableTime.length > 0 ? (
                            <>
                                <div className="time-content-btns">
                                    {allAvailableTime.map((item, index) => {
                                        const timesDisplay =
                                            item.timeTypeData?.valueVi ||
                                            item.timeTypeData?.valueEn ||
                                            item.timeType ||
                                            "";
                                        return (
                                            <button
                                                key={index}
                                                className="btn btn-primary"
                                                onClick={() => this.handleClickScheduleTime(item)}
                                            >
                                                {timesDisplay}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="book-free">
                                    Chọn <span role="img" aria-label="mouse">🖱️</span> và đặt (miễn phí)
                                </div>
                            </>
                        ) : (
                            <span className="no-schedule">{localization.patient.noAvailable}</span>
                        )}
                    </div>
                </div>
            </div>
            <BookingModal 
            isOpenModalBooking = {isOpenModalBooking}
            closeBookingModal = {this.closeBookingModal}
            dataTime = {dataScheduleTimeModal}
            />
            </>
        );
    }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);