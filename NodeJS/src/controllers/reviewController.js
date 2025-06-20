import reviewService from "../services/reviewService.js";

let createReview = async (req, res) => {
    try {
        let info = await reviewService.createReview(req.body);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        });
    }
};

let getAllReviews = async (req, res) => {
    try {
        // Có thể nhận doctorId hoặc clinicId trên query string
        let info = await reviewService.getAllReviews(req.query);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        });
    }
};

let getReviewsByTarget = async (req, res) => {
    try {
        // Truyền vào doctorId hoặc clinicId trên query string
        let info = await reviewService.getReviewsByTarget(req.query);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        });
    }
};

export default {
    createReview,
    getAllReviews,
    getReviewsByTarget,
};