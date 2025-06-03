import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import './TableManagerUser.scss';
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import './ManageDoctor.scss';
import Select from 'react-select';
import { getDetailInfoDoctor } from "../../../services/userService";
import { CRUD_ACTIONS } from "../../../utils";

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            selectedOption: null,
            listDoctors: [],
            hasOldData: false, // Biến để kiểm tra nếu có dữ liệu cũ

            listPrice: [],
            listPayment: [],
            listProvince: [],
            selectedPrice: null,
            selectedPayment: null,
            selectedProvince: null,
            nameClinic: '',
            addressClinic: '',
            note: '',
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getAllRequiredDoctorInfo(); // Lấy thông tin cần thiết cho bác sĩ
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            if (type === 'USER') {
                inputData.map((item) => {
                    let object = {};
                    object.label = `${item.firstName} ${item.lastName}`;
                    object.value = item.id;
                    result.push(object);
                    return null;
                });
            }
            if (type === 'PRICE' || type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item) => {
                    let object = {};
                    // SỬA LỖI: Dùng đúng field valueVi hoặc valueEn, KHÔNG PHẢI item.value
                    object.label = item.valueVi; // hoặc item.valueEn nếu muốn tiếng Anh
                    object.value = item.keyMap;
                    result.push(object);
                    return null;
                });
            }
        }
        return result;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USER');
            this.setState({
                listDoctors: dataSelect,
            });
        }

        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { rePayment, rePrice, reProvince } = this.props.allRequiredDoctorInfo;

            let dataSelectPrice = this.buildDataInputSelect(rePrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(rePayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(reProvince, 'PROVINCE');
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            });
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text
        });
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption?.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            priceId: this.state.selectedPrice ? this.state.selectedPrice.value : null,
            paymentId: this.state.selectedPayment ? this.state.selectedPayment.value : null,
            provinceId: this.state.selectedProvince ? this.state.selectedProvince.value : null,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
        });
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption });
        let { listPrice, listPayment, listProvince } = this.state;
        let res = await getDetailInfoDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let { Doctor_Infor } = res.data;
            let addressClinic = '', nameClinic = '', note = '',
            paymentId = '', priceId = '', provinceId = '',
            selectedPrice = '', selectedPayment = '', selectedProvince = '';

            if (res.data.Doctor_Infor) {
                addressClinic = Doctor_Infor.addressClinic;
                nameClinic = Doctor_Infor.nameClinic;
                note = Doctor_Infor.note;
                paymentId = Doctor_Infor.paymentId;
                priceId = Doctor_Infor.priceId;
                provinceId = Doctor_Infor.provinceId;
                
                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId;
                })

                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId;
                });
                
                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId;
                });
            }
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                nameClinic: nameClinic,
                addressClinic: addressClinic,
                note: note,
            });
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                nameClinic: '',
                addressClinic: '',
                note: '',
            });
        }
    }

    handleOnChangeDesc = (event) => {
        this.setState({ description: event.target.value });
    }

    handleChangeSelectDoctorInfo = (selectedOption, name) => {
        let stateName = name.name;
        this.setState({ [stateName]: selectedOption });
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        this.setState({
            [id]: value
        });
    }

    handleOnchangeText = (event, id) => {
        this.setState({
            [id]: event.target.value
        });
    }

    render() {
        let { hasOldData, listDoctors, listPrice, listPayment, listProvince, selectedOption, selectedPrice, selectedPayment, selectedProvince, nameClinic, addressClinic, note, description, contentMarkdown } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    Tạo thông tin bác sĩ
                </div>
                <div className="more-info">
                    <div className="content-left form-group">
                        <label>Chọn bác sĩ</label>
                        <Select
                            value={selectedOption}
                            onChange={this.handleChangeSelect}
                            options={listDoctors}
                            placeholder="Chọn bác sĩ..."
                        />
                    </div>
                    <div className="content-right">
                        <label>Thông tin giới thiệu: </label>
                        <textarea
                            className="form-control"
                            rows="4"
                            onChange={(event) => this.handleOnchangeText(event, "description")}
                            value={description}
                        />
                    </div>
                </div>
                <div className="more-info-extra row">
                    <div className="col-4 form-group">
                        <label>Chọn giá khám</label>
                        <Select
                            value={selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listPrice}
                            placeholder="Chọn giá khám..."
                            name="selectedPrice"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>Chọn phương thức thanh toán</label>
                        <Select
                            value={selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listPayment}
                            placeholder="Chọn phương thức thanh toán..."
                            name="selectedPayment"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>Chọn tỉnh thành</label>
                        <Select
                            value={selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listProvince}
                            placeholder="Chọn tỉnh thành..."
                            name="selectedProvince"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>Tên phòng khám</label>
                        <input
                            className="form-control"
                            value={nameClinic}
                            onChange={(event) => this.handleOnchangeText(event, "nameClinic")}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>Địa chỉ phòng khám</label>
                        <input
                            className="form-control"
                            value={addressClinic}
                            onChange={(event) => this.handleOnchangeText(event, "addressClinic")}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label>Ghi chú</label>
                        <input
                            className="form-control"
                            value={note}
                            onChange={(event) => this.handleOnchangeText(event, "note")}
                        />
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={contentMarkdown}
                    />
                </div>
                <button
                    onClick={this.handleSaveContentMarkdown}
                    className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"}>
                    {hasOldData === true ?
                        <span><i className="fas fa-save"></i> Lưu thông tin bác sĩ</span> :
                        <span><i className="fas fa-plus"></i> Tạo thông tin bác sĩ mới</span>
                    }
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getAllRequiredDoctorInfo: () => dispatch(actions.getAllRequiredDoctorInfo()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);