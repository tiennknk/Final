import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SectionList.scss';

// Đường dẫn import ảnh phải là tương đối nếu không có alias
import img1 from '../../../assets/images/handbook/nong.jpg';
import img2 from '../../../assets/images/handbook/truyen-nhiem.jpg';
import img3 from '../../../assets/images/handbook/an uong.jpg';
import img4 from '../../../assets/images/handbook/kham.jpg';

const handbookArticles = [
    {
        id: 1,
        title: "Cẩm nang sức khỏe mùa hè",
        image: img1,
        summary: "Những lời khuyên giúp bạn bảo vệ sức khỏe trong mùa hè nắng nóng."
    },
    {
        id: 2,
        title: "Phòng tránh các bệnh truyền nhiễm",
        image: img2,
        summary: "Hướng dẫn phòng ngừa các bệnh thường gặp khi thời tiết thay đổi."
    },
    {
        id: 3,
        title: "Chế độ dinh dưỡng hợp lý",
        image: img3,
        summary: "Các nguyên tắc ăn uống để giữ cơ thể khỏe mạnh và phòng bệnh."
    },
    {
        id: 4,
        title: "Hướng dẫn kiểm tra sức khỏe định kỳ",
        image: img4,
        summary: "Tại sao nên kiểm tra sức khỏe định kỳ và cần lưu ý những gì?"
    },
];

class HandBook extends Component {
    render() {
        return (
            <div className="section-list-page">
                <div className="section-list-title">Cẩm nang</div>
                <div className="section-list">
                    {handbookArticles.length === 0 && (
                        <div className="no-section">Không có bài viết</div>
                    )}
                    {handbookArticles.map((article) => (
                        <div className="section-card handbook-card" key={article.id}>
                            <div className="section-img handbook-img">
                                {article.image ? (
                                    <img src={article.image} alt={article.title} />
                                ) : (
                                    <div className="handbook-img-placeholder" />
                                )}
                            </div>
                            <div className="section-info handbook-info">
                                <div className="section-name handbook-title">{article.title}</div>
                                <div className="section-description handbook-summary">{article.summary}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.admin.isLoggedIn
});

export default connect(mapStateToProps)(HandBook);