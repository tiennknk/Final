import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfo from "../Doctor/DoctorExtraInfo";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getDetailSpecialtyById, getAllCodeService, getDetailInfoDoctor } from "../../../services/userService";
import _ from "lodash";

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorProvince: [],
            dataDetailSpecialty: {},
            listProvince: [],
            selectedProvince: 'ALL',
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailSpecialtyById(id, 'ALL');
            let resProvinces = await getAllCodeService('PROVINCE');
            let selectedProvince = 'ALL';

            let arrDoctorProvince = [];
            if (res && res.errCode === 0) {
                let data = res.data;
                if (data && !_.isEmpty(data)) {
                    if (data.doctorSpecialty && data.doctorSpecialty.length > 0) {
                        // Thêm: fetch detailDoctor cho từng bác sĩ
                        arrDoctorProvince = await Promise.all(
                            data.doctorSpecialty.map(async item => {
                                let detailRes = await getDetailInfoDoctor(item.doctorId);
                                return {
                                    doctorId: item.doctorId,
                                    province: item.province,
                                    detailDoctor: detailRes && detailRes.errCode === 0 ? detailRes.data : {},
                                };
                            })
                        );
                    }
                }
            }
            let dataProvince = resProvinces.data;
            if (dataProvince && dataProvince.length > 0) {
                dataProvince.unshift({
                    keyMap: 'ALL',
                    valueVi: 'Tất cả địa điểm',
                });
            }
            this.setState({
                dataDetailSpecialty: res.data,
                arrDoctorProvince: arrDoctorProvince,
                listProvince: dataProvince ? dataProvince : [],
                selectedProvince
            });
        }
    }

    handleOnChangeSelect = async (event) => {
        let selectedProvince = event.target.value;
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailSpecialtyById(id, selectedProvince);

            let arrDoctorProvince = [];
            if (res && res.errCode === 0) {
                let data = res.data;
                if (data && !_.isEmpty(data)) {
                    if (data.doctorSpecialty && data.doctorSpecialty.length > 0) {
                        // Thêm: fetch detailDoctor cho từng bác sĩ khi lọc tỉnh
                        arrDoctorProvince = await Promise.all(
                            data.doctorSpecialty.map(async item => {
                                let detailRes = await getDetailInfoDoctor(item.doctorId);
                                return {
                                    doctorId: item.doctorId,
                                    province: item.province,
                                    detailDoctor: detailRes && detailRes.errCode === 0 ? detailRes.data : {},
                                };
                            })
                        );
                    }
                }
                this.setState({
                    dataDetailSpecialty: data,
                    arrDoctorProvince: arrDoctorProvince,
                    selectedProvince
                });
            }
        }
    }

    render() {
        let { arrDoctorProvince, dataDetailSpecialty, listProvince, selectedProvince } = this.state;
        let doctorsToShow = arrDoctorProvince;

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
                        <div className="filter-location compact-location-filter">
                            <label htmlFor="province-select">Lọc theo địa điểm:</label>
                            <select
                                id="province-select"
                                className="form-control"
                                onChange={this.handleOnChangeSelect}
                                value={selectedProvince}
                            >
                                {listProvince && listProvince.length > 0 &&
                                    listProvince.map((item, index) => (
                                        <option key={index} value={item.keyMap}>
                                            {item.valueVi}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        {doctorsToShow && doctorsToShow.length > 0 ? (
                            doctorsToShow.map((item, index) => (
                                <div className="each-doctor-compact" key={index}>
                                    <div className="doctor-basic-info">
                                        <ProfileDoctor
                                            doctorId={item.doctorId}
                                            isShowDescriptionDoctor={true}
                                            isShowLinkDetail={true}
                                            isShowPrice={false}
                                        />
                                    </div>
                                    <div className="doctor-box-right">
                                        <div className="doctor-schedule-compact">
                                        <DoctorSchedule
    doctorIdFromParent={item.doctorId}
    detailDoctor={item.detailDoctor}
    clinicId={item.detailDoctor?.doctorInfo?.[0]?.clinicId}
    specialtyId={item.detailDoctor?.doctorInfo?.[0]?.specialtyId}
/>
                                        </div>
                                        <div className="doctor-extra-info-compact">
                                            <DoctorExtraInfo doctorIdFromParent={item.doctorId} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-section">Không có bác sĩ nào phù hợp</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);