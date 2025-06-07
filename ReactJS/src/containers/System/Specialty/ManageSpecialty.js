import React, {Component} from "react";
import {connect} from "react-redux";
import MardownIt from "markdown-it";
import Mdeditor from "react-markdown-editor-lite";
import {CommonUtils} from '../../../utils';
import {createNewSpecialty } from "../../../services/userService";
import { toast } from 'react-toastify';

const mdParser = new MardownIt();

class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        };
    }

    async componentDidMount() {
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        this.setState({
            [id]: value,
        });
    }

    // Sửa lại: nhận object { html, text }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        });
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    }

    handleSaveNewSpecialty = async () => {
        let res = await createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success("Tạo chuyên khoa thành công!");
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            });
        } else {
            toast.error("Tạo chuyên khoa thất bại!");
        }
    }

    render() {
        return (
            <div>
                <div className="ms-title"> Quản lý chuyên khoa </div>
                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label>Tên chuyên khoa</label>
                        <input
                            className="form-control"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Ảnh chuyên khoa</label>
                        <input
                            className="form-control-file"
                            type="file"
                            onChange={(event) => this.handleOnchangeImage(event)}
                        />
                    </div>
                    <div className="col-12 form-group">
                        <label>Mô tả chuyên khoa</label>
                        <Mdeditor
                            style={{height: '300px'}}
                            value={this.state.descriptionMarkdown}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                        />
                    </div>
                    <div className="col-12">
                        <button
                            className="btn btn-primary"
                            onClick={() => this.handleSaveNewSpecialty()}
                        >
                            Lưu thông tin
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);