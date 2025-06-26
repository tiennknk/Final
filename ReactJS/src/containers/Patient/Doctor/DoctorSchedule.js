import React, { Component } from "react";
import "./DoctorSchedule.scss";
import moment from "moment";
import "moment/locale/vi";
import { getScheduleByDate, getBookedTimeTypesByDate } from "../../../services/userService";
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
            bookedTimeTypes: [],
        };
    }

    async componentDidMount() {
        let allDays = this.setarrDays();
        let selectedDate = allDays[0]?.value || null;
        this.setState({ allDays, selectedDate });

        if (this.props.doctorIdFromParent) {
            await this.loadTimeAndBooked(this.props.doctorIdFromParent, selectedDate);
        }
        console.log('detailDoctor:', this.props.detailDoctor);
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let allDays = this.setarrDays();
            let selectedDate = allDays[0]?.value || null;
            this.setState({ allDays, selectedDate });
            if (this.props.doctorIdFromParent && allDays.length > 0) {
                await this.loadTimeAndBooked(this.props.doctorIdFromParent, selectedDate);
            }
        }
        if (prevState.selectedDate !== this.state.selectedDate && this.props.doctorIdFromParent) {
            await this.loadTimeAndBooked(this.props.doctorIdFromParent, this.state.selectedDate);
        }
    }

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

    handleOnChangeSelect = (event) => {
        let date = event.target.value || event.value;
        this.setState({ selectedDate: date });
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

    loadTimeAndBooked = async (doctorId, date) => {
        let [scheduleRes, bookedRes] = await Promise.all([
            getScheduleByDate(doctorId, date),
            getBookedTimeTypesByDate(doctorId, date)
        ]);
        this.setState({
            allAvailableTime: scheduleRes && scheduleRes.errCode === 0 ? scheduleRes.data : [],
            bookedTimeTypes: bookedRes && bookedRes.errCode === 0 ? bookedRes.data : [],
        });
    };

    filterRealtimeAndBookedSlots = (slots, selectedDate, bookedTimeTypes) => {
        if (!slots || slots.length === 0) return [];
        const now = moment();
        const today = moment().startOf("day").valueOf();
        return slots.filter(item => {
            if (bookedTimeTypes.includes(item.timeType)) return false;
            if (Number(selectedDate) === today) {
                let timeStr = item.timeTypeData?.valueVi || "";
                let startHour = parseInt(timeStr.split(":")[0], 10);
                if (isNaN(startHour)) return true;
                return startHour > now.hour();
            }
            return true;
        });
    };

    render() {
        let { allDays, allAvailableTime, selectedDate, isOpenModalBooking, dataScheduleTimeModal, bookedTimeTypes } = this.state;
        const { detailDoctor } = this.props;
        const clinicId = detailDoctor?.doctorInfo?.[0]?.clinicId;
        const specialtyId = detailDoctor?.doctorInfo?.[0]?.specialtyId;
        console.log('clinicId:', clinicId, 'specialtyId:', specialtyId);
        const filteredSlots = this.filterRealtimeAndBookedSlots(allAvailableTime, selectedDate, bookedTimeTypes);

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
                            {filteredSlots && filteredSlots.length > 0 ? (
                                <>
                                    <div className="time-content-btns">
                                        {filteredSlots.map((item, index) => {
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
                isOpenModalBooking={isOpenModalBooking}
                closeBookingModal={this.closeBookingModal}
                dataTime={dataScheduleTimeModal}
                clinicId={detailDoctor?.doctorInfo?.[0]?.clinicId}
                specialtyId={detailDoctor?.doctorInfo?.[0]?.specialtyId}
                doctor={detailDoctor}
                />
            </>
        );
    }
}

export default DoctorSchedule;