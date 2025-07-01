import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageQrPayment from '../containers/System/Admin/ManageQrPayment';
import AdminStatistics from '../containers/System/Admin/AdminStatistics';

class System extends Component {
    render() {
        const {  isLoggedIn } = this.props;
        const systemMenuPath = '/system/user-redux';
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-schedule" component={ManageSchedule} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/manage-clinic" component={ManageClinic} />
                            <Route path="/system/manage-qr-payment" component={ManageQrPayment} />
                            <Route path="/system/statistics" component={AdminStatistics} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        
        isLoggedIn: state.user.isLoggedIn
    };
};

export default connect(mapStateToProps)(System);