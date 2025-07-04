import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { getAllSpecialty } from '../../../services/userService';
import './SectionList.scss';

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
            specialties: [],
            selectedSpecialty: 'all',
        };
    }

    async componentDidMount() {
        this.props.loadTopDoctors();

        // Lấy danh sách chuyên khoa
        let res = await getAllSpecialty();
        if (res && res.errCode === 0 && Array.isArray(res.data)) {
            this.setState({ specialties: res.data });
        } else if (res && res.errCode === 0 && res.data && Array.isArray(res.data.data)) {
            this.setState({ specialties: res.data.data });
        } else {
            console.log('Lỗi khi lấy danh sách chuyên khoa:', res);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.topDoctors !== this.props.topDoctors) {
            this.setState({
                arrDoctors: this.props.topDoctors || [],
            });
        }
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    }

    handleSelectSpecialty = (e) => {
        this.setState({ selectedSpecialty: e.target.value });
    }

    render() {
        let arrDoctors = this.state.arrDoctors || [];
        const { specialties, selectedSpecialty } = this.state;

        // Log doctor mẫu KHÔNG có trường image để debug filter
        if (arrDoctors.length > 0) {
            const { image, ...doctorNoImage } = arrDoctors[0];
            console.log("==== Doctor mẫu không image ====");
            console.log(JSON.stringify(doctorNoImage, null, 2));
        }

        // Log dữ liệu để debug
        console.log("==== Debug arrDoctors ====");
        console.log(arrDoctors);
        console.log("==== Debug specialties ====");
        console.log(specialties);
        console.log("==== selectedSpecialty ====");
        console.log(selectedSpecialty);

        // Lọc theo chuyên khoa nếu đã chọn (so sánh theo string)
        let filteredDoctors = arrDoctors;
if (selectedSpecialty !== 'all') {
    filteredDoctors = arrDoctors.filter(doctor =>
        Array.isArray(doctor.doctorInfo) &&
        doctor.doctorInfo.some(info =>
            String(info.specialtyId) === String(selectedSpecialty)
        )
    );
}

        // Log kết quả filter để kiểm tra
        console.log("==== filteredDoctors ====");
        console.log(filteredDoctors);

        return (
            <div id="doctor-section" className="section-list-page">
                <div className="section-list-title" style={{display:'flex', alignItems:'center', gap: 20}}>
                    <span>Bác sĩ nổi bật</span>
                    <select
                        value={selectedSpecialty}
                        onChange={this.handleSelectSpecialty}
                        style={{
                            marginLeft: 16,
                            borderRadius: 6,
                            padding: "7px 15px",
                            border: "1px solid #e0e0e0",
                            fontSize: 15
                        }}
                    >
                        <option value="all">Tất cả chuyên khoa</option>
                        {specialties.map(s => (
                            <option value={s.id} key={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div className="section-list">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((item, index) => {
                            let imageBase64 = '';
                            if (item.image) {
                                imageBase64 = `data:image/jpeg;base64,${item.image}`;
                            }
                            return (
                                <div
                                    className="section-card doctor-card"
                                    key={item.id || index}
                                    onClick={() => this.handleViewDetailDoctor(item)}
                                >
                                    <div className="section-img doctor-img">
                                        <img src={imageBase64} alt={item.lastName + ' ' + item.firstName} />
                                    </div>
                                    <div className="section-info doctor-info" style={{alignItems: 'center', textAlign: 'center'}}>
                                        <div className="section-name doctor-name">
                                            {item.lastName} {item.firstName}
                                        </div>
                                        <div className="doctor-position">{item.positionData?.valueVi || ''}</div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-section">Không có bác sĩ nổi bật</div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.admin.isLoggedIn,
    topDoctors: state.admin.topDoctors,
});

const mapDispatchToProps = dispatch => ({
    loadTopDoctors: () => dispatch(actions.fetchTopDoctors()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));