import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import Select from 'react-select';
import DatePicker from '../../../components/Input/DatePicker';
import { dateFormat } from '../../../utils';
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: null,
            currentDate: '',
            rangeTime: [],
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            });
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({
                    ...item,
                    isSelected: false,
                }));
            }
            this.setState({
                rangeTime: data,
            });
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.forEach((item) => {
                let object = {};
                object.label = `${item.firstName} ${item.lastName}`;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        });
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) {
                    return { ...item, isSelected: !item.isSelected };
                }
                return item;
            });
            this.setState({ rangeTime });
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        if (!currentDate) {
            toast.error("Ngày không tồn tại!");
            return;
        }
        if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
            toast.error("Bác sĩ không tồn tại!");
            return;
        }

        let formattedDate = new Date(currentDate).getTime();
        let selectedTime = rangeTime.filter(item => item.isSelected === true);
        if (!selectedTime.length) {
            toast.error("Vui lòng chọn khung giờ!");
            return;
        }

        let result = selectedTime.map(schedule => ({
            doctorId: selectedDoctor.value,
            date: formattedDate,
            timeType: schedule.keyMap
        }));

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formattedDate: formattedDate
        });

        if (res && res.errCode === 0) {
            toast.success("Lưu lịch thành công!");
            this.setState({
                rangeTime: this.state.rangeTime.map(item => ({ ...item, isSelected: false }))
            });
        } else {
            toast.error(res.errMessage || "Lưu lịch thất bại!");
        }
    }

    render() {
        let { rangeTime } = this.state;
        return (
            <React.Fragment>
                <div className="manage-schedule-container">
                    <div className="m-s-title">
                        <FormattedMessage id="manage-schedule.title" />
                    </div>
                    <div className="container">
                        <div className="row align-items-end select-row">
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="manage-schedule.select-doctor" /></label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                    placeholder={<FormattedMessage id="manage-schedule.select-doctor-placeholder" />}
                                    isClearable={true}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                                <DatePicker
                                    value={this.state.currentDate}
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    minDate={new Date()}
                                />
                            </div>
                        </div>
                        <div className="pick-hour-container">
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item) => {
                                    return (
                                        <button
                                            key={item.id}
                                            className={item.isSelected ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {item.valueVi || item.valueEn || item.value}
                                        </button>
                                    );
                                })}
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary btn-save-schedule'
                                onClick={this.handleSaveSchedule}>
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);