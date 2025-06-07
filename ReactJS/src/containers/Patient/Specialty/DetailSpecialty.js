import React, {Component} from "react";
import {connect} from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getDetailSpecialtyById, getAllSpecialty } from "../../../services/userService";
import _ from "lodash";
import './DetailSpecialty.scss';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailSpecialtyById(id, 'ALL');
            let resProvinces = await getAllSpecialty('PROVINCE');
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    if (data.doctorSpecialty && data.doctorSpecialty.length > 0) {
                        arrDoctorId = data.doctorSpecialty.map(item => item.doctorId);
                    }
                }
                let dataProvince = resProvinces.data;
                if (dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createdAt: null,
                        keyMap: 'ALL',
                        type: 'PROVINCE',
                        valueVi: 'Toàn quốc',
                    });
                }
                this.setState({
                    dataDetailSpecialty: data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince ? dataProvince : []
                });
            }
        }
    }

    handleOnChangeSelect = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;
            let res = await getDetailSpecialtyById(id, location);
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    if (data.doctorSpecialty && data.doctorSpecialty.length > 0) {
                        arrDoctorId = data.doctorSpecialty.map(item => item.doctorId);
                    }
                }
                this.setState({
                    dataDetailSpecialty: data,
                    arrDoctorId: arrDoctorId,
                });
            }
        }
    }

    render() {
        let {arrDoctorId, dataDetailSpecialty, listProvince} = this.state;
        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">
                    <div className="description-specialty">
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) &&
                            <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}></div>
                        }
                    </div>
                    <div className="search-sp-doctor">
                        <select className="form-control" onChange={this.handleOnChangeSelect}>
                            {listProvince && listProvince.length > 0 &&
                                listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {item.valueVi}
                                        </option>
                                    );
                                })
                            }
                        </select>
                        {arrDoctorId && arrDoctorId.length > 0 &&
                            arrDoctorId.map((doctorId, index) => {
                                return (
                                    <div className="each-doctor" key={index}>
                                        <div className="doctor-info">
                                            <ProfileDoctor
                                                doctorId={doctorId}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            />
                                        </div>
                                        <div className="doctor-schedule">
                                            <DoctorSchedule doctorIdFromParent={doctorId} />
                                        </div>
                                        <div className="doctor-extra-info">
                                            <DoctorExtraInfo doctorIdFromParent={doctorId} />
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);