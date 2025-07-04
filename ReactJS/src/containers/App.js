import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.scss';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils';

import Login from './Auth/Login';
import Register from './Auth/Register';
import System from '../routes/System';
import Doctor from '../routes/Doctor';
import HomePage from './HomePage/HomePage';
import DetailDoctor from './Patient/Doctor/DetailDoctor';
import VerifyEmail from './Patient/VerifyEmail';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty';
import DetailClinic from './Patient/Clinic/DetailClinic';
import CustomScrollbars from '../components/CustomScrollbars';
import PatientProfile from './Patient/ProfilePatient';

class App extends React.Component {
    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <div className="main-container">
                    <div className="content-container">
                        <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                            <Switch>
                                {/* Trang HomePage giao diện chính */}
                                <Route path={path.HOMEPAGE} exact component={HomePage} />
                                <Route path={path.HOME} exact>
                                    <Redirect to={path.HOMEPAGE} />
                                </Route>
                                <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                <Route path="/register" component={userIsNotAuthenticated(Register)} />
                                <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                <Route path={'/doctor'} component={userIsAuthenticated(Doctor)} />
                                <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                <Route path={path.DETAIL_SPECIALTY} component={DetailSpecialty} />
                                <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                                <Route path={'/verify-email'} component={VerifyEmail} />
                                <Route path={'/verify-booking'} component={VerifyEmail} />
                                <Route path="/patient/profile" component={PatientProfile} />
                                {/* Fallback route */}
                                <Route component={HomePage} />
                            </Switch>
                        </CustomScrollbars>
                    </div>
                    <ToastContainer
  position="bottom-left"
  autoClose={3500}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  className="custom-toast-container"
/>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    started: state.app?.started,
    isLoggedIn: state.user?.isLoggedIn
});

export default connect(mapStateToProps)(App);