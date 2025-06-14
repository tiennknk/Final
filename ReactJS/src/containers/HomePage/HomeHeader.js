import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import { FaSearch, FaSearchMinus } from "react-icons/fa";

// Hàm loại bỏ dấu tiếng Việt đơn giản, hiệu quả
function removeVietnameseTones(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAuthModal: false,
            searchValue: '',
            searchResults: [],
            searching: false,
            loading: false,
            allDoctors: [],
            allClinics: [],
            allSpecialties: [],
        };
        this.searchBoxRef = React.createRef();
        this.suggestRef = React.createRef();
    }

    componentDidMount() {
        this.fetchAllData();
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (
            this.suggestRef.current &&
            !this.suggestRef.current.contains(event.target) &&
            this.searchBoxRef.current &&
            !this.searchBoxRef.current.contains(event.target)
        ) {
            this.setState({ searching: false });
        }
    };

    async fetchAllData() {
        this.setState({ loading: true });
        try {
            const [doctorsRes, clinicsRes, specialtiesRes] = await Promise.all([
                axios.get('/api/get-all-doctors'),
                axios.get('/api/get-all-clinic'),
                axios.get('/api/get-all-specialty')
            ]);
            const allDoctors = (doctorsRes.data && doctorsRes.data.data)
                ? doctorsRes.data.data.map(d => ({
                    ...d,
                    name: d.name || `${d.lastName || ''} ${d.firstName || ''}`.trim(),
                    desc: d.positionData ? d.positionData.valueVi : '',
                    image: d.image || ''
                }))
                : [];
            const allSpecialties = (specialtiesRes.data && specialtiesRes.data.data)
                ? specialtiesRes.data.data.map(s => ({
                    ...s,
                    name: s.name || s.specialtyName || '',
                    desc: s.description || '',
                    image: s.image || ''
                }))
                : [];
            const allClinics = (clinicsRes.data && clinicsRes.data.data)
                ? clinicsRes.data.data.map(c => ({
                    ...c,
                    name: c.name || '',
                    desc: c.address || '',
                    image: c.image || ''
                }))
                : [];
            this.setState({
                allDoctors,
                allClinics,
                allSpecialties,
                loading: false
            });
        } catch (err) {
            this.setState({ loading: false });
        }
    }

    returntoHome = () => {
        if (this.props.history) {
            this.props.history.push('/home');
        }
    }

    toggleAuthModal = () => {
        this.setState(prev => ({
            showAuthModal: !prev.showAuthModal
        }));
    }

    scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    handleSearchInput = (e) => {
        this.setState({ searchValue: e.target.value, searching: !!e.target.value });
    }

    handleSearch = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        // Loại bỏ dấu và chuyển về chữ thường cho cả keyword và name khi filter
        const keyword = removeVietnameseTones(this.state.searchValue).toLowerCase().trim();
        if (!keyword) {
            this.setState({ searchResults: [], searching: false });
            return;
        }
        const { allDoctors, allClinics, allSpecialties } = this.state;
        const doctors = allDoctors.filter(d =>
            removeVietnameseTones(d.name || '').toLowerCase().includes(keyword)
        );
        const clinics = allClinics.filter(c =>
            removeVietnameseTones(c.name || '').toLowerCase().includes(keyword)
        );
        const specialties = allSpecialties.filter(s =>
            removeVietnameseTones(s.name || '').toLowerCase().includes(keyword)
        );
        const results = [
            ...doctors.map(d => ({ type: 'doctor', id: d.id, name: d.name, desc: d.desc, image: d.image })),
            ...clinics.map(c => ({ type: 'clinic', id: c.id, name: c.name, desc: c.desc, image: c.image })),
            ...specialties.map(s => ({ type: 'specialty', id: s.id, name: s.name, desc: s.desc, image: s.image }))
        ];
        this.setState({ searchResults: results, searching: true });
    }

    handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSearch(e);
        }
    }

    handleResultClick = (item) => {
        if (item.type === 'doctor') {
            this.props.history.push(`/detail-doctor/${item.id}`);
        } else if (item.type === 'clinic') {
            this.props.history.push(`/detail-clinic/${item.id}`);
        } else if (item.type === 'specialty') {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
        this.setState({ searching: false, searchValue: '' });
    }

    render() {
        const { searchValue, searchResults, searching, loading } = this.state;
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars" onClick={this.toggleAuthModal}></i>
                            <div className='header-logo' onClick={this.returntoHome}></div>
                            {this.state.showAuthModal && (
                                <div className="auth-modal">
                                    <button className="btn-auth" onClick={() => this.props.history.push('/register')}>Đăng ký</button>
                                    <button className="btn-auth" onClick={() => this.props.history.push('/login')}>Đăng nhập</button>
                                    <span className="close-modal" onClick={this.toggleAuthModal}>&times;</span>
                                </div>
                            )}
                        </div>
                        <div className='center-content'>
                            <div className='child-content' onClick={() => this.scrollToSection('specialty-section')}>
                                <div><b>Chuyên Khoa</b></div>
                                <div className='subs-title'>Tìm bác sĩ theo chuyên khoa</div>
                            </div>
                            <div className='child-content' onClick={() => this.scrollToSection('clinic-section')}>
                                <div><b>Cơ Sở Y Tế</b></div>
                                <div className='subs-title'>Chọn bệnh viện phòng khám</div>
                            </div>
                            <div className='child-content' onClick={() => this.scrollToSection('doctor-section')}>
                                <div><b>Bác Sĩ</b></div>
                                <div className='subs-title'>Chọn bác sĩ giỏi</div>
                            </div>
                            <div className='child-content' onClick={() => this.scrollToSection('package-section')}>
                                <div><b>Gói Khám</b></div>
                                <div className='subs-title'>Khám sức khỏe tổng quát</div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='banner-content'>
                            <div className='content-up'>
                                <div className='title1'>NỀN TẢNG Y TẾ</div>
                                <div className='title2'>CHĂM SÓC SỨC KHỎE TOÀN DIỆN</div>
                                <div className='search-wrapper' ref={this.searchBoxRef}>
                                    <form className='search' onSubmit={this.handleSearch} autoComplete="off">
                                        <FaSearch className="search-icon" onClick={this.handleSearch} />
                                        <input
                                            type='text'
                                            placeholder='Tìm kiếm...'
                                            value={searchValue}
                                            onChange={this.handleSearchInput}
                                            onKeyDown={this.handleSearchKeyDown}
                                            autoComplete="off"
                                            onFocus={() => { if (searchValue) this.setState({ searching: true }); }}
                                        />
                                        {loading && <span className="loading-search">Đang tải...</span>}
                                    </form>
                                    {searching && (
                                        <div className="search-suggest-list" ref={this.suggestRef}>
                                            {searchResults.length === 0 ? (
                                                <div className="search-suggest-empty">
                                                    <FaSearchMinus />
                                                    Không tìm thấy kết quả phù hợp
                                                </div>
                                            ) : (
                                                <ul>
                                                    {searchResults.slice(0, 8).map((item, idx) => (
                                                        <li
                                                            key={item.type + '_' + item.id}
                                                            tabIndex={0}
                                                            onClick={() => this.handleResultClick(item)}
                                                            onKeyDown={e => { if (e.key === 'Enter') this.handleResultClick(item) }}
                                                        >
                                                            {item.image &&
                                                                <img className="search-thumb" src={item.image} alt={item.name} />
                                                            }
                                                            <div className="search-info">
                                                                <span className="search-title">{item.name}</span>
                                                                {item.desc && <span className="search-desc">{item.desc}</span>}
                                                                <span className="search-type">
                                                                    {item.type === 'specialty'
                                                                        ? 'Chuyên khoa'
                                                                        : item.type === 'clinic'
                                                                            ? 'Cơ sở y tế'
                                                                            : 'Bác sĩ'}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                    {searchResults.length > 8 &&
                                                        <li className="more-result">Xem thêm {searchResults.length - 8} kết quả...</li>
                                                    }
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='content-down'>
                                <div className='options'>
                                    <div className='option-child'>
                                        <div className='icon-child'>
                                            <i className="fas fa-hospital-alt"></i>
                                        </div>
                                        <div className='text-child'>Khám Chuyên Khoa</div>
                                    </div>
                                    <div className='option-child'>
                                        <div className='icon-child'>
                                            <i className="fas fa-mobile-alt"></i>
                                        </div>
                                        <div className='text-child'>Khám Từ Xa</div>
                                    </div>
                                    <div className='option-child'>
                                        <div className='icon-child'>
                                            <i className="fas fa-flask"></i>
                                        </div>
                                        <div className='text-child'>Xét Nghiệm</div>
                                    </div>
                                    <div className='option-child'>
                                        <div className='icon-child'>
                                            <i className="fas fa-user-md"></i>
                                        </div>
                                        <div className='text-child'>Khám Tổng Quát</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

export default withRouter(connect(mapStateToProps)(HomeHeader));