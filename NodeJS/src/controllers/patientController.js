import patientService from "../services/patientService.js";

const postBookAppointment = async (req, res) => {
    try {
        let info = await patientService.postBookAppointment(req.body);
        return res.status(200).json(info);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Có lỗi xảy ra ở máy chủ, vui lòng thử lại sau!',
        });
    }
}

const postVerifyBookingAppointment = async (req, res) => {
    try {
        let info = await patientService.postVerifyBookingAppointment(req.body);
        return res.status(200).json(info);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Có lỗi xảy ra ở máy chủ, vui lòng thử lại sau!',
        });
    }
}

export default {
    postBookAppointment,
    postVerifyBookingAppointment,
};