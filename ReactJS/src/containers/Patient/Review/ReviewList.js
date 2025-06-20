import React, { useEffect, useState } from "react";
import { getAllReviewsService } from "../../../services/userService";
import "./ReviewList.scss";

const ReviewList = ({ doctorId, clinicId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        getAllReviewsService({ doctorId, clinicId })
            .then(res => {
                if (res && Array.isArray(res.data)) {
                    setReviews(res.data);
                } else {
                    setReviews([]);
                }
            })
            .catch(() => {
                setReviews([]);
            });
    }, [doctorId, clinicId]);
    
    const filteredReviews = reviews.filter(r => String(r.doctorId) === String(doctorId));

    return (
        <div className="review-list">
            <h4 className="review-list__title">Đánh giá</h4>
            {filteredReviews.length === 0 && <p className="review-list__empty">Chưa có đánh giá nào.</p>}
            <ul className="review-list__items">
                {filteredReviews.map(r => (
                    <li className="review-list__item" key={r.id}>
                        <span className="review-list__rating">
                            {'★'.repeat(r.rating)}
                            <span className="review-list__rating-faded">{'★'.repeat(5 - r.rating)}</span>
                        </span>
                        <span className="review-list__comment">{r.comment}</span>
                        {r.patient && (
                            <span className="review-list__author">
                                {r.patient.lastName} {r.patient.firstName}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewList;