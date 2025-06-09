import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getDetailClinicById, getAllClinic } from "../../../services/userService";
import _ from "lodash";

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailClinicById({
                id: id
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    if (data.doctorClinic && data.doctorClinic.length > 0) {
                        arrDoctorId = data.doctorClinic.map(item => item.doctorId);
                    }
                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                });
            }
        }
    }

    render() {
        let { arrDoctorId, dataDetailClinic } = this.state;
        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">
                    <div className="description-specialty">
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}></div>
                        }
                    </div>
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
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);