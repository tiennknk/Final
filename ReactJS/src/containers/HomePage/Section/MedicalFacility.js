import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacilityy.scss';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
            filterLocation: 'all'
        };
        this._isMounted = false;
    }

    async componentDidMount() {
        this._isMounted = true;
        let res = await getAllClinic();
        if (this._isMounted && res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data || []
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
    }

    handleFilterChange = (e) => {
        this.setState({ filterLocation: e.target.value });
    }

    getLocations = () => {
        const { dataClinics } = this.state;
        const locations = dataClinics.map(clinic => clinic.address).filter(Boolean);
        return Array.from(new Set(locations));
    }

    render() {
        const { dataClinics, filterLocation } = this.state;
        const filteredClinics = filterLocation === 'all'
            ? dataClinics
            : dataClinics.filter(clinic => clinic.address === filterLocation);

        return (
            <div id="clinic-section" className="clinic-list-page">
                <h2 className="clinic-list-title">Danh sách Phòng Khám</h2>
                <div className="clinic-filter">
                    <label>Lọc theo địa điểm:&nbsp;</label>
                    <select value={filterLocation} onChange={this.handleFilterChange}>
                        <option value="all">Tất cả</option>
                        {this.getLocations().map(loc => (
                            <option value={loc} key={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
                <div className="clinic-list">
                    {filteredClinics.length === 0 && (
                        <div className="no-clinic">Không có phòng khám phù hợp</div>
                    )}
                    {filteredClinics.map((clinic, idx) => (
                        <div className="clinic-card" key={clinic.id || idx}>
                            <div className="clinic-img" onClick={() => this.handleViewDetailClinic(clinic)}>
                                <img src={clinic.image} alt={clinic.name} />
                            </div>
                            <div className="clinic-info">
                                <div className="clinic-name">{clinic.name}</div>
                                {clinic.address && (
                                    <div className="clinic-address">{clinic.address}</div>
                                )}
                                {clinic.descriptionMarkdown && clinic.descriptionMarkdown !== "Không có" ? (
                                    <div className="clinic-description">{clinic.descriptionMarkdown}</div>
                                ) : clinic.descriptionHTML && clinic.descriptionHTML !== "<p>Không có</p>" ? (
                                    <div className="clinic-description" dangerouslySetInnerHTML={{ __html: clinic.descriptionHTML }}></div>
                                ) : null}
                                {clinic.phone && (
                                    <div className="clinic-contacts">
                                        <div className="clinic-phone">
                                            <i className="fas fa-phone-alt"></i>
                                            <span>Điện thoại </span>
                                            <a href={`tel:${clinic.phone}`}>{clinic.phone}</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn
    };
};

export default withRouter(connect(mapStateToProps)(MedicalFacility));