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
            selectedSpecialtyId: "all", // id chuyên khoa đang chọn
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            // Lấy dữ liệu chi tiết phòng khám
            let res = await getDetailClinicById({ id: id });
            console.log("Dữ liệu phòng khám:", res);

            // Lấy danh sách chuyên khoa
            let specialtiesRes = await getAllSpecialty();
            console.log("Dữ liệu chuyên khoa:", specialtiesRes);

            let specialties = [];
            if (specialtiesRes && specialtiesRes.errCode === 0 && Array.isArray(specialtiesRes.data)) {
                specialties = specialtiesRes.data;
            } else {
                console.log('Lỗi khi lấy danh sách chuyên khoa:', specialtiesRes);
            }

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorClinic = [];
                if (data && !_.isEmpty(data)) {
                    if (data.doctorClinic && data.doctorClinic.length > 0) {
                        arrDoctorClinic = data.doctorClinic;
                    }
                }
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorClinic,
                    specialties,
                    selectedSpecialtyId: "all", // mặc định show tất cả
                });
            }
        }
    }

    handleSpecialtyChange = (e) => {
        console.log("Chuyên khoa đã chọn:", e.target.value); // Kiểm tra giá trị người dùng chọn
        this.setState({ selectedSpecialtyId: e.target.value });
    }

    render() {
        let { arrDoctorClinic, dataDetailClinic, specialties, selectedSpecialtyId } = this.state;

        // Log dữ liệu bác sĩ
        console.log("Danh sách bác sĩ:", arrDoctorClinic);

        // Lọc bác sĩ theo chuyên khoa
        let filteredDoctors = arrDoctorClinic;
        if (selectedSpecialtyId !== 'all') {
            filteredDoctors = arrDoctorClinic.filter(item =>
                String(item.specialtyId) === String(selectedSpecialtyId)
            );
        }

        // Log dữ liệu sau khi lọc
        console.log("Bác sĩ sau khi lọc:", filteredDoctors);

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
                            <option value="all">Tất cả chuyên khoa</option>
                            {specialties && specialties.length > 0 && specialties.map(spe =>
                                <option key={spe.id} value={spe.id}>{spe.name}</option>
                            )}
                        </select>
                    </div>

                    {filteredDoctors && filteredDoctors.length > 0 &&
                        filteredDoctors.map((item, index) => {
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
                    {(!filteredDoctors || filteredDoctors.length === 0) &&
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
