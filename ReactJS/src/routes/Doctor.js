import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import Header from '../containers/Header/Header';

class Doctor extends Component {

    render() {
        const { isLoggedIn } = this.props;

        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn,
        systemMenuPath: state.app.systemMenuPath, // Assuming you have this in your Redux state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // Define any actions you want to dispatch here
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
