import React, {Component} from "react";
import {connect} from "react-redux";
import * as actions from "../../../store/actions";
import './TableManagerUser.scss';

class TableManagerUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersRedux: [],
        };
    }

    componentDidMount() {
        this.props.fetchAllUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers
            });
        }
    }

    handleDeleteUser = async (user) => {
        this.props.deleteUserRedux(user.id);
    }

    render() {
        let arrUsers = this.state.usersRedux;
        return (
            <div className="table-manager-user-wrapper">
                <table id="TableManagerUser">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Tên</th>
                            <th>Họ</th>
                            <th>Địa chỉ</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrUsers && arrUsers.length > 0 &&
                        arrUsers.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button
                                            className="btn-edit"
                                            onClick={() => this.props.handleEditUserFromParent(item)}
                                            title="Sửa"
                                        >
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => this.handleDeleteUser(item)}
                                            title="Xóa"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUserRedux: () => dispatch(actions.fetchAllUserStart()),
        deleteUserRedux: (userId) => dispatch(actions.deleteUser(userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManagerUser);