import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import Header from '../containers/Header/Header';
// import thêm các page khác nếu cần

class Doctor extends Component {
    render() {
        return (
            <React.Fragment>
                {/* Header luôn hiện ở trên, chứa menu phân quyền */}
                <Header />
                <div className="doctor-container">
                    <Switch>
                        <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                        {/* Thêm các route doctor khác nếu có */}
                    </Switch>
                </div>
            </React.Fragment>
        );
    }
}

export default Doctor;