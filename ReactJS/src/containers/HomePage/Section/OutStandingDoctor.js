import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import './SectionList.scss';

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctors !== this.props.topDoctors) {
            this.setState({
                arrDoctors: this.props.topDoctors || [],
            });
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    }

    render() {
        let arrDoctors = this.state.arrDoctors || [];
        return (
            <div id="doctor-section" className="section-list-page">
                <div className="section-list-title">Bác sĩ nổi bật</div>
                <div className="section-list">
                    {arrDoctors && arrDoctors.length > 0 ? (
                        arrDoctors.map((item, index) => {
                            let imageBase64 = '';
                            if (item.image) {
                                imageBase64 = `data:image/jpeg;base64,${item.image}`;
                            }
                            return (
                                <div
                                    className="section-card doctor-card"
                                    key={index}
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