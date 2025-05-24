import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


import Slider from "react-slick";


class Specialty extends Component {
    render() {
        
            return (
            <div>
                <div className='section-share section-specialty'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'>Chuyên Khoa Phổ Biến</span>
                            <button className='btn-section'>Xem thêm</button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                <div className='section-customize'>
                                    <div className='bg-image section-specialty' /> 
                                    <div>Chuyên khoa 1</div>
                                </div>
                                <div className='section-customize'>
                                    <div className='bg-image section-specialty' />
                                    <div>Chuyên khoa 1</div>
                                </div>
                                <div className='section-customize'>
                                    <div className='bg-image section-specialty' />
                                    <div>Chuyên khoa 1</div>
                                </div>
                                <div className='section-customize'>
                                    <div className='bg-image section-specialty' />
                                    <div>Chuyên khoa 1</div>
                                </div>
                            </Slider>
                        </div>
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

export default connect(mapStateToProps)(Specialty);