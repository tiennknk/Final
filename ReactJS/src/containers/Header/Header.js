import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import { USER_ROLE } from '../../utils';
import './Header.scss';

import _ from 'lodash';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { menuApp: [] };
    }

    componentDidMount() {
        this.updateMenu(this.props.userInfo);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.updateMenu(this.props.userInfo);
        }
    }

    updateMenu = (userInfo) => {
        let menu = [];
        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) menu = adminMenu;
            if (role === USER_ROLE.DOCTOR) menu = doctorMenu;
        }
        this.setState({ menuApp: menu });
    }

    render() {
        const { processLogout, userInfo } = this.props;
        return (
            <div className="system-header">
                <div className="header-left">
                    <Navigator menus={this.state.menuApp} />
                </div>
                <div className="header-right">
                    <span className="welcome-text">
                        Xin chào, {userInfo && userInfo.firstName ? userInfo.firstName : ''} !
                    </span>
                    <button className="btn-logout" onClick={processLogout}>
                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo
});

const mapDispatchToProps = dispatch => ({
    processLogout: () => dispatch(actions.processLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);