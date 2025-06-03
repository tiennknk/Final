import React, {Component} from "react";
import {connect} from "react-redux";
import './ProfileDoctor.scss';
import { getProfileDoctorById } from "../../../services/userService";
import NumberFormat from "react-number-format";

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

    async componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        let { dataProfile } = this.state;
        let nameVi = '';
        if (dataProfile && dataProfile.PositionData) {
            nameVi = dataProfile.PositionData.valueVi;
        }
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
    {dataProfile && dataProfile.firstName ? `${dataProfile.lastName} ${dataProfile.firstName}` : ''}
</div>
                        <div className="down">
                            {dataProfile && dataProfile.Markdown
                            && dataProfile.Markdown.description
                            &&
                            <span>
                                {dataProfile.Markdown.description}
                            </span>}
                        </div>
                    </div>
                </div>
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
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
