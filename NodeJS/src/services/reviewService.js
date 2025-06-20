import db from "../models/index.js";

const createReview = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                (!data.doctorId && !data.clinicId) ||
                !data.patientId ||
                !data.rating
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                await db.Review.create({
                    doctorId: data.doctorId || null,
                    clinicId: data.clinicId || null,
                    patientId: data.patientId,
                    rating: data.rating,
                    comment: data.comment || null
                });
                resolve({
                    errCode: 0,
                    errMessage: "Đánh giá thành công",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllReviews = async (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Nếu muốn lọc theo doctorId/clinicId có thể truyền qua query
            let where = {};
            if (query.doctorId) where.doctorId = query.doctorId;
            if (query.clinicId) where.clinicId = query.clinicId;

            let data = await db.Review.findAll({
                where,
                include: [
                    {
                        model: db.User,
                        as: 'patient',
                        attributes: ['firstName', 'lastName']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            resolve({
                errCode: 0,
                errMessage: "OK",
                data
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getReviewsByTarget = async (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            let where = {};
            if (query.doctorId) where.doctorId = query.doctorId;
            if (query.clinicId) where.clinicId = query.clinicId;

            let data = await db.Review.findAll({
                where,
                include: [
                    {
                        model: db.User,
                        as: 'patient',
                        attributes: ['firstName', 'lastName']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            resolve({
                errCode: 0,
                errMessage: "OK",
                data
            });
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    createReview,
    getAllReviews,
    getReviewsByTarget,
};