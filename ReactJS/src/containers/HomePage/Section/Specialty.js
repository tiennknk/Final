import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import './SectionList.scss';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
            filterName: ''
        };
        this._isMounted = false;
    }

    async componentDidMount() {
        this._isMounted = true;
        let res = await getAllSpecialty();
        if (this._isMounted && res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    handleFilterName = (e) => {
        this.setState({ filterName: e.target.value });
    }

    render() {
        const { dataSpecialty, filterName } = this.state;
        const keyword = filterName.trim().toLowerCase();
        const filteredSpecialties = keyword
            ? dataSpecialty.filter(item =>
                (item.name || '').toLowerCase().includes(keyword)
            )
            : dataSpecialty;

        return (
            <div id="specialty-section" className="section-list-page">
                <div className="section-list-title">Danh sách Chuyên Khoa</div>
                <div className="section-list-filter">
                    <label htmlFor="filterName">Tìm theo tên:&nbsp;</label>
                    <input
                        id="filterName"
                        type="text"
                        value={filterName}
                        placeholder="Nhập tên chuyên khoa..."
                        onChange={this.handleFilterName}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '5px',
                            border: '1px solid #e0e0e0',
                            fontSize: '15px',
                            minWidth: '220px'
                        }}
                    />
                </div>
                <div className="section-list">
                    {filteredSpecialties.length === 0 && (
                        <div className="no-section">Không có chuyên khoa phù hợp</div>
                    )}
                    {filteredSpecialties.map((item, idx) => (
                        <div className="section-card"
                             key={item.id || idx}
                             onClick={() => this.handleViewDetailSpecialty(item)}>
                            <div className="section-img">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="section-info">
                                <div className="section-name">{item.name}</div>
                                {item.description && (
                                    <div className="section-description">{item.description}</div>
                                )}
                            </div>
                        </div>
                    ))}
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

export default withRouter(connect(mapStateToProps)(Specialty));