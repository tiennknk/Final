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

const getPatientProfile = async (req, res) => {
    try {
        const patientId = req.query.patientId;
        if (!patientId) {
            return res.status(400).json({ errCode: 1, errMessage: "Missing patientId" });
        }
        const info = await patientService.getPatientProfile(patientId);
        return res.status(200).json(info);
    } catch (error) {
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

const updatePatientProfile = async (req, res) => {
    try {
        const info = await patientService.updatePatientProfile(req.body);
        return res.status(200).json(info);
    } catch (error) {
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

const getPatientHistory = async (req, res) => {
    try {
        const patientId = req.query.patientId;
        if (!patientId) {
            return res.status(400).json({ errCode: 1, errMessage: "Missing patientId" });
        }
        const result = await patientService.getPatientHistory(patientId);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

export default {
    postBookAppointment,
    postVerifyBookingAppointment,
    getPatientProfile,
    updatePatientProfile,
    getPatientHistory
};