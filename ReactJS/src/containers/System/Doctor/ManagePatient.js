import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "../../../components/Input/DatePicker";
import { getAllPatientForDoctor, postSendRemedy } from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import "./ManagePatient.scss";

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
        };
    }

    async componentDidMount() {
        await this.getDataPatient();
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatDate = new Date(currentDate).getTime();
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatDate
        });
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            });
        } else {
            this.setState({
                dataPatient: []
            });
        }
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        }, async () => {
            await this.getDataPatient();
        });
    };

    handleConfirmPatient = (item) => {
        // Truyền đủ dữ liệu vào modal
        let data = {
            patientId: item.patientId,
            doctorId: item.doctorId,
            timeType: item.timeType,
            date: item.date,
            email: item.patientData.email,
            patientName: `${item.patientData.firstName} ${item.patientData.lastName}`,
        };
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data,
        });
    };

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {},
        });
    };

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({ isShowLoading: true });

        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            date: dataModal.date,
            patientName: dataModal.patientName,
        });

        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false,
            });
            toast.success("Gửi hóa đơn thành công!");
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            this.setState({ isShowLoading: false });
            toast.error("Gửi hóa đơn thất bại!");
        }
    };

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Đang xử lý...'
                >
                    <div className="manage-patient-container">
                        <div className="m-p-title">QUẢN LÝ BỆNH NHÂN</div>
                        <div className="m-p-body">
                            <div className="form-group">
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className="col-12 table-manage-patient">
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ tên</th>
                                            <th>Giới tính</th>
                                            <th>Địa chỉ</th>
                                            <th>Hành động</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ? (
                                            dataPatient.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.timeTypeDataPatient?.valueVi || ""}</td>
                                                    <td>{item.patientData.firstName} {item.patientData.lastName}</td>
                                                    <td>{item.patientData.genderData?.valueVi || ""}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>
                                                        <button
                                                            className="mp-btn-confirm"
                                                            onClick={() => this.handleConfirmPatient(item)}
                                                        >
                                                            Xác nhận
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center' }}>Không có dữ liệu bệnh nhân</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        closeRemedyModal={this.closeRemedyModal}
                        dataModal={dataModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);