import React, { useState } from "react";
import { createReviewService } from "../../../services/userService";
import { toast } from "react-toastify";
import "./ReviewForm.scss";

const ReviewForm = ({ doctorId, clinicId, patientId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.warn("Vui lòng nhập nội dung đánh giá!");
            return;
        }
        setSubmitting(true);
        try {
            await createReviewService({ doctorId, clinicId, patientId, rating, comment });
            toast.success('Gửi đánh giá thành công!');
            setRating(5);
            setComment("");
            if (onSuccess) onSuccess();
        } catch {
            toast.error('Gửi đánh giá thất bại!');
        }
        setSubmitting(false);
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <div className="review-form__row">
                <label className="review-form__label">Số sao:</label>
                <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className="review-form__select"
                    disabled={submitting}
                >
                    {[5, 4, 3, 2, 1].map(star =>
                        <option key={star} value={star}>{star} sao</option>
                    )}
                </select>
            </div>
            <div className="review-form__row">
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Nhập bình luận..."
                    rows={3}
                    className="review-form__textarea"
                    required
                    disabled={submitting}
                />
            </div>
            <div className="review-form__row">
                <button type="submit" className="review-form__btn" disabled={submitting}>
                    {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;