import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import Header from '../containers/Header/Header';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import DoctorHistory from '../containers/System/Doctor/DoctorHistory';

class Doctor extends Component {
    render() {
        return (
            <React.Fragment>
                <Header />
                <div className="doctor-container">
                    <Switch>
                        <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                        <Route path="/doctor/manage-patient" component={ManagePatient} />
                        <Route path="/doctor/history" component={DoctorHistory} />
                        <Route component={() => <Redirect to="/doctor/manage-schedule" />} />
                    </Switch>
                </div>
            </React.Fragment>
        );
    }
}

export default Doctor;