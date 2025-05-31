import React, {Component} from "react";
import {connect} from "react-redux";
import * as actions from "../../../store/actions";
import './TableManagerUser.scss';
import {FormattedMessage} from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import './ManageDoctor.scss';
import Select from 'react-select';
import { saveDetailDoctor } from "../../../services/userService";

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            selectedOption: null,
            listDoctors: []
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.forEach(item => {
                let object = {};
                // Nếu API trả về firstName, lastName:
                object.label = `${item.firstName} ${item.lastName}`;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
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
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption?.value
        });
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
    }

    handleOnChangeDesc = (event) => {
        this.setState({ description: event.target.value });
    }

    render() {
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    Tạo thông tin bác sĩ
                </div>
                <div className="more-info">
                    <div className="content-left form-group">
                        <label>Chọn bác sĩ</label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={this.state.listDoctors}
                            placeholder="Chọn bác sĩ..."
                        />
                    </div>
                    <div className="content-right">
                        <label>Thông tin giới thiệu: </label>
                        <textarea
                            className="form-control"
                            rows="4"
                            onChange={this.handleOnChangeDesc}
                            value={this.state.description} 
                        />
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                    />
                </div>
                <button 
                    className="save-content-doctor"
                    onClick={this.handleSaveContentMarkdown}
                >
                    Lưu thông tin
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);