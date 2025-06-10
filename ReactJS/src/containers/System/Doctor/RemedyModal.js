import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "reactstrap";
import { toast } from "react-toastify";
import { CommonUtils } from "../../../utils";

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
        };
    }

    componentDidUpdate(prevProps) {
        // Lấy email đúng từ props
        if (this.props.dataModal !== prevProps.dataModal) {
            this.setState({
                email: this.props.dataModal.email || '',
            });
        }
    }

    handleOnchangeEmail = (event) => {
        this.setState({
            email: event.target.value,
        });
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64,
            });
        }
    };

    handleSendRemedy = () => {
        if (!this.state.email) {
            toast.error("Email không được bỏ trống!");
            return;
        }
        if (!this.state.imgBase64) {
            toast.error("Vui lòng chọn file hóa đơn!");
            return;
        }
        this.props.sendRemedy(this.state);
    }

    render() {
        let { isOpenModal, closeRemedyModal } = this.props;

        return (
            <Modal
                isOpen={isOpenModal}
                className={'remedy-modal-container'}
                size="md"
                centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Gửi hóa đơn khám bệnh thành công</h5>
                    <button type="button" className="close" onClick={closeRemedyModal}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="input-container">
                        <label>Email bệnh nhân:</label>
                        <input
                            type="email"
                            value={this.state.email}
                            onChange={this.handleOnchangeEmail}
                            disabled
                        />
                    </div>
                    <div className="input-container">
                        <label>Chọn file hóa đơn:</label>
                        <input
                            type="file"
                            onChange={this.handleOnchangeImage}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <Button color="primary" onClick={this.handleSendRemedy}>Gửi hóa đơn</Button>
                    <Button color="secondary" onClick={closeRemedyModal}>Đóng</Button>
                </div>
            </Modal>
        );
    }
}

export default connect()(RemedyModal);