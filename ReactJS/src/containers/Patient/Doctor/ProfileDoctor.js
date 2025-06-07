import React, {Component} from "react";
import {connect} from "react-redux";
import './ProfileDoctor.scss';
import { getProfileDoctorById } from "../../../services/userService";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
import {Link} from "react-router-dom";

class ProfileDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {},
        };
    }

    async componentDidMount() {
        let data = await this.getInfoDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data,
        });
    }

    getInfoDoctor = async (doctorId) => {
        let result = {};
        if (doctorId) {
            let res = await getProfileDoctorById(doctorId);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState) {
        // Thêm: Nếu đổi doctorId thì load lại profile
        if (prevProps.doctorId !== this.props.doctorId) {
            let data = await this.getInfoDoctor(this.props.doctorId);
            this.setState({
                dataProfile: data,
            });
        }
    }

    // Thêm: Hàm render thông tin giờ khám đẹp (giờ - thứ - ngày)
    renderTimeBooking = (dataTime) => {
        if (!dataTime || _.isEmpty(dataTime)) return null;
        // timeTypeData.valueVi là giờ, date là timestamp dạng số
        let time = dataTime.timeTypeData ? dataTime.timeTypeData.valueVi : '';
        let date = dataTime.date
            ? moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
            : '';
        return (
            <div className="doctor-time">
                {time && <span>{time}</span>}
                {time && date && <span> - </span>}
                {date && <span>{date}</span>}
            </div>
        );
    }

    render() {
        let { dataProfile } = this.state;
        let { isShowDescription = true, dataTime, isShowLinkDetail, isShowPrice, doctorId } = this.props;
        let fullName = dataProfile && dataProfile.firstName
            ? `${dataProfile.lastName} ${dataProfile.firstName}`
            : '';

        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div className="content-left">
                        <div
                            className="image"
                            style={{ backgroundImage: `url(${dataProfile.image})` }}
                        ></div>
                    </div>
                    <div className="content-right">
                        <div className="up">
                            {fullName}
                        </div>
                        <div className="down">
                            {isShowDescription === true ? (
                                <>
                                    {dataProfile && dataProfile.Markdown
                                    && dataProfile.Markdown.description
                                    &&
                                    <span>
                                        {dataProfile.Markdown.description}
                                    </span>}
                                </>
                            ) : (
                                // Thêm: render thông tin giờ khám khi là modal booking
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {isShowLinkDetail && (
                    <div className="view-detail-doctor">
                        <Link to={`/detail-doctor/${doctorId}`}>Xem chi tiết</Link>
                    </div>
                )}
                {isShowPrice === true && 
                <div className="price">
                    Giá khám:&nbsp;
                    {dataProfile && dataProfile.Doctor_Info && dataProfile.Doctor_Info.priceTypeData &&
                        <NumberFormat
                            value={dataProfile.Doctor_Info.priceTypeData.valueVi}
                            className="currency"
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' VND'}
                        />
                    }
                </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);