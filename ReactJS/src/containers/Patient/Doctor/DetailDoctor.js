import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import './DetailDoctor.scss';
import { getDetailInfoDoctor } from "../../../services/userService";

class DetailDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {}
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailInfoDoctor(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data
                });
            }
        }
    }

    render() {
        let { detailDoctor } = this.state;
        let doctorName = '';
        let imageBase64 = '';

        if (detailDoctor) {
            doctorName = `${detailDoctor.lastName || ''} ${detailDoctor.firstName || ''}`.trim();

            if (detailDoctor.image) {
                if (detailDoctor.image.startsWith('data:image')) {
                    imageBase64 = detailDoctor.image;
                } else {
                    imageBase64 = `data:image/jpeg;base64,${detailDoctor.image}`;
                }
            }
        }

        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div
                            className="content-left"
                            style={{
                                backgroundImage: `url(${imageBase64})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}>
                        </div>
                        <div className="content-right">
                            <div className="up">
                                <h2>{doctorName}</h2>
                            </div>
                            <div className="down">
                                {detailDoctor.Markdown && detailDoctor.Markdown.description &&
                                    <span>{detailDoctor.Markdown.description}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="schedule-doctor"></div>
                    <div className="detail-infor-doctor">
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}></div>}
                    </div>
                    <div className="comment-doctor"></div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);