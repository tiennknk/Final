import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {getAllSpecialty} from '../../../services/userService';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Slider from "react-slick";


class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: []
        };
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            });
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let { dataSpecialty } = this.state;
            return (
            <div>
                <div className='section-share section-specialty'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'>Chuyên Khoa Phổ Biến</span>
                            <button className='btn-section'>Xem thêm</button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                {dataSpecialty && dataSpecialty.length > 0 &&
                                    dataSpecialty.map((item, index) => {
                                        return (
                                            <div className='section-customize specialty-child' key={index} 
                                                onClick={() => this.handleViewDetailSpecialty(item)}>
                                                <div className='bg-image section-specialty'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                ></div>
                                                <h3>{item.name}</h3>
                                            </div>
                                        );
                                    })
                                }
                            </Slider>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));