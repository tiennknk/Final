import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './MedicalFacility.scss';
import Slider from 'react-slick';

class MedicalFacility extends Component {
    render() {
        return (
            <div className='section-share section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cơ sở y tế nổi bật</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            <div className='section-customize'>
                                <div className='bg-image section-medical-facility1'></div>
                                <div>Cơ sở y tế 1</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-medical-facility1'></div>
                                <div>Cơ sở y tế 1</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-medical-facility1'></div>
                                <div>Cơ sở y tế 1</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-medical-facility1'></div>
                                <div>Cơ sở y tế 1</div>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-medical-facility1'></div>
                                <div>Cơ sở y tế 1</div>
                            </div>
                        </Slider>
                    </div>
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

export default connect(mapStateToProps)(MedicalFacility);