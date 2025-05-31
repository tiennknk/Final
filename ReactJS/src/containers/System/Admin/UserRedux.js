import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import LightBox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManagerUser from './TableManagerUser';
import './UserRedux.scss';
import { CRUD_ACTIONS, CommonUtils } from '../../../utils';
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phonenumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',
            action: CRUD_ACTIONS.CREATE,
            userEditId: null,
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            });
        }

        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            });
        }

        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            });
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrRoles = this.props.roleRedux;
            let arrPositions = this.props.positionRedux;
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phonenumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgURL: '',
                userEditId: null,
            });
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64,
            });
        }
    }

    checkValidateInput = () => {
        let isValid = true;
        let requiredFields = ['email', 'password', 'firstName', 'lastName', 'phonenumber', 'address'];
        for (let field of requiredFields) {
            if (!this.state[field]) {
                isValid = false;
                alert(`Missing parameter: ${field}`);
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = (e) => {
        e.preventDefault();
        let isValid = this.checkValidateInput();
        if (!isValid) return;

        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phonenumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            });
        } else if (action === CRUD_ACTIONS.EDIT) {
            this.props.editAUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phonenumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            });
        }
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({ isOpen: true });
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }
        this.setState({
            email: user.email,
            password: 'hardcode',
            firstName: user.firstName,
            lastName: user.lastName,
            phonenumber: user.phonenumber,
            address: user.address,
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            avatar: '',
            previewImgURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
        });
    }

    handleEditorChange = ({ html, text }) => {
        console.log("handleEditorChange", html, text);
    }

    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let isGetGender = this.props.isLoadingGender;

        let { email, password, firstName, lastName, phonenumber, address, gender, position, role } = this.state;
        let { previewImgURL, isOpen } = this.state;

        return (
            <div className="user-redux-container">
                <div className="title">THÊM MỚI NGƯỜI DÙNG</div>
                <form onSubmit={this.handleSaveUser}>
                    <div className="user-redux-body container">
                        <div className="row">
                            <div className="col-12">{isGetGender === true ? 'Loading genders...' : null}</div>
                            {/* 2 col trên 1 dòng */}
                            <div className="col-6">
                                <label>Email</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => this.onChangeInput(e, 'email')} />
                            </div>
                            <div className="col-6">
                                <label>Mật khẩu</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => this.onChangeInput(e, 'password')} />
                            </div>
                            <div className="col-6">
                                <label>Tên</label>
                                <input type="text" className="form-control" value={firstName} onChange={(e) => this.onChangeInput(e, 'firstName')} />
                            </div>
                            <div className="col-6">
                                <label>Họ</label>
                                <input type="text" className="form-control" value={lastName} onChange={(e) => this.onChangeInput(e, 'lastName')} />
                            </div>
                            <div className="col-6">
                                <label>Số điện thoại</label>
                                <input type="text" className="form-control" value={phonenumber} onChange={(e) => this.onChangeInput(e, 'phonenumber')} />
                            </div>
                            <div className="col-6">
                                <label>Địa chỉ</label>
                                <input type="text" className="form-control" value={address} onChange={(e) => this.onChangeInput(e, 'address')} />
                            </div>
                            <div className="col-4">
                                <label>Giới tính</label>
                                <select className="form-control" value={gender} onChange={(e) => this.onChangeInput(e, 'gender')}>
                                    {genders && genders.length > 0 && genders.map((item, index) => (
                                        <option key={index} value={item.keyMap}>{item.valueVi}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-4">
                                <label>Chức vụ</label>
                                <select className="form-control" value={position} onChange={(e) => this.onChangeInput(e, 'position')}>
                                    {positions && positions.length > 0 && positions.map((item, index) => (
                                        <option key={index} value={item.keyMap}>{item.valueVi}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-4">
                                <label>Vai trò</label>
                                <select className="form-control" value={role} onChange={(e) => this.onChangeInput(e, 'role')}>
                                    {roles && roles.length > 0 && roles.map((item, index) => (
                                        <option key={index} value={item.keyMap}>{item.valueVi}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Ảnh đại diện */}
                            <div className="col-12 d-flex align-items-center mt-2">
                                <div>
                                    <label>Ảnh đại diện: </label>
                                    <input id="previewImg" type="file" hidden onChange={this.handleOnChangeImage} />
                                    <label className="label-upload" htmlFor="previewImg">
                                        Tải ảnh  <i className="fas fa-upload"></i>
                                    </label>
                                </div>
                                <div>
                                    <div
                                        className="preview-image"
                                        style={{ backgroundImage: `url(${previewImgURL})` }}
                                        onClick={this.openPreviewImage}
                                    ></div>
                                </div>
                            </div>
                            {/* Nút lưu */}
                            <div className="col-12 my-3 btn-save-wrapper">
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </div>
                    </div>
                </form>
                {/* Bảng user */}
                <div className="table-wrapper-right">
                    <TableManagerUser handleEditUserFromParent={this.handleEditUserFromParent} />
                </div>
                {/* Markdown Editor đặt ngoài bảng user */}
                <div className="markdown-editor-wrapper">
                    <MdEditor
                        style={{ height: "500px" }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                    />
                </div>
                {isOpen && (
                    <LightBox
                        mainSrc={previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    genderRedux: state.admin.genders,
    roleRedux: state.admin.roles,
    positionRedux: state.admin.positions,
    listUsers: state.admin.users,
    isLoadingGender: state.admin.isLoadingGender,
});

const mapDispatchToProps = dispatch => ({
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
    editAUserRedux: (data) => dispatch(actions.editAUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);