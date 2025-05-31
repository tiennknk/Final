import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';

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

    render() {
        let arrDoctors = this.state.arrDoctors || [];
        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Bác sĩ nổi bật</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = `data:image/jpeg;base64,${item.image}`;
                                    }
                                    return (
                                        <div className='section-customize' key={index}>
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div
                                                        className='bg-image section-outstanding-doctor'
                                                        style={{
                                                            backgroundImage: `url(${imageBase64})`
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className='position text-center'>
                                                    <div className='name'>{item.lastName} {item.firstName}</div>
                                                    <div className='position'>{item.positionData?.valueVi || ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn,
        topDoctors: state.admin.topDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);