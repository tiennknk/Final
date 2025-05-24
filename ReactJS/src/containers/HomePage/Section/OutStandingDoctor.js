import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Slider from 'react-slick';

class OutStandingDoctor extends Component {
    render() {
        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Bác sĩ nổi bật</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            <div className='section-customize'>
                                <div className='customize-border'>
                                    <div className='outer-bg'>
                                    <div className='bg-image section-outstanding-doctor1'></div>
                                    </div>
                                <div className='position text-center'>
                                    <div className='name'>Nguyễn Văn A</div>
                                    <div className='position'>Chuyên khoa</div>
                                </div>
                                </div>
                            </div>
                            <div className='section-customize'>
                                <div className='customize-border'>
                                    <div className='outer-bg'>
                                    <div className='bg-image section-outstanding-doctor1'></div>
                                    </div>
                                <div className='position text-center'>
                                    <div className='name'>Nguyễn Văn A</div>
                                    <div className='position'>Chuyên khoa</div>
                                </div>
                                </div>
                            </div>
                            <div className='section-customize'>
                                <div className='customize-border'>
                                    <div className='outer-bg'>
                                    <div className='bg-image section-outstanding-doctor1'></div>
                                    </div>
                                <div className='position text-center'>
                                    <div className='name'>Nguyễn Văn A</div>
                                    <div className='position'>Chuyên khoa</div>
                                </div>
                                </div>
                            </div>
                            <div className='section-customize'>
                                <div className='customize-border'>
                                    <div className='outer-bg'>
                                    <div className='bg-image section-outstanding-doctor1'></div>
                                    </div>
                                <div className='position text-center'>
                                    <div className='name'>Nguyễn Văn A</div>
                                    <div className='position'>Chuyên khoa</div>
                                </div>
                                </div>
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

export default connect(mapStateToProps)(OutStandingDoctor);