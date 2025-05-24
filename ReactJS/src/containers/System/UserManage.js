import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, editUserService, deleteUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        };
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            });
        }
    };

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        });
    };

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        });
    };

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        });
    };

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false
                });
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (e) {
            console.log(e);
        }
    };

    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    };

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        });
    };

    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                });
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        let arrUsers = this.state.arrUsers;

        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                <ModalEditUser
                    isOpen={this.state.isOpenModalEditUser}
                    toggleFromParent={this.toggleUserEditModal}
                    currentUser={this.state.userEdit}
                    editUser={this.doEditUser}
                />
                <div className="title">QUẢN LÝ NGƯỜI DÙNG</div>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
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
                            {arrUsers && arrUsers.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button
                                            className='btn-edit'
                                            onClick={() => this.handleEditUser(item)}
                                        >
                                            <i className='fas fa-pencil-alt'></i> Edit
                                        </button>
                                        <button
                                            className='btn-delete'
                                            onClick={() => this.handleDeleteUser(item)}
                                        >
                                            <i className='fas fa-trash'></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Nút thêm mới người dùng nổi ở góc phải dưới */}
                <button
                    className="add-user-btn-floating"
                    onClick={this.handleAddNewUser}
                >
                    <i className='fas fa-plus'></i> Thêm người dùng
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);