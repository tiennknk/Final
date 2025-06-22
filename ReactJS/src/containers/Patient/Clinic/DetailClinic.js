import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getDetailClinicById, getAllSpecialty } from "../../../services/userService";
import _ from "lodash";
import "./DetailClinic.scss";

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorClinic: [], // [{doctorId, specialtyId}]
            dataDetailClinic: {},
            specialties: [], // all specialties
            selectedSpecialtyId: "", // id chuyên khoa đang chọn
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailClinicById({ id: id });
            let specialtiesRes = await getAllSpecialty("ALL");
            let specialties = [];
            if (specialtiesRes && specialtiesRes.errCode === 0 && specialtiesRes.data) {
                specialties = specialtiesRes.data;
            }
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorClinic = [];
                if (data && !_.isEmpty(data)) {
                    // Giả sử doctorClinic là [{doctorId, specialtyId}]
                    if (data.doctorClinic && data.doctorClinic.length > 0) {
                        arrDoctorClinic = data.doctorClinic;
                    }
                }
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorClinic,
                    specialties,
                    selectedSpecialtyId: "", // mặc định show tất cả
                });
            }
        }
    }

    handleSpecialtyChange = (e) => {
        this.setState({ selectedSpecialtyId: e.target.value });
    }

    render() {
        let { arrDoctorClinic, dataDetailClinic, specialties, selectedSpecialtyId } = this.state;

        // Lọc danh sách bác sĩ theo chuyên khoa
        let filteredArr = arrDoctorClinic;
        if (selectedSpecialtyId) {
            filteredArr = arrDoctorClinic.filter(item => String(item.specialtyId) === String(selectedSpecialtyId));
        }

        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">
                    <div className="description-specialty">
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&
                            <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}></div>
                        }
                    </div>

                    <div style={{ margin: "20px 0" }}>
                        <label>Lọc theo chuyên khoa: </label>
                        <select onChange={this.handleSpecialtyChange} value={selectedSpecialtyId}>
                            <option value="">Tất cả chuyên khoa</option>
                            {specialties && specialties.length > 0 && specialties.map(spe =>
                                <option key={spe.id} value={spe.id}>{spe.name}</option>
                            )}
                        </select>
                    </div>

                    {filteredArr && filteredArr.length > 0 &&
                        filteredArr.map((item, index) => {
                            return (
                                <div className="doctor-card" key={item.doctorId}>
                                    <div className="doctor-left">
                                        <ProfileDoctor
                                            doctorId={item.doctorId}
                                            isShowDescriptionDoctor={true}
                                            isShowLinkDetail={true}
                                            isShowPrice={false}
                                        />
                                    </div>
                                    <div className="doctor-right">
                                        <DoctorSchedule doctorIdFromParent={item.doctorId} />
                                        <DoctorExtraInfo doctorIdFromParent={item.doctorId} />
                                    </div>
                                </div>
                            );
                        })
                    }
                    {(!filteredArr || filteredArr.length === 0) &&
                        <div style={{ textAlign: "center", margin: 20, color: "red" }}>Không có bác sĩ nào cho phòng khám này</div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);