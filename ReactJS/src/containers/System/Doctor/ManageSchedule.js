import React, {Component} from 'react';
import {connect} from 'react-redux';

class ManageSchedule extends Component {
    
    render() {
        return (
            <React.Fragment>
                <div>Quản lý lịch hẹn</div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // Define any actions you want to dispatch here
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);