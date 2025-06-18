import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import Header from '../containers/Header/Header';
import ManagePatient from '../containers/System/Doctor/ManagePatient';

class Doctor extends Component {
    render() {
        return (
            <React.Fragment>
                <Header />
                <div className="doctor-container">
                    <Switch>
                        <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                        <Route path="/doctor/manage-patient" component={ManagePatient} />
                        {/* Thêm các route doctor khác nếu có */}
                    </Switch>
                </div>
            </React.Fragment>
        );
    }
}

export default Doctor;