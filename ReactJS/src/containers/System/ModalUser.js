import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../utils/emitter";

class ModalUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        };
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
            });
        });
    }

    componentDidMount() {}

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleAddNewUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.createNewUser(this.state, 'abc');
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => this.toggle()}
                className="modal-user-container"
                size="lg"
            >
                <ModalHeader toggle={() => this.toggle()}>Thêm mới</ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Email</label>
                            <input
                                type="email"
                                onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                value={this.state.email}
                            />
                        </div>
                        <div className="input-container">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                value={this.state.password}
                            />
                        </div>
                        <div className="input-container">
                            <label>Tên</label>
                            <input
                                type="text"
                                onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                value={this.state.firstName}
                            />
                        </div>
                        <div className="input-container">
                            <label>Họ</label>
                            <input
                                type="text"
                                onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                value={this.state.lastName}
                            />
                        </div>
                        <div className="input-container">
                            <label>Địa chỉ</label>
                            <input
                                type="text"
                                onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                value={this.state.address}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="px-3" onClick={() => this.handleAddNewUser()}>
                        Thêm mới
                    </Button>
                    <Button color="secondary" className="px-3" onClick={() => this.toggle()}>
                        Hủy bỏ
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);