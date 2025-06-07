import React, { Component } from "react";
import "./DoctorExtraInfo.scss";
import { getExtraInfoDoctorById } from "../../../services/userService";
import NumberFormat from 'react-number-format';

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfo: false,
            extraInfo: {},
        };
    }

    showHideDetailInfo = (status) => {
        this.setState({ isShowDetailInfo: status });
    };

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data,
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data,
                });
            }
        }
    }

    render() {
        const { isShowDetailInfo, extraInfo } = this.state;

        return (
            <div className="doctor-extra-info-container">
                <div className="content-up">
                    <div className="text-address"></div>
                    <div className="name-clinic">
                        {extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ''}
                    </div>
                    <div className="detail-address">
                        {extraInfo && extraInfo.addressClinic ? extraInfo.addressClinic : ''}
                    </div>
                </div>
                <div className="content-down">
                    {!isShowDetailInfo && (
                        <div className="short-info">
                            <span>
                                Giá khám:&nbsp;
                                {extraInfo && extraInfo.priceTypeData &&
                                    <NumberFormat
                                        value={extraInfo.priceTypeData.valueVi}
                                        className="currency"
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={' VND'}
                                    />
                                }
                            </span>
                            <span
                                className="detail-link"
                                onClick={() => this.showHideDetailInfo(true)}
                            >
                                Xem chi tiết
                            </span>
                        </div>
                    )}
                    {isShowDetailInfo && (
                        <div className="extra-detail-info">
                            <div className="detail-info-row">
                                <span className="left">
                                    Giá khám
                                </span>
                                <span className="right">
                                    {extraInfo && extraInfo.priceTypeData &&
                                        <NumberFormat
                                            value={extraInfo.priceTypeData.valueVi}
                                            className="currency"
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={' VND'}
                                        />
                                    }
                                </span>
                            </div>
                            <div className="note">
                                {extraInfo && extraInfo.note ? extraInfo.note : ''}
                            </div>
                            <div className="payment">
                                Phương thức thanh toán:&nbsp;
                                {extraInfo && extraInfo.paymentTypeData && extraInfo.paymentTypeData.valueVi}
                            </div>
                            <div
                                className="hide-detail-link"
                                onClick={() => this.showHideDetailInfo(false)}
                                style={{ color: '#007bff', cursor: 'pointer', marginTop: '10px', display: 'inline-block' }}
                            >
                                Ẩn thông tin
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default DoctorExtraInfo;