// doctorController.js

import lodash from 'lodash';
const { get } = lodash;
import db from "../models/index.js";
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
        // truyền đúng cả 2 tham số doctorId và date
        let result = await doctorService.getBookedTimeTypesByDate(req.query.doctorId, req.query.date);
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

        if (!doctorId || isNaN(Number(doctorId))) {
            console.error('Invalid doctorId received:', doctorId);
            return res.status(400).json({
                errCode: 2,
                errMessage: 'doctorId không hợp lệ!'
            });
        }

        let result = await doctorService.getHistoryPatientsByDoctor(Number(doctorId));
        // Debug log for output value

        return res.status(200).json(result);
    } catch (e) {
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

const deleteScheduleSlot = async (req, res) => {
    try {
      const { doctorId, date, timeType } = req.body;
      console.log('DELETE SLOT BODY:', req.body); // log để debug
      if (!doctorId || !date || !timeType) {
        return res.status(400).json({ errCode: 1, errMessage: "Thiếu tham số!" });
      }
      const deleted = await db.Schedule.destroy({
        where: { doctorId, date, timeType }
      });
      if (deleted) {
        return res.status(200).json({ errCode: 0, errMessage: "Đã xóa slot thành công!" });
      } else {
        return res.status(404).json({ errCode: 2, errMessage: "Không tìm thấy slot!" });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

const confirmPaymentCash = async (req, res) => {
    try {
        const { bookingCode } = req.body;
        const result = await doctorService.confirmPaymentCash(bookingCode);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errCode: -1, errMessage: "Server error" });
    }
};

const confirmQrPaymentStatus = async (req, res) => {
    try {
        const { bookingCode } = req.body;
        const result = await doctorService.confirmQrPaymentStatus(bookingCode);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
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
    deleteScheduleSlot,
    confirmPaymentCash,
    confirmQrPaymentStatus,
};