import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';
import HandBook from './Section/HandBook';
import Footer from './Section/Footer';
import './HomePage.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class HomePage extends React.Component {
    render() {
        const { isLoggedIn, userInfo } = this.props;
        // Redirect user theo role nếu cần
        if (isLoggedIn && userInfo) {
            if (userInfo.roleId === 'R1') return <Redirect to="/system/user-manage" />;
            if (userInfo.roleId === 'R2') return <Redirect to="/doctor" />;
            // Nếu muốn user thường về /home, không cần redirect
        }

        let settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            arrows: true,
        };

        return (
            <div>
                <HomeHeader isShowBanner={true} />
                <Specialty settings={settings} />
                <MedicalFacility settings={settings} />
                <OutStandingDoctor settings={settings} />
                <HandBook settings={settings} />
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo
});

export default connect(mapStateToProps)(HomePage);