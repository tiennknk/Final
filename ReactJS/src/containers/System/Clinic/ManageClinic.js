import React,{Component} from 'react';
import { connect } from 'react-redux';
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import {CommonUtils} from '../../../utils';
import {createNewClinic} from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: ''
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            });
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html
        });
    };

    handleSaveNewClinic = async () => {
        let res = await createNewClinic({
            name: this.state.name,
            address: this.state.address,
            imageBase64: this.state.imageBase64,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown
        });

        if (res && res.errCode === 0) {
            toast.success("Tạo mới phòng khám thành công!");
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: ''
            });
        } else {
            toast.error("Có lỗi xảy ra: " + res.errMessage);
        }
    }

    render() {
        return (
            <div>
                <div className="ms-title"> Quản lý phòng khám </div>
                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label>Tên phòng khám</label>
                        <input
                            className="form-control"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Ảnh phòng khám</label>
                        <input
                            className="form-control-file"
                            type="file"
                            onChange={(event) => this.handleOnChangeImage(event)}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Địa chỉ phòng khám</label>
                        <input
                            className="form-control"
                            type="text"
                            value={this.state.address}
                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                        />
                    </div>
                    <div className="col-12 form-group">
                        <label>Mô tả phòng khám</label>
                        <MdEditor
                            style={{height: '300px'}}
                            value={this.state.descriptionMarkdown}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                        />
                    </div>
                    <div className="col-12">
                        <button
                            className="btn btn-primary"
                            onClick={() => this.handleSaveNewClinic()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);