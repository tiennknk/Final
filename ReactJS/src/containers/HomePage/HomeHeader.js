import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaSearchMinus, FaUserCircle, FaBars } from "react-icons/fa";
import * as actions from '../../store/actions';

function removeVietnameseTones(str) {
    if (!str) return "";
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

const roleMap = {
    R1: "Quản trị viên",
    R2: "Bác sĩ",
    R3: "Người dùng"
};

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            searchResults: [],
            searching: false,
            loading: false,
            allDoctors: [],
            allClinics: [],
            allSpecialties: [],
            showAccountMenu: false,
        };
        this.searchBoxRef = React.createRef();
        this.suggestRef = React.createRef();
        this.accountMenuRef = React.createRef();
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchAllData();
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        // Đóng search suggest khi click ra ngoài
        if (
            this.suggestRef.current &&
            !this.suggestRef.current.contains(event.target) &&
            this.searchBoxRef.current &&
            !this.searchBoxRef.current.contains(event.target)
        ) {
            this.setState({ searching: false });
        }
        // Đóng account menu khi click ra ngoài
        if (
            this.accountMenuRef.current &&
            !this.accountMenuRef.current.contains(event.target)
        ) {
            this.setState({ showAccountMenu: false });
        }
    };

    async fetchAllData() {
        if (!this._isMounted) return;
        this.setState({ loading: true });
        try {
            const [doctorsRes, clinicsRes, specialtiesRes] = await Promise.all([
                axios.get('/api/get-all-doctors'),
                axios.get('/api/get-all-clinic'),
                axios.get('/api/get-all-specialty')
            ]);
            if (!this._isMounted) return;
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
            if (!this._isMounted) return;
            this.setState({
                allDoctors,
                allClinics,
                allSpecialties,
                loading: false
            });
        } catch (err) {
            if (this._isMounted) this.setState({ loading: false });
        }
    }

    returntoHome = () => {
        if (this.props.history) {
            this.props.history.push('/home');
        }
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

    handleLogin = () => {
        this.props.history.push('/login');
    };

    handleRegister = () => {
        this.props.history.push('/register');
    };

    handleLogout = () => {
        this.props.processLogout();
        this.setState({ showAccountMenu: false });
    };

    getRoleName = () => {
        const { userInfo } = this.props;
        if (!userInfo || !userInfo.roleId) return "Người dùng";
        return roleMap[userInfo.roleId] || "Người dùng";
    }

    getUserName = () => {
        const { userInfo } = this.props;
        if (!userInfo) return "";
        return userInfo.name || `${userInfo.lastName || ''} ${userInfo.firstName || ''}`.trim() || userInfo.username || "";
    }

    handleGoProfile = () => {
        this.props.history.push('/patient/profile');
        this.setState({ showAccountMenu: false });
    };

    handleGoHistory = () => {
        this.props.history.push('/patient/booking-history');
        this.setState({ showAccountMenu: false });
    };

    toggleAccountMenu = (e) => {
        e.stopPropagation();
        this.setState(prev => ({ showAccountMenu: !prev.showAccountMenu }));
    };

    render() {
        const { searchValue, searchResults, searching, loading, showAccountMenu } = this.state;
        const { isLoggedIn, userInfo } = this.props;

        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            {/* Nút menu fa-bars - click về trang chủ */}
                            <button
                                className="header-menu-btn"
                                onClick={this.returntoHome}
                                aria-label="Trở về trang chủ"
                            >
                                <FaBars />
                            </button>
                            {/* Logo cạnh menu */}
                            <div className='header-logo-wrap'>
                                {/* Thay src dưới đây bằng ảnh logo thực tế */}
                                <img
                                    src="/logo192.png"
                                    alt="Logo"
                                    className="header-logo-img"
                                />
                            </div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content' onClick={() => this.scrollToSection('specialty-section')}>
                                <div><b>CHUYÊN KHOA</b></div>
                                <div className='subs-title'>Tìm bác sĩ theo chuyên khoa</div>
                            </div>
                            <div className='child-content' onClick={() => this.scrollToSection('clinic-section')}>
                                <div><b>CƠ SỞ Y TẾ</b></div>
                                <div className='subs-title'>Chọn bệnh viện phòng khám</div>
                            </div>
                            <div className='child-content' onClick={() => this.scrollToSection('doctor-section')}>
                                <div><b>BÁC SĨ</b></div>
                                <div className='subs-title'>Chọn bác sĩ giỏi</div>
                            </div>
                            <div className='child-content' onClick={() => this.scrollToSection('package-section')}>
                                <div><b>GÓI KHÁM</b></div>
                                <div className='subs-title'>Khám sức khỏe tổng quát</div>
                            </div>
                        </div>
                        <div className="right-content">
                            {!isLoggedIn ? (
                                <div className="auth-buttons">
                                    <button className="btn-auth" onClick={this.handleRegister}>Đăng ký</button>
                                    <button className="btn-auth" onClick={this.handleLogin}>Đăng nhập</button>
                                </div>
                            ) : (
                                <div className="account-menu-wrapper" ref={this.accountMenuRef}>
                                    <div className="avatar-area" 
                                    onMouseDown={e => e.stopPropagation()}
                                    onClick={this.toggleAccountMenu}>
                                        {userInfo && userInfo.avatar ? (
                                            <img
                                                src={userInfo.avatar}
                                                alt="avatar"
                                                className="avatar-img"
                                            />
                                        ) : (
                                            <FaUserCircle className="avatar-img-default" />
                                        )}
                                        <span className="avatar-name">{this.getUserName()}</span>
                                        <span className="avatar-caret">&#9660;</span>
                                    </div>
                                    {showAccountMenu && (
                                        <div className="account-dropdown-menu">
                                            <div className="dropdown-item" onClick={this.handleGoProfile}>Thông tin cá nhân</div>
                                            <div className="dropdown-item" onClick={this.handleLogout}>Đăng xuất</div>
                                        </div>
                                    )}
                                </div>
                            )}
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

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
});
const mapDispatchToProps = dispatch => ({
    processLogout: () => dispatch(actions.processLogout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));