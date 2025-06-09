import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';

class HomeHeader extends Component {
    returntoHome = () => {
        if (this.props.history) {
            this.props.history.push('/home');
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <div className='header-logo' onClick={this.returntoHome}>
                                {/* <img src='https://bookingcare.vn/assets/icon/bookingcare-2020.svg' alt='logo' /> */}
                            </div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b>Chuyên Khoa</b></div>
                                <div className='subs-title'>Tìm bác sĩ theo chuyên khoa</div>
                            </div>
                            <div className='child-content'>
                                <div><b>Cơ Sở Y Tế</b></div>
                                <div className='subs-title'>Chọn bệnh viện phòng khám</div>
                            </div>
                            <div className='child-content'>
                                <div><b>Bác Sĩ</b></div>
                                <div className='subs-title'>Chọn bác sĩ giỏi</div>
                            </div>
                            <div className='child-content'>
                                <div><b>Gói Khám</b></div>
                                <div className='subs-title'>Khám sức khỏe tổng quát</div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <i className="fas fa-question-circle"></i>Hỗ trợ
                                <div className='flag'></div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'>NỀN TẢNG Y TẾ</div>
                            <div className='title2'>CHĂM SÓC SỨC KHỎE TOÀN DIỆN</div>
                            <div className='search'>
                                <i className="fas fa-search"></i>
                                <input type='text' placeholder='Tìm kiếm...' />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-hospital-alt"></i>
                                    </div>
                                    <div className='text-child'>Khám Chuyên Khoa</div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-mobile-alt"></i>
                                    </div>
                                    <div className='text-child'>Khám Từ Xa</div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-flask"></i>
                                    </div>
                                    <div className='text-child'>Xét Nghiệm</div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'>
                                        <i className="fas fa-user-md"></i>
                                    </div>
                                    <div className='text-child'>Khám Tổng Quát</div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

export default withRouter(connect(mapStateToProps)(HomeHeader));