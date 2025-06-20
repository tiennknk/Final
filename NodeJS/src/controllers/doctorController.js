// doctorController.js

import lodash from 'lodash';
const { get } = lodash;

import doctorService from '../services/doctorService.js';

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10; // Default limit if not provided
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            errorCode: -1,
            message: 'Error from server',
        });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errorCode: -1,
            message: 'Error from server',
        });
    }
}

const getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errorCode: -1,
            message: 'Error from server',
        });
    }
}

const postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
}

const saveBulkScheduleDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveBulkScheduleDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
}

const getScheduleByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
}

const getExtraInfoDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getExtraInfoDoctorById(req.query.doctorId);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
}

const getProfileDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
}

const getListPatientForDoctor = async (req, res) => {
    try {
        let info = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errorCode: -1,
            message: 'Error from server',
        });
    }
}

const sendRemedy = async (req, res) => {
    try {
        let response = await doctorService.sendRemedy(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errorCode: -1,
            message: 'Error from server',
        });
    }
}

const getBookedTimeTypesByDate = async (req, res) => {
    try {
        let result = await doctorService.getBookedTimeTypesByDate(req.query.doctorId);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

// DEBUG: Add detailed logs for input and output
const getHistoryPatientsByDoctor = async (req, res) => {
    try {
        let doctorId = req.query.doctorId;
        // Debug log for input value
        console.log('DEBUG getHistoryPatientsByDoctor - doctorId:', doctorId);

        if (!doctorId || isNaN(Number(doctorId))) {
            console.error('Invalid doctorId received:', doctorId);
            return res.status(400).json({
                errCode: 2,
                errMessage: 'doctorId không hợp lệ!'
            });
        }

        let result = await doctorService.getHistoryPatientsByDoctor(Number(doctorId));
        // Debug log for output value
        console.log('DEBUG getHistoryPatientsByDoctor - result:', result);
        return res.status(200).json(result);
    } catch (e) {
        console.error('ERROR in getHistoryPatientsByDoctor:', e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Có lỗi xảy ra ở máy chủ!',
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const result = await doctorService.cancelBooking(bookingId);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

export default {
    getTopDoctorHome,
    getAllDoctors,
    postInfoDoctor,
    getDetailDoctorById,
    saveBulkScheduleDoctor,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy,
    getBookedTimeTypesByDate,
    getHistoryPatientsByDoctor,
    cancelBooking,
};